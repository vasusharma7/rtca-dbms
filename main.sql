drop database if exists rtca;
create database rtca;
use rtca;

create table users
(
    phone_number INTEGER(10),
    pass VARCHAR(256) not null,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    primary key (phone_number)
);

create table chat_groups
(
    groupID INTEGER(10),
    group_name VARCHAR(50) not null,
    members INTEGER(10),
    primary key (groupID,group_name,members),
    foreign key (members) references users(phone_number)
    on delete cascade
);


create table member
(
    phone_number INTEGER(10),
    groupID INTEGER(10),
    primary key (phone_number, groupID),
    foreign key (phone_number) references users(phone_number)
    on delete cascade,
    foreign key (groupID) references chat_groups(groupID)
    on delete cascade
);

create table messages
(
    messageID INTEGER(10),
    phone_number INTEGER(10),
    date_time TIMESTAMP,
    group_user_message BIT(1),
    userID INTEGER(10),
    groupID INTEGER(10),
    primary key(messageID),
    foreign key (userID) references users (phone_number)
    ON DELETE CASCADE
);

create table messageContent
(
    messageID INTEGER(10),
    message_content VARCHAR(1000),
    file_as_blob LONGBLOB,
    thumbnail LONGBLOB,
    metadata VARCHAR(1000),
    primary key (messageID),
    foreign key (messageID) references messages(messageID)
    on delete cascade
);

