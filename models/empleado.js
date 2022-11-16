const mongoose = require('mongoose');

const ticketSchema = mongoose.Schema({
    dni: {
        type: Number
    }
})

module.exports = mongoose.model('empleado', ticketSchema);