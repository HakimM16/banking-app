ALTER TABLE users
	DROP COLUMN role;

alter table users
    add role varchar(20) not null CHECK (role IN ('USER', 'ADMIN'));