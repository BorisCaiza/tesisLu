FROM node:alpine3.16

# Establecer directorio de trabajo
WORKDIR /usr/src/app

# Copiar los archivos en el directorio de trabajo
COPY . /usr/src/app

ENV REACT_APP_REST=/api

# Instalar dependencias
RUN npm install

# Construir la aplicación
RUN npm run build

# Instalar serve globalmente
RUN npm i -g serve

# Exponer el puerto 3000
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["serve", "-s", "build"]
