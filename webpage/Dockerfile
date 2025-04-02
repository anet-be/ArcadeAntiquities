FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available) first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Build the application
RUN npm run build

# Start the application
CMD ["npm", "start"]