const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const url = require('url');

const params = url.parse(process.env.DATABASE_URL || "postgres://localhost:5432/clinicabalsamica");
const auth = params.auth.split(':');

const knex = require('knex')({
    client: 'pg',
    connection: {
        host: params.hostname,
        port: params.port,
        user: auth[0],
        password: auth[1],
        database: params.pathname.split('/')[1]
    }
});

let serverPort = process.env.PORT || 8080;

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/locations", function(req, res) {
    knex("locations").insert({ "name": req.body.name, "address": req.body.address, "phonenumber": req.body.phonenumber, "description": req.body.description }).then(ids => {
        res.json({ id: ids[0] });
    });
});

app.get("/locations", function(req, res) {
    knex("locations").then(results =>  {
        res.json(results);
    });
});

app.set("port", serverPort);
app.listen(serverPort, function() {
    console.log(`Your app is ready at port ${serverPort}`);
});