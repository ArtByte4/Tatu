delimiter $$
create trigger after_insert_user
after insert on users
for each row
begin
    insert into user_settings (user_id, settings)
    values (new.user_id, 
        JSON_OBJECT(
            'allow_notifications', TRUE,
            'email_notifications', FALSE,
            'private_account', FALSE,
            'theme', 'dark',
            'language', 'es',
            'show_last_seen', TRUE,
            'allow_messages', TRUE
        )
    );
end $$

delimiter ;
