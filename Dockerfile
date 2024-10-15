# Use an official Node.js image as a base image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application files to the working directory
COPY . .

# Expose the port your app runs on (modify as needed)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
