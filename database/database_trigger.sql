use SSPS;

drop trigger if exists insertFile;
delimiter //
create trigger insertFile
before insert on file
for each row
begin
	declare counter int default 0;
    SELECT cast(substr(id,6) AS UNSIGNED) INTO counter FROM file ORDER BY cast(substr(id,6) AS UNSIGNED) DESC LIMIT 1;
    set counter:=counter+1;
    set new.id:=concat('FILE_',counter);
end//
delimiter ;

drop trigger if exists insertPrintLog;
delimiter //
create trigger insertPrintLog
before insert on printLog
for each row
begin
	declare counter int default 0;
    SELECT cast(substr(printLog.id,7) AS UNSIGNED) INTO counter FROM eventLog join printLog on eventLog.id=printLog.id ORDER BY cast(substr(printLog.id,7) AS UNSIGNED) DESC LIMIT 1;
    set counter:=counter+1;
    set new.id:=concat('P_LOG_',counter);
    insert into eventLog values(new.id,now());
end//
delimiter ;

drop trigger if exists insertBuyLog;
delimiter //
create trigger insertBuyLog
before insert on buyLog
for each row
begin
	declare counter int default 0;
    SELECT cast(substr(buyLog.id,7) AS UNSIGNED) INTO counter FROM eventLog join buyLog on eventLog.id=buyLog.id ORDER BY cast(substr(buyLog.id,7) AS UNSIGNED) DESC LIMIT 1;
    set counter:=counter+1;
    set new.id:=concat('B_LOG_',counter);
    insert into eventLog values(new.id,now());
end//
delimiter ;

drop trigger if exists insertPrinter;
delimiter //
create trigger insertPrinter
before insert on printer
for each row
begin
	declare counter int default 0;
    SELECT cast(substr(id,9) AS UNSIGNED) INTO counter FROM printer ORDER BY cast(substr(id,9) AS UNSIGNED) DESC LIMIT 1;
    set counter:=counter+1;
    set new.id:=concat('PRINTER_',counter);
end//
delimiter ;
