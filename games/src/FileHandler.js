const assetFiles = require.context('../assets', true);

export function getGameNames() {
    const subdirectoryNames = new Set(
        assetFiles.keys().map((file) => {
            const parts = file.split('/');
            return parts.length > 2 ? parts[1] : null;
        }).filter(Boolean) // Remove null values
    );

    return subdirectoryNames;
}

export function getGamePage(directory) {
    const checkPacMan = assetFiles.keys().some((file) => file.endsWith(`${directory}/pac0.png`));
    const checkSpaceInvader = assetFiles.keys().some((file) => file.endsWith(`${directory}/space.png`));

    if (checkPacMan) {
        return "pacman.html";
    }
    if (checkSpaceInvader) {
        return "space-invader.html";
    }
    return null;
}