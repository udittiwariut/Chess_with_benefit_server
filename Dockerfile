FROM node:18

WORKDIR /user/src/app

COPY package.json package-lock.json ./

RUN npm i 

COPY . .


CMD ["npm", "start"]