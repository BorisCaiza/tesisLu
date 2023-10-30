const mongoose = require('mongoose');
const { Schema } = mongoose;



const UserSchema = new Schema({

    email: { type: String, require: [true, 'Email requerido'] },
    password: { type: String, require: [true, 'Contraseña requerido'] },
    sesion: {
        nIntentos: { type: Number, default: 0 },
        HoraDesbloqueo: { type: String },
        HoraBloqueo: { type: String },
        Bloqueado: { type: Boolean, default: false }
    },

    tokens: [{ type: String }],
    resetToken: { type: String }





})

module.exports = mongoose.model('User', UserSchema);