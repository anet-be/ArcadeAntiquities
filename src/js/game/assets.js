import {assetArray} from "./gameData.js";
import {isPreviewLoaded, reloadPreview, showPreview} from "./preview.js";

export function updateGameTitle(game) {
    const titleElement = document.getElementById("game-title");
    if (titleElement) {
        titleElement.textContent = game?.versionName || "Unknown Project";
    } else {
        console.error("Element #game-title not found.");
    }
}

export function displayAssets(assets) {
    const assetsContainer = document.getElementById("assetsContainer");
    assetsContainer.innerHTML = "";

    assets.forEach(asset => {
        const assetElement = createAssetElement(asset);
        assetsContainer.appendChild(assetElement);
    });
}

function createAssetElement(asset) {

    const assetElement = document.createElement("div");
    assetElement.classList.add("mb-4", "d-flex", "align-items-center", "justify-content-between");

    const titleContainer = createTitleContainer(asset);
    assetElement.appendChild(titleContainer);

    if (asset.assetType === "IMAGE") {
        assetElement.appendChild(createImagePreview(asset));
    } else if (asset.assetType === "AUDIO") {
        assetElement.appendChild(createAudioPreview(asset));
    }

    return assetElement;
}

function createTitleContainer(asset) {
    const titleContainer = document.createElement("div");
    titleContainer.classList.add("d-flex", "align-items-center");

    const assetTitle = document.createElement("h4");
    assetTitle.classList.add("text-secondary", "me-2");
    assetTitle.textContent = asset.fileName;

    const uploadIconWrapper = createUploadIcon(asset);
    titleContainer.appendChild(assetTitle);
    titleContainer.appendChild(uploadIconWrapper);

    return titleContainer;
}

function createUploadIcon(asset) {
    const inputFile = document.createElement("input");
    inputFile.type = "file";
    inputFile.accept = asset.assetType === "IMAGE" ? "image/*" : "audio/*";
    inputFile.style.display = "none";

    inputFile.addEventListener("change", (event) => {
        handleFileUpload(event, asset)

        if (isPreviewLoaded) {
            reloadPreview();
        } else {
            showPreview();
        }
    });

    const uploadIcon = document.createElement("i");
    uploadIcon.classList.add("bi", "bi-upload", "fs-4", "text-primary", "cursor-pointer");
    uploadIcon.addEventListener("click", () => inputFile.click());

    const wrapper = document.createElement("div");
    wrapper.appendChild(inputFile);
    wrapper.appendChild(uploadIcon);

    return wrapper;
}

function handleFileUpload(event, asset) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const url = e.target.result;
        updateAssetUrl(asset.fileName, url);
        asset.url = url;
        asset.assetType = file.type.startsWith("image") ? "IMAGE" : "AUDIO";
        document.getElementById("assetsContainer").replaceChild(createAssetElement(asset), event.target.closest('.mb-4'));
        document.getElementById("add-version").classList.remove("disabled");
    };
    reader.readAsDataURL(file);
}

function createImagePreview(asset) {
    return createPreviewElement("img", asset.url, "5vw", "8vh");
}

function createAudioPreview(asset) {
    const audioElement = document.createElement("audio");
    audioElement.src = asset.url;
    audioElement.controls = false;
    return createSoundIconContainer(audioElement);
}

function createSoundIconContainer(audioElement) {
    const container = document.createElement("div");
    container.style.width = "5vw";
    container.style.height = "8vh";
    container.classList.add("d-flex", "align-items-center", "justify-content-center");

    const soundIcon = createSoundIcon(audioElement);
    container.appendChild(soundIcon);

    return container;
}

function createSoundIcon(audioElement) {
    const soundIcon = document.createElement("i");
    soundIcon.classList.add("bi", "bi-volume-up-fill", "fs-4", "text-secondary", "cursor-pointer");
    soundIcon.addEventListener("click", () => audioElement.paused ? audioElement.play() : audioElement.pause());

    return soundIcon;
}

function createPreviewElement(tag, src, width, height) {
    const container = document.createElement("div");
    container.style.width = width;
    container.style.height = height;
    container.classList.add("d-flex", "align-items-center", "justify-content-center");

    if (tag === "img") {
        const image = document.createElement("img");
        image.src = src;
        image.style.width = width;
        image.style.height = height;
        image.classList.add("rounded", "shadow", "mt-2");
        container.appendChild(image);
    }

    return container;
}

function updateAssetUrl(fileName, url) {
    assetArray.find(a => a.name === fileName).url = url;
}