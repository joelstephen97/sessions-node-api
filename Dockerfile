# Use the official Node.js LTS image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on (default is 3001)
EXPOSE 3001

# Define the command to run your app
CMD ["npm", "start"]
