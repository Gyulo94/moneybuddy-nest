FROM node:20

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 8010

CMD ["pm2-runtime", "npm", "--", "run", "start:prod"]