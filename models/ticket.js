const mongoose = require('mongoose');

const ticketSchema = mongoose.Schema({
    id: {
        type: Number
    }
})

module.exports = mongoose.model('ticket', ticketSchema);