# Arcade Antiquities: Modifying Game Content

## Introduction
This web page allows users to easily customize the images, backgrounds, and sounds of arcade games. The system is designed for non-technical users and provides an intuitive interface for managing game content.

## Features
- **Modify Images**: Upload custom images for characters, enemies, and objects in the game.
- **Change Backgrounds**: Select and upload new backgrounds for different levels.
- **Manage Sound Effects**: Replace existing sound effects with custom audio files.
- **Live Preview**: Instantly view changes before saving them.
- **Automatic Updates**: Changes are applied immediately and made available in the game.

## Usage
1. **Upload**: Click the upload button and select a file (supported formats: JPG, PNG, MP3, WAV).
2. **Preview**: Check how the changes look before confirming.
3. **Save**: Save the modifications and restart the system if needed.

## Technical Requirements
- The webpage is built using **HTML5, CSS, and JavaScript**.
- Files are stored and automatically integrated into the game environment.

## Running with Docker

### Pulling the Docker Image
The frontend can be pulled from the GitLab registry using:
```sh
docker pull registry.gitlab.com/kdg-ti/the-lab/teams-24-25/project-arcade/webpage
```

### Running the Frontend with Docker
To start the frontend using Docker, run:
```sh
docker run -p 8080:8080 registry.gitlab.com/kdg-ti/the-lab/teams-24-25/project-arcade/webpage
```

### Running with Docker Compose
If using `docker-compose.yml`, start the entire setup with:
```sh
docker-compose up -d
```

## Contact
For questions or support, contact **Bart Moelans (Technology Manager, Anet)**:
- **Email**: [Bart.moelans@uantwerpen.be](mailto:Bart.moelans@uantwerpen.be)
- **Phone**: 0486 78 01 85
- Available for meetings in Antwerp or via video call.

## Contributors
- Hussein Ali, Rune Bossuyt, Pepijn Theuns


