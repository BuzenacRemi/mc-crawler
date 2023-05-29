FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install express
RUN npm install mustache --save
RUN npm install node-mc-api
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
