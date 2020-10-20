-- drop database if exists rtca;
create database rtca;
use rtca;

create table users
(
    phone_number INTEGER(10) UNIQUE,
    pass VARCHAR(256) not null,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    primary key (phone_number)
)