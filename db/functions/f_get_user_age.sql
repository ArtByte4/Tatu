


delimiter //
-- Funcion para generar la edad del usuario
create function get_user_age( user_id_param int )
returns int deterministic
begin
	declare user_age int;
	select timestampdiff(year, birth_day, curdate() ) 
    into user_age 
    from users
    where user_id = user_id_param;
    return user_age;
end;
//
