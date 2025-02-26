FROM  alpine:latest

# Install Go
RUN apk add --no-cache go

# Install Node.js
RUN apk add --no-cache nodejs

# Install Npm
RUN apk add --no-cache  npm

# Install Hugo
RUN apk add --no-cache hugo

# Install Git
RUN apk add --no-cache git

# Set up working directory
WORKDIR /workspaces/4rm0Byte

# Copy your project files
COPY . .