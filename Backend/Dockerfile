# Use lightweight Alpine-based Node image
FROM node:22-alpine

# Set working directory in container
WORKDIR /app

# Install necessary packages for bcrypt and native modules
RUN apk add --no-cache python3 make g++ bash

# Copy only package.json and package-lock.json first (to leverage Docker cache)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the backend code
COPY . .

# Expose the backend port-8080 for railway
EXPOSE 3000

# Set NODE_ENV to production if needed
ENV NODE_ENV=production

# Start the server
CMD ["node", "src/index.js"]

