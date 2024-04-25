# Code Execution Service

The Code Execution Service offers a user-friendly environment for executing code, utilizing Docker containers to maintain isolation. It supports five programming languages: JavaScript, C, C++, PHP, and Python.

### Installation Guide

1. **Download Docker:**
   Visit [Docker's official website](https://www.docker.com/products/docker-desktop) and download Docker Desktop suitable for your operating system.

2. **Build the Docker Image:**
   Navigate to the project directory in your terminal and execute the following command:
   ```bash
   docker build . -t code-execution
   ```

3. **Start the Service:**
   Once the Docker image is built, start the service by running the following command:
   ```bash
   docker run -p 3001:3001 code-execution
   ```

This will launch the Code Execution Service on your local machine, accessible at port 3001.
