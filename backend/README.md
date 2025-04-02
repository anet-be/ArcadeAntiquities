# Project Arcade - Backend

## Overview

This is the backend service for Project Arcade, built with Spring Boot. It provides the necessary APIs for the application, including user authentication, order processing, and data management.

## Tech Stack

- **Java 21**
- **Spring Boot 3.3.4**
- **Gradle**
- **Docker**
- **Git**

## Setup Instructions

### Running the Backend Locally

#### Prerequisites

- Java 21 installed
- Gradle installed
- Docker installed (if using the containerized version)

#### Steps

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd backend
   ```
2. Build the project:
   ```sh
   ./gradlew build
   ```
3. Run the application:
   ```sh
   ./gradlew bootRun
   ```
4. The backend should now be running at `http://localhost:8081`

### Running with Docker

#### Pulling the Images

You can pull the pre-built Docker images from GitLab:

```sh
docker pull registry.gitlab.com/kdg-ti/the-lab/teams-24-25/project-arcade/backend
```

#### Running the Backend

Ensure you have `docker-compose.yml` in your project directory, then run:

```sh
docker-compose up -d
```

This will start both the backend and any required services.

## Environment Variables

Ensure the following environment variables are set:

- `SPRING_DATASOURCE_URL` – Database connection string
- `SPRING_DATASOURCE_USERNAME` – Database username
- `SPRING_DATASOURCE_PASSWORD` – Database password
- Other required secrets or configurations

## API Endpoints

| Method | Endpoint            | Description            |
| ------ | ------------------- | ---------------------- |
| GET    | `/api/example`      | Retrieves example data |
| POST   | `/api/example`      | Creates new data       |
| PUT    | `/api/example/{id}` | Updates existing data  |
| DELETE | `/api/example/{id}` | Deletes data           |

## Database Setup

If your backend requires a database, ensure it's running and configured properly. If using Docker, update the `docker-compose.yml` file with the correct database settings.

## Deployment

The backend is deployed using Docker. Ensure the latest image is pushed before running in production:

```sh
docker build -t registry.gitlab.com/kdg-ti/the-lab/teams-24-25/project-arcade/backend .
docker push registry.gitlab.com/kdg-ti/the-lab/teams-24-25/project-arcade/backend
```

## Contributors

- Hussein Ali, Rune Bossuyt, Pepijn Theuns
