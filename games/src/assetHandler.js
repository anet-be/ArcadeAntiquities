const images = require.context("../assets", true, /\.(png|jpe?g|webp|svg)$/);
const sounds = require.context("../assets", true, /\.(mp3|wav|ogg)$/);

export function loadImage(imageName) {
    // Find the first image that includes the requested imageName
    const imagePath = images.keys().find(path => path.includes(imageName));
    console.log(imagePath);
    if (imagePath) {
        return images(imagePath); // Return the correct image path
    } else {
        console.warn(`Image "${imageName}" not found.`);
        return null;
    }
}

export function loadSound(soundName) {
    // Find the first sound that includes the requested soundName
    const soundPath = sounds.keys().find(path => path.includes(soundName));
    console.log(soundPath);
    if (soundPath) {
        return new Audio(sounds(soundPath)); // Return an Audio object
    } else {
        console.warn(`Sound "${soundName}" not found.`);
        return null;
    }
}