FROM node:18-slim

WORKDIR /app

# Install git for npm dependencies that might need it
RUN apt-get update && \
    apt-get install -y --no-install-recommends git && \
    rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the frontend code
COPY . .

# Command to run tests
CMD ["npm", "run", "check-all"] 