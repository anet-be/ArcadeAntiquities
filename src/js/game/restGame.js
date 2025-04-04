export async function fetchGameVersion(id) {
    try {
        const response = await fetch(`http://localhost:8081/api/game-versions/${id}`);
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error("Failed to fetch game with id: " + id);
        }
    } catch (error) {
        return [];
    }
}

export async function fetchAssetsOfGameVersion(id) {
    try {
        const response = await fetch(`http://localhost:8081/api/game-versions/${id}/assets`);
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error("Failed to fetch assets from game with id: " + id);
        }
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function createGameVersion(gameId, versionName, versionRules, assets) {
    try {
        const response = await fetch("http://localhost:8081/api/game-versions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                baseGameId: gameId,
                versionName: versionName,
                versionRules: versionRules,
                assets: assets,
            })
        });
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error("Failed to create game version");
        }
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function fetchGame(id) {
    try {
        const response = await fetch(`http://localhost:8081/api/games/${id}`);
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error("Failed to fetch game with id: " + id);
        }
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function fetchProjectByGameVersion(gameVersionId) {
    try {
        const response = await fetch(`http://localhost:8081/api/game-versions/${gameVersionId}/project`);
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error("Failed to fetch project by game version id: " + gameVersionId);
        }
    } catch (error) {
        console.error(error);
        return [];
    }
}