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
	image varchar(255)
)
;

create unique index doctors_email_uindex
	on doctors (email)
;

create table areas
(
	name varchar(255) not null
		constraint areas_pkey
			primary key,
	areaimage varchar(255),
	phonenumber varchar(50),
	responsabile integer
		constraint areastoresp
			references doctors,
	description varchar
)
;

create table services
(
	name varchar(255) not null,
	area varchar(255) not null
		constraint services_areas_name_fk
			references areas,
	description varchar,
	constraint services_name_area_pk
		primary key (name, area)
)
;

create table workserivce
(
	service varchar(255) not null,
	doctor integer not null
		constraint workserivce_doctors_id_fk
			references doctors,
	constraint workserivce_service_doctor_pk
		primary key (service, doctor)
)
;

create table locations
(
	name varchar(50) not null
		constraint location_pkey
			primary key,
	address varchar(150) not null,
	phonenumber varchar(50),
	description varchar
)
;

create table serviceinlocations
(
	name varchar(255) not null
		constraint serviceinlocations_locations_name_fk
			references locations,
	location varchar(50) not null,
	constraint serviceinlocations_name_location_pk
		primary key (name, location)
)
;

