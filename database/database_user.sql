DROP USER IF EXISTS 'SSPS_ADMIN'@'localhost';
create user 'SSPS_ADMIN'@'localhost' identified with mysql_native_password by 'SSPS123';
-- Or use this line if the above one does not work
-- create user 'SSPS_ADMIN'@'localhost' identified by 'SSPS123';

grant all privileges on SSPS.* to 'SSPS_ADMIN'@'localhost';