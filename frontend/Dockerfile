FROM node:12-alpine

WORKDIR /frontend
COPY . .
RUN yarn

EXPOSE 3000
CMD ["yarn", "start"]