use SSPS;

-- Trying to figure how to call this procedure monthly
drop procedure if exists addPaperToStudent;
DELIMITER //
create procedure addPaperToStudent()
begin
	declare date int default null;
    declare page int default null;
    
    select distributeConfig.date,distributeConfig.numberOfPage into date,page from distributeConfig limit 1;
    if month(now())=1 or month(now())=3 or month(now())=1 or month(now())=5 or month(now())=7 or month(now())=8 or month(now())=10 or month(now())=12 then
		if day(now())>=date then
			update student set papers=papers+page;
        end if;
    elseif month(now())=2 then
		if (day(now())>=date and date<29) or (date>=29 and (day(now())=28 or day(now())=29)) then
			update student set papers=papers+page;
        end if;
    else
		if (day(now())>=date and date<31) or (date=31 and day(now())=30) then
			update student set papers=papers+page;
        end if;
    end if;
end//
DELIMITER ;