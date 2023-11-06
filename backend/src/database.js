const mongoose = require('mongoose');
const Usuario = require("./model/User.model");


//variable de entorno
if (process.env.NODE_ENV !== 'production') {
    require("dotenv").config();
}
//const dbCconfig = require("./config/config");

//const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = dbCconfig

//const URL = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`

const URL = "mongodb+srv://boriscaiza04:8PhzdXrt7M3LpQg8@cluster0.qdhgvmp.mongodb.net/"


//const URL = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`



//Conectarse a la base de datos
mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log("Successfully connected to the database");
        await initial(); // Llama a la función inicial después de la conexión exitosa
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit(1); // Sale del proceso si hay un error de conexión
    });

/* Función inicial para crear un perfil, usuario, administrador y colección */
async function initial() {
    try {
        const countUser = await Usuario.estimatedDocumentCount();
        if (countUser === 0) {
            const newUser = new Usuario({
                name: "Administrador",
                email: "bcaiza.virtus@gmail.com",
                password: "$2a$10$0N8V96JijTKHK6RLqy/6be.jCJ.UxC9rtYU.9BAAZsfx13d9KtHCC",


            });

            await newUser.save(); // Usar await para esperar la operación de guardado
            console.log("Added 'Usuario' to the collection");
        }




    } catch (error) {
        console.error("Error during initialization", error);
    }
}

module.exports = mongoose;


