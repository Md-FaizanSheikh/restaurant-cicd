# Use the official Nginx web server image (lightweight Alpine version)
FROM nginx:alpine

# Add labels for identification in Docker Hub
LABEL maintainer="YourName"
LABEL project="Restaurant CI/CD Demo"
LABEL version="1.0"

# Remove the default Nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy YOUR restaurant website files into the container
# Everything inside /website/ folder goes to nginx's serving directory
COPY website/ /usr/share/nginx/html/

# Tell Docker this container listens on port 80
EXPOSE 80

# Start Nginx in foreground (required for Docker)
CMD ["nginx", "-g", "daemon off;"]