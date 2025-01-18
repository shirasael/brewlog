FROM node:18-slim

WORKDIR /app

# Install git for npm dependencies that might need it
RUN apt-get update && \
    apt-get install -y --no-install-recommends git \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev  && \
    rm -rf /var/lib/apt/lists/* 

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci && \
    npm install --legacy-peer-deps && \
    npm rebuild canvas --update-binary

# Copy the frontend code
COPY . .

# Set default environment variables for Jest JUnit
ENV JEST_JUNIT_OUTPUT_DIR=/test-results
ENV JEST_JUNIT_OUTPUT_NAME=jest.xml
ENV JEST_JUNIT_CLASSNAME="Frontend.{classname}"
ENV JEST_JUNIT_SUITE_NAME="{title}"
ENV JEST_JUNIT_ANCESTOR_SEPARATOR=" › "
ENV CI=true

# Command to run tests
CMD ["sh", "-c", "npm test -- --watchAll=false --reporters=jest-junit"] 