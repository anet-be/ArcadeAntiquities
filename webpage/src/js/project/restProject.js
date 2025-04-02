export async function fetchGamesFromProject(id) {
    try {
        const response = await fetch(`http://localhost:8081/api/projects/${id}/game-versions`);

        if (!response.ok) {
            throw new Error(`Error fetching games: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error:", error);
        return [];
    }
}
export async function fetchProjectVersionsOfProject(id) {
    try {
        const response = await fetch(`http://localhost:8081/api/projects/${id}/project-versions`);

        if (!response.ok) {
            throw new Error(`Error fetching project versions: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error:", error);
        return [];
    }
}
export async function fetchGamesFromProjectVersion(id) {
    try {
        const response = await fetch(`http://localhost:8081/api/project-versions/${id}/game-versions`);

        if (!response.ok) {
            throw new Error(`Error fetching games: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error:", error);
        return [];
    }
}
export async function createProjectVersion(id, gameVersionIds) {
    try {
        const response = await fetch(`http://localhost:8081/api/projects/${id}/project-versions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                gameVersionIds: gameVersionIds,
            }),
        });

        if (!response.ok) {
            throw new Error(`Error creating project version: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error:", error);
        return [];
    }
}
export function uploadToRaspberryPi(projectVersionId){
    if (!projectVersionId) {
        alert("No projectId found. Please try again.");
        return;
    }

    const formData = new FormData();
    formData.append("projectVersionId", projectVersionId);

    fetch("http://localhost:8081/api/git-repos/upload-project", {
        method: "POST",
        body: formData
    })
        .then(response => response.text())
        .then(data => {
            alert(data);
        })
        .catch(error => {
            console.error("Error uploading file:", error);
            alert("Upload to repo failed. Please try again.");
        });
}