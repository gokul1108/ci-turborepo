FROM node:20-alpine

WORKDIR /bms

COPY ./packages ./packages
COPY package.json ./package.json
COPY pnpm*.yaml ./
COPY turbo.json ./turbo.json

RUN npm install -g pnpm

COPY ./apps/ws-server ./apps/ws-server

RUN pnpm install

EXPOSE 3003

CMD ["npm","run","dev:ws"]
