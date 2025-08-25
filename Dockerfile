FROM node:latest
WORKDIR /home/moha99/chatbotApp
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8888
CMD ["node","main.js"]

