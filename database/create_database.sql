drop schema if exists SSPS;
create schema SSPS;

use SSPS;

create table user(
	id varchar(20) primary key,
	name varchar(100),
    email varchar(100) unique not null,
    password varchar(20) not null
);

create table student(
	id varchar(20) primary key references user(id) on delete cascade on update cascade,
    A0papers int not null check(A0papers>=0),
    A1papers int not null check(A1papers>=0),
    A2papers int not null check(A2papers>=0),
    A3papers int not null check(A3papers>=0),
    A4papers int not null check(A4papers>=0)
);

create table spso(
	id varchar(20) primary key references user(id) on delete cascade on update cascade
);

create table file(
	id varchar(20),
    name varchar(200) not null,
    fileSize varchar(20) not null,
    uploadTime datetime,
    studentId varchar(20) references student(id) on delete cascade on update cascade,
    path text,
    primary key(id,studentId)
);

create table printer(
	id varchar(20) primary key,
    name varchar(100) not null unique,
    model varchar(50) not null,
    location text not null,
    status boolean not null default true,
    description text
);

create table eventLog(
	id varchar(20) primary key,
    logtime datetime not null
);

create table printLog(
	id varchar(20) primary key references eventLog(id),
    paperType varchar(2) not null check(paperType='A0' or paperType='A1' or paperType='A2' or paperType='A3' or paperType='A4'),
    totalPaper int not null check(totalPaper>=0),
    doubleSide boolean not null,
    vertical boolean not null,
    printerName varchar(100) not null,
    printerLocation text not null,
    fileName varchar(200) not null,
    studentId varchar(20) not null references student(id) on delete cascade on update cascade
);

create table buyLog(
	id varchar(20) primary key references eventLog(id),
    paperType varchar(2) not null check(paperType='A0' or paperType='A1' or paperType='A2' or paperType='A3' or paperType='A4'),
    numberOfPaper int not null,
    cost int not null check(cost>=0),
    studentId varchar(20) not null references student(id) on update cascade
);

create table defaultConfig(
	id varchar(20) primary key,
	doubleSide boolean,
    paperType varchar(2),
	vertical boolean
);

insert into defaultConfig values('ID',true,'A4',true);

create table permittedFile(
    fileType varchar(10)
);

insert into permittedFile values('.doc'),('.docx'),('.pdf');

create table distributeConfig(
	id varchar(20) primary key,
    date int,
    numberOfPage int
);

insert into distributeConfig values('ID',1,100);

create table paperCost(
	id varchar(20) primary key,
    cost int
);

insert into paperCost values('A0',6000),('A1',4000),('A2',2000),('A3',1000),('A4',500);