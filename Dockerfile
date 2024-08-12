# Base image
FROM alpine:latest

# Install necessary packages
RUN apk update && \
    apk add --no-cache \
    build-base \
    python3 \
    python3-dev \
    php \
    gcc \
    g++ \
    nodejs \
    npm \
    curl


    
# Create directories for storing code and executing scripts
RUN mkdir /app
RUN mkdir /app/temp

WORKDIR /app
    
# Copy
COPY . /app

# Install necessary Node.js packages
RUN npm install

#  express body-parser child_process


RUN chmod +x /app/scripts/execute.sh

# Expose the port
EXPOSE 3001

# Build
RUN npm run build

# Convert script to Unix-style line endings
RUN dos2unix /app/scripts/execute.sh


# Command to start the HTTP server
CMD ["npm", "run","start"]