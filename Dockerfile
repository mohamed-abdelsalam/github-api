FROM node:14.15-alpine3.10
RUN apk add make python3
WORKDIR /app

COPY src src
COPY package.json package.json
COPY tsconfig.json tsconfig.json
COPY tsconfig.build.json tsconfig.build.json

RUN npm run build

CMD npm run start
