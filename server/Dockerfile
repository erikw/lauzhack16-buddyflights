FROM node:7.1.0
MAINTAINER Dubsmash

# Prepare app directory
RUN mkdir -p /app

WORKDIR /app

COPY package.json /app
RUN npm install

COPY . /app
VOLUME /app

# Expose the app port
EXPOSE 3000

# Start the app
CMD npm start
