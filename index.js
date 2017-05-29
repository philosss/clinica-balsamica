const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const pg = require('pg');
const url = require('url');

const params = url.parse(process.env.DATABASE_URL);
const auth = params.auth.split(':');

const config = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: true
};
const pool = new pg.Pool(config);
pool.connect(function(err) {
    if (err) {
        return console.error('error fetching client from pool', err);
    }
});

let serverPort = process.env.PORT || 8080;

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/locations", function(req, res) {
    client.query("SELECT * FROM locations", function(err, result) {
        if (err) { throw err; }
        return JSON.stringify(result.rows);
    });
});

app.set("port", serverPort);
app.listen(serverPort, function() {
    console.log(`Your app is ready at port ${serverPort}`);
});