const express = require('express');
const connectDb = require('./config/db');
const cors = require('cors');
const port = process.env.PORT || 3000;

//creamos el servidor
const app = express();

//conectamos a la BD
connectDb();
app.use(cors());

app.use(express.json());

app.use('/', require('./routes/tickets'));

/* app.listen(4000, () => {
    console.log("funciona todo bien");
}) */

app.listen(port, () => {
    console.log("funciona todo bien");
});