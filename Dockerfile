FROM node:22-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
RUN mkdir -p /home/node/app/prisma && chown -R node:node /home/node/app
RUN mkdir -p /home/node/app/dist && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node . ./

USER node

RUN npm ci

RUN npm run prisma:generate
RUN npm run build

EXPOSE 4000:4000
# npm run serve
CMD ["npm", "run", "serve"]
