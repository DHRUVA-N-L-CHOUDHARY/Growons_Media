# Use the official Node.js 18 image as the base
FROM node:18-alpine as builder

# Install OpenSSL and other build dependencies
RUN apk add --no-cache openssl python3 make g++

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies for development
RUN npm install --production=false

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the Next.js app
RUN npm run build

# ---

# Use a lightweight Node.js runtime image for production
FROM node:18-alpine as runner

# Install OpenSSL (required for Prisma)
RUN apk add --no-cache openssl

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm install --production

# Copy the built app from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

# Copy Next.js config
COPY next.config.mjs ./

# Expose the port the app will run on
EXPOSE 8080

# Set the environment variables for production
ENV NODE_ENV=production
ENV PORT=8080

# Fix Prisma's inability to detect OpenSSL
ENV LD_LIBRARY_PATH=/usr/lib:/usr/lib/ssl
ENV PRISMA_CLI_QUERY_ENGINE_TYPE=library

# Start the Next.js application
CMD ["npm", "start"]
