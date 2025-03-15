

delimiter // 
create function getUserComments(pepesaurio int)
returns text deterministic
begin
	declare comentarios text;
	select GROUP_CONCAT(content SEPARATOR ' ||||| ') into comentarios 
	from comments JOIN users ON comments.user_id = users.user_id
	where users.user_id = pepesaurio;
    return comentarios;
end
//
