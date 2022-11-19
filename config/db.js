const mongoose = require('mongoose');
require('dotenv').config({path: 'variables.env'});

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Base de datos conectada");
    } catch (error) {
        console.log("error " + error);
        process.exit(1); //detenemos la app
    }
}

module.exports = connectDb