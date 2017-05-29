const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const pg = require('pg');

console.log(process.env.DATABASE_URL);

const pool = new pg.Pool(process.env.DATABASE_URL);
pool.connect(function(err, client, done) {
    if (err) {
        return console.error('error fetching client from pool', err);
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