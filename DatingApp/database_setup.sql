CREATE USER 'appuser'@'%' identified with mysql_native_password by 'SPA2019DB';
GRANT ALL PRIVILEGES on *.* to 'appuser'@'%' with grant option;