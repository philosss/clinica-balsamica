const express = require("express");
const bodyParser = require("body-parser");
const url = require('url');
const fs = require('fs');

const params = url.parse(process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/clinicabalsamica");
const auth = params.auth.split(':');

const app = express();
const knex = require('knex')({
    client: 'pg',
    connection: {
        host: params.hostname,
        port: params.port,
        user: auth[0],
        password: auth[1],
        database: params.pathname.split('/')[1],
        multipleStatements: true
    }
});
const serverPort = process.env.PORT || 8080;


// nodemailer used to send emails
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({ // Setup Account
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'clinicabalsamica@gmail.com',
        pass: 'MaCheBellaClinica001'
    }
});

// Create database if not exists, and add data from JSON files
function initDB() {

    var ddl = fs.readFileSync("./db/ddl.sql").toString();
    var locationsList = require("./db/locations.json");
    var doctorsList = require("./db/doctors.json");
    var servicesList = require("./db/services.json");
    var doctorsServicesList = require("./db/doctors_services.json");

    knex.raw(ddl).catch(err => {
        console.log("ERRORE NEL DDL");
        console.log(err);
    }).then(() => {
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
    });
}

// Set up Middlewares
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Get all the doctors, each with his/her location
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

// Get all locations
app.get(["/api/locations", "/api/howtoreach"], function (req, res) {
    knex("locations").orderBy("id").then(results => {
        res.json(results);
    });
});

// Get all services
app.get("/api/services", function (req, res) {
    knex("services").then(results => {
        res.json(results);
    });
});

// Get only the first :limit services - for the homepage
app.get("/api/top-services/:limit", function (req, res) {
    var i = parseInt(req.params.limit);
    knex("services")
        .limit(i)
        .then(results => {
            res.json(results);
        });
});

// Get only the first :limit doctors - for the homepage
app.get("/api/top-doctors/:limit", function (req, res) {
    var i = parseInt(req.params.limit);
    knex("doctors")
        .limit(i)
        .then(results => {
            res.json(results);
        });
});

// Get all data for a specified service, including the doctor which is responsible for this service
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

// Get all data for the specified location
app.get("/api/location/:location_id", function (req, res) {
    var i = parseInt(req.params.location_id);
    knex("locations")
        .where({ "locations.id": i })
        .then(results => {
            res.json(results);
        });
});

// Get all data for the specified doctor, including:
// - his/her location
// - his/her services
// - his/her services in which he/she is responsible
app.get("/api/doctor/:doctor_id", function (req, res) {
    var i = parseInt(req.params.doctor_id);
    knex
        .select("doctors.*", "locations.name AS locationName", "services.name AS serviceName", "services.id AS serviceID", "services.responsible")
        .from("doctors")
        .leftJoin("doctors_services", { "doctors_services.doctorid": "doctors.id" })
        .leftJoin("services", { "services.id": "doctors_services.serviceid" })
        .join("locations", { "locations.id": "doctors.location" })
        .where({ "doctors.id": i })
        .then(results => {
            // Since data is only a list of doctors, with repetitions, we have to format it 
            // in order to simplify the client-side javascript.
            // So at the end we'll have a list of doctors in which each doctor will have
            // a list of services and a list of services in which he/she is responsible
            // ex: [{"name": "Cristina", "surname": "D'ampezzo", ..., "services": [{"id": 1, "name": "Elettrocardiogramma"}], "responsibleOf": [], ...}]
            var result = results[0];
            result.services = [];
            result.responsibleOf = [];
            for (var i in results) {
                result.services.push({ "id": results[i].serviceID, "name": results[i].serviceName });
                if (results[i].responsible == results[i].id) {
                    result.responsibleOf.push({ "id": results[i].serviceID, "name": results[i].serviceName })
                }
                delete results[i].responsible;
            }
            delete result.serviceName;
            res.json([result]);
        });
});

// Util function to retrieve the index of element in object (not in array)
// obj: the object in which search the element
// id:  the element to search
// by:  the key of object so that obj[by] = id
function indexOf(obj, id, by) {
    for (var k in obj) {
        if (obj[k][by] == id) {
            return k;
        }
    }
    return -1;
}

// Get all the doctors that work in the specified location
app.get("/api/doctors/location/:location_id", function (req, res) {
    var i = parseInt(req.params.location_id);
    knex.select("doctors.*").from("doctors").where({ "location": i }).then((results) => {
        res.json(results);
    });
});

// Get all the doctors that work for the specified service
app.get("/api/doctors/services/:service_id", function (req, res) {
    var i = parseInt(req.params.service_id);
    knex
        .select("doctors.*", "services.name AS service_name", "services.id AS service_id")
        .from("doctors")
        .leftJoin("doctors_services", { "doctors.id": "doctors_services.doctorid" })
        .join("services", { "services.id": "doctors_services.serviceid" })
        .where({ "services.id": i })
        .orderBy("doctors.surname", "doctors.name")
        .then(results => {
            res.json(results);
        });
});

