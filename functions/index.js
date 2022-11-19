const functions = require("firebase-functions");
const express = require('express');
const connectDb = require('../config/');
const cors = require('cors');
//const { response } = require("express");

const app = express();

//conectamos a la BD
connectDb();
app.use(cors());

app.use(express.json());

app.use('/', require('./routes/tickets'));

/* app.get('/timestamp', (request, response) => {
    response.send(`${Date.now()}`);
}) */

exports.app = functions.https.onRequest(app);

/* app.listen(4000, () => {
    console.log("funciona todo bien");
}) */