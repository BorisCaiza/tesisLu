const mongoose = require('mongoose');
const { Schema } = mongoose;



const ScoreSchema = new Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    game: { type: String },
    bestTime: { type: Number }





})

module.exports = mongoose.model('Score', ScoreSchema);