FROM node:18

WORKDIR /app

# Copies everything
COPY package*.json ./
COPY ./src ./src

# Installs all packages
RUN npm install

EXPOSE 3010

# Runs the dev npm script to build & start the server
CMD npm run dev