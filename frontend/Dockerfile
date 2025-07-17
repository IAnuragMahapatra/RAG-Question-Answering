# Stage 1: Build the Next.js application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./
# If you use yarn, uncomment the next line and adjust npm commands to yarn
# COPY yarn.lock ./

# Install dependencies
# Using --legacy-peer-deps if you run into peer dependency issues with older Next.js versions or complex deps
RUN npm install

# Copy the rest of the application code
COPY . .

# Your next.config.js has output: 'export' and handles NEXT_PUBLIC_ vars if they are set during build.
# If NEXT_PUBLIC_API_BASE_URL is needed AT BUILD TIME (e.g., hardcoded into static files),
# you'd pass it as a build arg in docker-compose.yml and declare it here.
# ARG NEXT_PUBLIC_API_BASE_URL
# ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}

# Build the Next.js application for static export
# The "build" script in your package.json is "next build"
RUN npm run build

# Stage 2: This stage is minimal as `npx serve` in docker-compose handles serving.
# We just need the 'out' directory.
FROM node:18-alpine AS final

WORKDIR /app

# Copy only the build output (the 'out' folder) from the builder stage
COPY --from=builder /app/out ./out

# Expose the port (though 'npx serve' will also specify it)
EXPOSE 3000

# The CMD here is effectively overridden by the `command` in docker-compose.yml.
# If you wanted this image to be self-sufficient in serving:
# RUN npm install -g serve
# CMD ["serve", "-s", "out", "-l", "3000"]
# But using the command in docker-compose.yml for `npx serve@latest` is generally fine.