create table doctors
(
	id serial not null
		constraint doctors_pkey
			primary key,
	name varchar(255),
	surname varchar(255),
	email varchar(200),
	phonenumber varchar(50),
	office integer default 5,
	image varchar(255),
	location integer
)
;

create unique index doctors_email_uindex
	on doctors (email)
;

create table areas
(
	name varchar(255) not null,
	areaimage varchar(255),
	phonenumber varchar(50),
	responsabile integer
		constraint areas_doctors_id_fk
			references doctors,
	description text,
	id serial not null
		constraint areas_id_pk
			primary key
)
;

create table services
(
	name varchar(255) not null,
	areaid integer not null
		constraint services_areas_id_fk
			references areas,
	description varchar,
	id serial not null
		constraint services_id_pk
			primary key
)
;

create table doctors_services
(
	serviceid integer not null
		constraint doctors_services_services_id_fk
			references services,
	doctorid integer not null
		constraint doctors_services_doctors_id_fk
			references doctors,
	constraint doctors_services_serviceid_doctorid_pk
		primary key (serviceid, doctorid)
)
;

create table locations
(
	name varchar(50) not null,
	address varchar(150) not null,
	phonenumber varchar(50),
	id serial not null
		constraint locations_id_pk
			primary key,
	image varchar(255)
)
;

alter table doctors
	add constraint doctors_locations_id_fk
		foreign key (location) references locations
			on update cascade
;

create table services_locations
(
	serviceid integer not null
		constraint services_locations_services_id_fk
			references services,
	locationid integer not null
		constraint services_locations_locations_id_fk
			references locations,
	constraint services_locations_serviceid_locationid_pk
		primary key (serviceid, locationid)
)
;

