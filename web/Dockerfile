FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install express
RUN npm install mustache --save
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
