FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/
COPY .env ./

COPY . .

RUN npm install
RUN npx prisma generate

EXPOSE 3050
EXPOSE 5050
CMD [ "npm", "run", "dev"]