// Get all the locations in which the service specified is provided
app.get("/api/locations/services/:service_id", function (req, res) {
    var i = parseInt(req.params.service_id);
    knex
        .select("locations.*", "services.name AS service_name", "services.id AS service_id")
        .from("doctors")
        .leftJoin("doctors_services", { "doctors.id": "doctors_services.doctorid" })
        .join("services", { "services.id": "doctors_services.serviceid" })
        .join("locations", { "locations.id": "doctors.location" })
        .where({ "services.id": i })
        .groupBy("locations.name", "locations.address", "locations.phonenumber", "locations.id", "services.id", "services.name")
        .orderBy("locations.name")
        .then(results => {
            res.json(results);
        });
});

// Get all the services that the specified location provides
app.get("/api/services/locations/:location_id", function (req, res) {
    var i = parseInt(req.params.location_id);
    knex
        .select("services.id", "services.name", "services.image", "locations.name AS location_name", "locations.id AS location_id", "locations.image AS location_image")
        .from("services")
        .join("doctors_services", { "services.id": "doctors_services.serviceid" })
        .join("doctors", { "doctors_services.doctorid": "doctors.id" })
        .join("locations", { "doctors.location": "locations.id" })
        .where({ "doctors.location": i })
        .groupBy("services.id", "services.name", "services.image", "locations.name", "locations.image", "locations.id")
        .then(results => {
            res.json(results);
        });
});

// Get all the doctors, ordered by service
// ex: [{"service_name": "Elettrocardiogramma", "doctors": [{"id": 1, "name": "Cristina", ...}, ...]}, ...]
app.get("/api/doctors/services", function (req, res) {
    knex
        .select("doctors.*", "locations.name AS location", "doctors_services.serviceid", "services.name AS service_name")
        .from("doctors")
        .leftJoin("doctors_services", { "doctors.id": "doctors_services.doctorid" })
        .join("services", { "services.id": "doctors_services.serviceid" })
        .join("locations", { "locations.id": "doctors.location" })
        .orderBy("doctors.surname", "doctors.name")
        .then(results => {
            // Format the output
            var r = [];
            // For each row
            for (var i = 0; i < results.length; i++) {
                var x = indexOf(r, results[i].serviceid, 'serviceid')
                // if the service in this row was already added to the result set
                if (x >= 0) {
                    // simply add the doctor of this row to that service
                    r[x].doctors.push(results[i]);
                } else {
                    // else create a new service, add it to the result set and add the doctor to this service
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

// Get all the doctors, ordered by location
// ex: [{"location_name": "Milano", "doctors": [{"id": 1, "name": "Cristina", ...}, ...]}, ...]
app.get("/api/doctors/locations", function (req, res) {
    knex
        .select("doctors.*", "locations.name AS location_name", "locations.id AS location_id")
        .from("doctors")
        .join("locations", { "locations.id": "doctors.location" })
        .orderBy("doctors.surname", "doctors.name")
        .then(results => {
            // Format the output
            var r = [];
            // For each row
            for (var i = 0; i < results.length; i++) {
                var x = indexOf(r, results[i].location_id, 'location_id')
                // if the location in this row was already added to the result set
                if (x >= 0) {
                    // simply add the doctor of this row to that location
                    r[x].doctors.push(results[i]);
                } else {
                    // else create a new location, add it to the result set and add the doctor to this location
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

// Get faq from json
app.get("/api/faq", function (req, res) {
    res.json(require("./db/faq.json"));
});

// Get work from json
app.get("/api/work", function (req, res) {
    res.json(require("./db/work.json"));
});

// Get presentation from json
app.get("/api/presentazione", function (req, res) {
    res.json(require("./db/presentazione.json"));
});

// Mail sender - homepage
app.get("/api/email/info", function (req, res) {
    var message = req.body.message;
    var email = req.query.email;
    var type = req.query.type;
    var messageToSend = null;

    if (type == 0) {
        messageToSend = "Richiesta di prenotazione ricevuta da: " + email + "\Message: " + message;
    } else {
        var name = req.query.name;
        var subject = req.query.subject;
        messageToSend = "Messaggio ricevuto da: " + email + "\nName: " + name + "\nSubject: " + subject + "\nSaying: " + message;
    }

    // Validation takes place on server side too
    let ok = false;
    if (validateEmail(email) && message != "" && message.length > 20) {
        ok = true;
        // Send Email
        let mailOptions = {
            from: email, // sender address
            to: 'clinicabalsamica@gmail.com', // list of receivers
            bcc: email, // Send a copy of the email also to the sender
            subject: 'Info Email', // Subject line
            text: messageToSend, // plain text body
            html: '' // html body
        };

        // Send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                ok = false;
                return;
            }
        });

    }

    if (ok) {
        res.json({ "status": "OK" });
    } else {
        res.json({ "status": "Error" });
    }
});

// Validate email using a very long regular expression
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

// Init DB and start listening
initDB();
app.set("port", serverPort);
app.listen(serverPort, function () {
    console.log(`Your app is ready at port ${serverPort}`);
});
