# Imagen base
FROM node:20

# Crear carpeta de app
WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el proyecto
COPY . .

# Generar cliente Prisma
RUN npx prisma generate

# Exponer puerto
EXPOSE 3000 

# Comando de inicio
CMD ["npm", "run", "dev"]