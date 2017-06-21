const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const url = require('url');
const fs = require('fs');

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
    //var ddl = fs.readFileSync("./db/ddl");
    var locationsList = require("./db/locations.json");
    var doctorsList = require("./db/doctors.json");
    var servicesList = require("./db/services.json");
    var doctorsServicesList = require("./db/doctors_services.json");

    /*knex.schema.raw(ddl).catch(err => {
        console.log("ERRORE NEL DDL");
        console.log(err);
    }).then(() => {*/
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
        //});
    });
}

initDB();

let serverPort = process.env.PORT || 8080;

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get(["/api/locations", "/api/howtoreach"], function (req, res) {
    knex("locations").orderBy("id").then(results => {
        res.json(results);
    });
});

app.get("/api/services", function (req, res) {
    knex("services").then(results => {
        res.json(results);
    });
});

app.get("/api/service/:service_id", function (req, res) {
    var i = parseInt(req.params.service_id);
    knex
        .select("services.*", "doctors.name AS doctorName", "doctors.surname AS doctorSurname")
        .from("services")
        .join("doctors", { "services.responsible": "doctors.id" })
        .where({ "services.id": i })
        .then(results => {
            res.json(results);
        });
});
app.get("/api/location/:location_id", function(req, res) {
    var i = parseInt(req.params.location_id);
    knex
        .select("locations.*")
        .from("locations")
        .where({ "locations.id": i })
        .then(results =>  {
            res.json(results);
        });
});

app.get("/api/doctor/:doctor_id", function (req, res) {
    var i = parseInt(req.params.doctor_id);
    knex
        .select("doctors.*", "services.name AS serviceName", "services.responsible")
        .from("doctors")
        .leftJoin("doctors_services", { "doctors_services.doctorid": "doctors.id" })
        .leftJoin("services", { "services.id": "doctors_services.serviceid" })
        .where({ "doctors.id": i })
        .then(results => {
            var result = results[0];
            result.services = [];
            for (var i in results) {
                var serv = { "name": results[i].serviceName };
                if (results[i].responsible == results[i].id) {
                    serv.responsible = true
                } else {
                    serv.responsible = false
                }
                result.services.push(serv);
                delete results[i].responsible;
            }
            delete result.serviceName;
            res.json(result);
        });
});

app.get("/api/faq", function (req, res) {
    res.json(require("./db/faq.json"));
});
app.get("/api/work", function (req, res) {
    res.json(require("./db/work.json"));
});
app.get("/api/presentazione", function (req, res) {
    res.json(require("./db/presentazione.json"));
});

function indexOf(obj, id, by) {
    for (var k in obj) {
        if (obj[k][by] == id) {
            return k;
        }
    }
    return -1;
}

app.get("/api/doctors/location/:location_id", function (req, res) {
    var i = parseInt(req.params.location_id);
    knex.select("doctors.*").from("doctors").where({ "location": i }).then((results) => {
        res.json(results);
    });
});


app.get("/api/doctors/services/:service_id", function(req, res) {
  var i = parseInt(req.params.service_id);
    knex
        .select("doctors.*")
        .from("doctors")
        .leftJoin("doctors_services", { "doctors.id": "doctors_services.doctorid" })
        .join("services", { "services.id": "doctors_services.serviceid" })
        .where({ "services.id": i })
        .orderBy("doctors.surname", "doctors.name")
        .then(results =>  {
            res.json(results);
        });
});


app.get("/api/doctors/services", function (req, res) {
    knex
        .select("doctors.*", "locations.name AS location", "doctors_services.serviceid", "services.name AS service_name")
        .from("doctors")
        .leftJoin("doctors_services", { "doctors.id": "doctors_services.doctorid" })
        .join("services", { "services.id": "doctors_services.serviceid" })
        .join("locations", { "locations.id": "doctors.location" })
        .orderBy("doctors.surname", "doctors.name")
        .then(results => {
            var r = [];
            for (var i = 0; i < results.length; i++) {
                var x = indexOf(r, results[i].serviceid, 'serviceid')
                if (x >= 0) {
                    r[x].doctors.push(results[i]);
                } else {
                    el = {};
                    el.serviceid = results[i].serviceid;
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


app.get("/api/doctors/locations", function (req, res) {
    knex
        .select("doctors.*", "locations.name AS location_name", "locations.id AS location_id")
        .from("doctors")
        .leftJoin("doctors_services", { "doctors.id": "doctors_services.doctorid" })
        .join("services", { "services.id": "doctors_services.serviceid" })
        .join("locations", { "locations.id": "doctors.location" })
        .orderBy("doctors.surname", "doctors.name")
        .then(results => {
            var r = [];
            for (var i = 0; i < results.length; i++) {
                var x = indexOf(r, results[i].location_id, 'location_id')
                if (x >= 0) {
                    r[x].doctors.push(results[i]);
                } else {
                    el = {};
                    el.location_id = results[i].location_id;
                    el.location_name = results[i].location_name;
                    el.doctors = [results[i]];
                    r.push(el);
                }
                delete results[i].location_id;
                delete results[i].location_name;
            }
            res.json(r);
        });
});

app.get("/api/doctors", function (req, res) {
    knex
        .select("doctors.*", "locations.name AS location")
        .from("doctors")
        .join("locations", { "locations.id": "doctors.location" })
        .orderBy("surname", "name")
        .then(results => {
            res.json(results);
        });
});

app.set("port", serverPort);
app.listen(serverPort, function () {
    console.log(`Your app is ready at port ${serverPort}`);
});
