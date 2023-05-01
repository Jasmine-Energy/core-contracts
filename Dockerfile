FROM node:16.13.1 as base

WORKDIR /srv/app

COPY src ./src
COPY deploy ./deploy
COPY hardhat.config.ts ./hardhat.config.ts
COPY package.json ./package.json

# Install deps
RUN yarn

CMD ["npx", "hardhat", "node"]

