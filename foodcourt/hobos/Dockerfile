FROM node:8.9-alpine

WORKDIR /app
COPY package.json /app
RUN npm install --only-production
COPY index.js /app
EXPOSE 4002
CMD node index.js