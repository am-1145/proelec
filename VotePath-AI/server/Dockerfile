# Use Node.js 20 slim image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the server code
COPY . .

# Expose the port your server listens on (Render default is 10000)
EXPOSE 10000

# Start the server
CMD ["npm", "start"]
