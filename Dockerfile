# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json from the backend folder first
# This leverages Docker's layer caching
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend source code
COPY backend/ .

# Expose the port the app runs on
EXPOSE 4000

# The command to start the server
CMD ["node", "server.js"]
