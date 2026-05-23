# Use official Node LTS image
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package configuration files
COPY package.json package-lock.json /app/

# Install dependencies
RUN npm install

# Copy application source code
COPY . /app/

# Expose Vite server port
EXPOSE 5173

# Start development server binding to all network interfaces
CMD ["npm", "run", "dev", "--", "--host"]
