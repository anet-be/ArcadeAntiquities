# Use an official OpenJDK runtime as a parent image
FROM openjdk:21-jdk-slim

# Install Python and required dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    git \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy the Gradle wrapper and dependencies first for caching
COPY gradlew gradlew
COPY gradle gradle
COPY build.gradle build.gradle
COPY settings.gradle settings.gradle

# Copy the whole project
COPY . .

# Create and activate a virtual environment, then install Python dependencies
RUN python3 -m venv /venv && \
    /venv/bin/pip install --no-cache-dir gitpython python-dotenv


# Build the Spring Boot application
RUN ./gradlew build -x test

# Expose the application port
EXPOSE 8081

# Set the entry point
CMD ["java", "-jar", "build/libs/spring-backend-1.0.0.jar"]