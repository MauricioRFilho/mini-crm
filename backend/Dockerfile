FROM node:20-slim

RUN apt-get update && apt-get install -y openssl netcat-openbsd && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate || true

RUN chmod +x start.sh

EXPOSE 3001

CMD ["./start.sh"]
