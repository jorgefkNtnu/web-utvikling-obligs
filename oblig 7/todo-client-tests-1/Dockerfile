# Use the official Node.js image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json from the server directory
COPY server/package*.json ./server/

# Navigate to the server directory and install dependencies
WORKDIR /app/server
RUN npm install

# Copy the entire server directory
COPY server/ ./server/

# Set the working directory for the app's source code
WORKDIR /app/server/src

# Remove the build step
# RUN npm run build  # Comment or remove this line if not needed

# Command to run your app
CMD ["node", "app.js"]  # Adjust if your entry point is different