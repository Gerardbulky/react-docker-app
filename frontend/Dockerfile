# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install && npm run build

# Copy the rest of the application code to the working directory
COPY . .

# Expose port 5173 for Vite
EXPOSE 5173

# Start Nginx when the container launches
CMD [ "npm", "run", "dev", "--host", "0.0.0.0"]
