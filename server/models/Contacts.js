const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        unique: true,
        required: true,
    },

    Phones: {
        type: [Number],
    },
    Emails: [String],
    DOB: {
        type: Date,
        default : null,
    } 
})

const Contact = mongoose.model('Contact', contactSchema);

module.exports = { Contact };