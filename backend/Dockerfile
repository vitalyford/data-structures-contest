FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY tsconfig.json ./
COPY src ./src

RUN npm install -D typescript tsx
RUN npx tsc

FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=0 /app/dist ./dist

EXPOSE 3001
CMD ["node", "dist/index.js"]
