FROM node:7.1.0
MAINTAINER Dubsmash

# Prepare app directory
RUN mkdir -p /app
COPY . /app
VOLUME /app
WORKDIR /app

# Install dependencies
RUN npm install
RUN npm install webpack-dev-server

# Expose the app port
EXPOSE 8000

# Start the app
CMD npm start
