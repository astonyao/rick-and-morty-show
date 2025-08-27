# Backend Dockerfile for development
FROM node:20-alpine

# Install node-gyp dependencies for better-sqlite3
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (clean install to rebuild native modules)
RUN npm ci

# Copy source code (excluding node_modules)
COPY . .

# Rebuild native modules for the container architecture
RUN npm rebuild better-sqlite3

# Create data directory for SQLite database
RUN mkdir -p /app/data

# Expose port
EXPOSE 3001

# Start development server
CMD ["npm", "run", "dev"]