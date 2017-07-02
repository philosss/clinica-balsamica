CREATE TABLE locations
(
    name VARCHAR(50) NOT NULL,
    address VARCHAR(150) NOT NULL,
    phonenumber VARCHAR(50),
    id SERIAL PRIMARY KEY NOT NULL,
    image VARCHAR(255),
    description TEXT
);
CREATE TABLE doctors
(
    id INTEGER PRIMARY KEY NOT NULL,
    name VARCHAR(255),
    surname VARCHAR(255),
    email VARCHAR(200),
    phonenumber VARCHAR(50),
    office INTEGER DEFAULT 5,
    image VARCHAR(255),
    location INTEGER,
    CONSTRAINT doctors_locations_id_fk FOREIGN KEY (location) REFERENCES locations (id) ON UPDATE CASCADE
);
CREATE TABLE services
(
    name VARCHAR(255) NOT NULL,
    description VARCHAR,
    id SERIAL PRIMARY KEY NOT NULL,
    image VARCHAR(255),
    responsible INTEGER,
    CONSTRAINT services_doctors_id_fk FOREIGN KEY (responsible) REFERENCES doctors (id)
);
CREATE UNIQUE INDEX doctors_email_uindex ON doctors (email);
CREATE TABLE doctors_services
(
    serviceid INTEGER NOT NULL,
    doctorid INTEGER NOT NULL,
    CONSTRAINT doctors_services_serviceid_doctorid_pk PRIMARY KEY (serviceid, doctorid),
    CONSTRAINT doctors_services_services_id_fk FOREIGN KEY (serviceid) REFERENCES services (id),
    CONSTRAINT doctors_services_doctors_id_fk FOREIGN KEY (doctorid) REFERENCES doctors (id)
);