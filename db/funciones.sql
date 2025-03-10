

DELIMITER //
CREATE PROCEDURE getComments()
BEGIN
    SELECT comments.*, users.*
    FROM comments
    JOIN users ON comments.user_id = users.user_id;
END 
//


