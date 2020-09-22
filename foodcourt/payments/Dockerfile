FROM node:8.9-alpine

WORKDIR /app
COPY package.json /app
RUN npm install --only-production
COPY index.js /app
COPY tracer.js /app
EXPOSE 3000
CMD node index.js