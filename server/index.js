const express = require('express');
const { connect, mongo } = require('mongoose');
require('dotenv').config();
// const connect = require("./database/db");
const MONGO_URI = process.env.MONGO_URI;

const app = express();
app.use(express.json());
const PORT = process.env.PORT;

try {
    connect(MONGO_URI);
    console.log("Connected to Database");
} catch(e) {
    console.log(e);
}

app.use('/api/users', require('./routes/user'));
app.use('/api/contacts', require('./routes/contacts'));

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})
