# Step 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app for production
RUN npm run build

# Step 2: Serve the application using Nginx
FROM nginx:stable-alpine

# Copy the built files from the build stage to Nginx's html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy a custom Nginx configuration to handle SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080 (Cloud Run default)
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
