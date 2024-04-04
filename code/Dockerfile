# Created in assignment 1
# Node js image
FROM node:latest

WORKDIR /app

# Install app dependencies
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install

# Bundle app source
COPY . .

CMD [ "npm", "start" ]