const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const url = require('url');

const params = url.parse(process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/clinicabalsamica");
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

function initDB() {
    var locationsList = require("./db/locations.json");
    var doctorsList = require("./db/doctors.json");
    var servicesList = require("./db/services.json");
    var doctorsServicesList = require("./db/doctors_services.json");

    knex("locations").insert(locationsList).catch(err => {
        console.log(err);
    }).then(() => {
        knex("doctors").insert(doctorsList).catch(err => {
            console.log(err);
        }).then(() => {
            knex("services").insert(servicesList).catch(err => {
                console.log(err);
            }).then(() => {
                knex("doctors_services").insert(doctorsServicesList).catch(err => {
                    console.log(err);
                })
            });
        });
    });
}

initDB();

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
    knex("locations").orderBy("id").then(results =>  {
        res.json(results);
    });
});

app.get("/services", function(req, res) {
    knex("services").then(results =>  {
        res.json(results);
    });
});

function indexOf(obj, id) {
    for (var k in obj) {
        if (obj[k].service_id == id)  {
            return k;
        }
    }
    return -1;
}

app.get("/doctors/services", function(req, res) {
    knex.select("doctors.*", "doctors_services.serviceid", "services.name AS service_name").from("doctors").leftJoin("doctors_services", { "doctors.id": "doctors_services.doctorid" }).join("services", { "services.id": "doctors_services.serviceid" }).then(results =>  {
        var r = [];
        for (var i = 0; i < results.length; i++) {
            var x = indexOf(r, results[i].serviceid)
            if (x >= 0) {
                r[x].doctors.push(results[i]);
            } else {
                el = {};
                el.service_id = results[i].serviceid;
                el.service_name = results[i].service_name;
                el.doctors = [results[i]];
                r.push(el);
            }
            delete results[i].serviceid;
            delete results[i].service_name;
        }
        res.json(r);
    });
});

app.get("/doctors", function(req, res) {
    knex("doctors").orderBy("id").then(results =>  {
        res.json(results);
    });
});

app.get("/doctors/fromLocation/:locationID", function(req, res) {
    knex
        .select("doctors.id", "doctors.name", "doctors.surname", "doctors.email", "doctors.image")
        .from("doctors")
        .join("doctors_services", { "doctors.id": "doctors_services.doctorid" })
        .join("services_locations", { "services_locations.serviceid": "doctors_services.serviceid" })
        .where({ "services_locations.locationid": 1 })
        .then(results =>  {
            res.json(results);
        });
});

app.set("port", serverPort);
app.listen(serverPort, function() {
    console.log(`Your app is ready at port ${serverPort}`);
});