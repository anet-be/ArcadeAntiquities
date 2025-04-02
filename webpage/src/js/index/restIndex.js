const API_URL = "http://localhost:8081";


export async function fetchProject(id) {
    try {
        const response = await fetch(`${API_URL}/api/projects/${id}`, {
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${await response.text()}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to fetch projects:", error);
        return [];
    }
}

export async function fetchProjects() {
    try {
        const response = await fetch(`${API_URL}/api/projects`, {
            headers: {
                'Accept': 'application/json'
            }
        });

        console.log(response);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${await response.text()}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to fetch projects:", error);
        return [];
    }
}

export async function createProject(project) {
    const response = await fetch(`${API_URL}/api/projects`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: project.name,
            description: project.description,
            gameIds: project.gameIds,
        }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

export async function deleteProject(projectId) {
    try {
        const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Unable to delete project');
        }
    } catch (e) {
        console.error(e);
        throw e;
    }
}


export async function fetchGames() {
    try {
        const response = await fetch(`${API_URL}/api/games`);
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error("Failed to fetch games");
        }
    } catch (error) {
        console.error(error);
        return [];
    }
}