const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);
client.connect(function(err) {
    if (err) {
        return console.error('error fetching client from client', err);
    }
});

let serverPort = process.env.PORT || 8080;

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("port", serverPort);
app.listen(serverPort, function() {
    console.log(`Your app is ready at port ${serverPort}`);
});