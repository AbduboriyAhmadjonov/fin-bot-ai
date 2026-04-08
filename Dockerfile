FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY src ./src
RUN npx tsc

FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY prisma ./prisma
RUN npx prisma generate

COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production

CMD ["node", "dist/bot.js"]
