FROM node:20-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Compilar Next.js
RUN npm run build

# Exponer puerto
EXPOSE 3000

# Arrancar el servidor
CMD ["npm", "start"]