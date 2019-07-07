FROM node:alpine

COPY app.js       /home/node/app/
COPY package.json /home/node/app/
COPY env.json     /home/node/app/

WORKDIR /home/node/app
RUN npm i
CMD node app.js 

EXPOSE 80

