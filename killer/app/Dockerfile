FROM node:8.9-alpine
STOPSIGNAL SIGINT
RUN apk update && apk add strace && adduser -D -g '' cool_user
USER cool_user
WORKDIR /app
COPY package.json /app
COPY package-lock.json /app
RUN npm install --only-production
COPY index.js /app
ENTRYPOINT ["node", "index.js"]