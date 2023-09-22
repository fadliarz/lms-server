ARG NODE_IMAGE=node:14.17.3-alpine3.11

FROM ${NODE_IMAGE} AS base
RUN mkdir -p /home/node/app && chown node:node /home/node/app
WORKDIR /home/node/app
USER node
COPY /package*.json ./
RUN npm install

CMD ["npm", "run", "dev"]