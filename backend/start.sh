#!/bin/sh

# Esperar o banco de dados ficar pronto
echo "⏳ Waiting for database..."
while ! nc -z db 5432; do
  sleep 1
done
echo "✅ Database is up!"

# Aplicar schema
echo "🚀 Syncing database schema..."
npx prisma db push

# Verificar se banco está vazio para rodar o seed
# Se não houver pacientes, assume que é a primeira execução
COUNT=$(npx prisma patient count 2>/dev/null || echo "0")

if [ "$COUNT" = "0" ]; then
  echo "🌱 First run detected, seeding initial data..."
  npx prisma db seed
else
  echo "⏩ Database already has data, skipping seed."
fi

# Iniciar aplicação
echo "🏁 Starting application..."
npm run dev
