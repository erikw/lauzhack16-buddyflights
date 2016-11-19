FROM node:7.1.0
MAINTAINER tribou

# Prepare app directory
RUN mkdir -p /app
VOLUME /app
WORKDIR /app
COPY . /app

# Install dependencies
RUN npm install
RUN npm install webpack-dev-server

# Build the app
RUN npm build

# Expose the app port
EXPOSE 8000

# Start the app
CMD npm start
