FROM node:18-alpine AS builder
WORKDIR /app

COPY . .
RUN yarn install

ENV NODE_ENV="production"

RUN yarn build


FROM node:18-slim as app
WORKDIR /app

ENV NODE_ENV="production"

COPY package.json yarn.lock ./
RUN yarn install --production

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD [ "yarn", "start" ]