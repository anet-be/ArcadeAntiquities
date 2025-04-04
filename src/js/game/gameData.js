import { fetchGameVersion, fetchAssetsOfGameVersion } from "./restGame.js";
import {updateGameTitle, displayAssets} from "./assets.js";

export let game = {};
export let assetArray = [];

export async function loadGameData(gameId) {
    game = await fetchGameVersion(gameId);
    const assets = await fetchAssetsOfGameVersion(gameId);

    assets.forEach(asset => addAsset(asset));
    assets.forEach(asset => asset.url = `http://localhost:8081/${asset.url}`);
    document.getElementById("add-version").classList.add("disabled");

    updateGameTitle(game);
    displayAssets(assets);
}

function addAsset(asset) {
    assetArray.push({
        name: asset.fileName,
        url: `http://localhost:8081/${asset.url}`,
        assetType: asset.assetType
    });
}
