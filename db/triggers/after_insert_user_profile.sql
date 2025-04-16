
delimiter |
create trigger after_insert_user_profile
after insert on users
for each row
begin
	insert into profile (user_id, date_of_birth, gender, country_id, image, image_header, bio, follower_count)
    values (new.user_id ,new.birth_day, "M", 1, "url:image_default", "null", " ", 0);
end
|