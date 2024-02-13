FROM node:alpine3.16
#establecer directorio de trabajo
WORKDIR /usr/src/app
#copia los archivos en el directorio de trabajo
COPY . /usr/src/app

#instala las dependecias
RUN npm install
#expone el puerto
EXPOSE 3004
#corre el backend
CMD [ "npm","run", "dev" ]