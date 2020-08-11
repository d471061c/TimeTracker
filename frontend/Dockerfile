FROM node:12-alpine

WORKDIR /frontend
COPY package.json . 
RUN yarn

COPY . .

EXPOSE 3000
CMD ["yarn", "start"]