

delimiter //

create function getUserComments (pepesaurio int)
returns text deterministic
begin
declare comentarios text;
bucle: LOOP
    SET pepesaurio pepesaurio + 1;
    select GROUP_CONCAT(content SEPARATOR |||||) into comentarios
    from comments JOIN users ON comments.user id users.user id
    where users.user_id = pepesaurio;
IF pepesaurio > 10 THEN
LEAVE bucle;
end if;
end loop;
return comentarios;
end

//