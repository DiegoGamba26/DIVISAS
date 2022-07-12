- to create a new database
CREATE DATABASE divisas;

-- to use database
use divisas;

-- creating a new table
CREATE TABLE users (
  id INT(6) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) ,
  last_name varchar(150),
  nationality varchar(100),
  date_birth date,
  document varchar (20),
  issuance_document date,
 pass VARCHAR(150) ,
 rol  VARCHAR(50),
 stratum varchar(3),
 gender varchar(20),
 email varchar(150),
 num varchar (10)
);

CREATE TABLE transactions (
  id INT(6) NOT NULL AUTO_INCREMENT PRIMARY KEY,
idUser INT,
CONSTRAINT FK_user FOREIGN KEY (idUser)
REFERENCES users(id),
idType INT,
CONSTRAINT FK_type FOREIGN KEY (idType)
REFERENCES type_transactions(id),
amount DOUBLE(18, 6)
);
CREATE TABLE type_transactions (
  id INT(6) NOT NULL AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(50)
);
INSERT INTO type_transactions values(1,'entrada');
INSERT INTO type_transactions values(2,'salida');
drop table transactions;
-- to show all tables
show tables;


select * from type_transactions;