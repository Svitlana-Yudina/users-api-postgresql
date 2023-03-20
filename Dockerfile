FROM node:14.21-alpine3.16
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 8080
CMD [ "node", "src/app.js" ]
