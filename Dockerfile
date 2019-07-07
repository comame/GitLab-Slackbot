FROM node:alpine

WORKDIR /home/node/app

COPY package.json /home/node/app/
RUN npm i

COPY app.js       /home/node/app/
COPY env.json     /home/node/app/

CMD node app.js 

EXPOSE 80
