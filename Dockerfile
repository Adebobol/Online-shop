

FROM node:18

# ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

# RUN npm install --production
RUN npm install 

COPY . .

EXPOSE 4000

CMD [ "node", "app.js" ]