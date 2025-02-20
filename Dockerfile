FROM node:22-slim

RUN corepack enable && corepack prepare yarn@4.5.1 --activate

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
RUN mkdir -p /home/node/app/prisma && chown -R node:node /home/node/app
RUN mkdir -p /home/node/app/dist && chown -R node:node /home/node/app

WORKDIR /home/node/app

RUN apt-get update -y
RUN apt-get install -y openssl

COPY --chown=node:node . ./

USER node

RUN yarn --frozen-lockfile

RUN yarn prisma:generate
RUN yarn build

EXPOSE 3000:3000
# serve
CMD ["yarn", "serve"]
