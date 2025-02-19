# Etapa 1: Construcción de la aplicación
FROM node:18 AS builder

# Configurar el directorio de trabajo
WORKDIR /app

# Copiar los archivos necesarios para instalar las dependencias
COPY package.json package-lock.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY . .

# Construir la aplicación
RUN npm run build

# Instalar únicamente las dependencias de producción
RUN npm prune --production

# Etapa 2: Configuración del contenedor final
FROM node:18-alpine

# Configurar el directorio de trabajo
WORKDIR /app

# Copiar los archivos necesarios desde la etapa de construcción
COPY --from=builder /app/package.json /app/package-lock.json /app/
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/public /app/public

# Exponer el puerto de la aplicación
EXPOSE 3000

# Comando de inicio
CMD ["npm", "start"]

