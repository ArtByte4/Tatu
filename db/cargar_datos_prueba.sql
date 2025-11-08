



/* Todo los insert se encuentran aca, se usan a modo de empleo y no son reales*/



INSERT INTO roles (name) VALUES
('usuario'),
('tatudador'),
('administrador');


INSERT INTO `tatu_db`.`country` (`country_name`) VALUES
('México'),
('Estados Unidos'),
('España'),
('Colombia'),
('Argentina'),
('Brasil'),
('Canadá'),
('Italia'),
('Francia'),
('Alemania');

INSERT INTO `tatu_db`.`cities` (`country_id`, `city_name`) VALUES
(1, 'Ciudad de México'),
(1, 'Guadalajara'),
(2, 'Los Ángeles'),
(2, 'Nueva York'),
(3, 'Madrid'),
(3, 'Barcelona'),
(4, 'Bogotá'),
(5, 'Buenos Aires'),
(6, 'São Paulo'),
(7, 'Toronto');

INSERT INTO `tatu_db`.`tattoo_styles` (`tattoo_styles_name`) VALUES
('Realismo'),
('Neotradicional'),
('Acuarela'),
('Minimalista'),
('Geométrico'),
('Blackwork'),
('Japonés'),
('Tribal'),
('Lettering'),
('Old School');

INSERT INTO users (user_handle, email_address, first_name, last_name, phonenumber, role_id, password_hash, birth_day) VALUES
('carlos_r', 'carlos.ramirez@email.com', 'Carlos', 'Ramírez', '3012345678', 1, 'hashed_password_1', '1995-06-20'),
('ana_g', 'ana.gomez@email.com', 'Ana', 'Gómez', '3123456789', 1, 'hashed_password_2', '1998-09-15'),
('luis_f', 'luis.fernandez@email.com', 'Luis', 'Fernández', '3201234567', 1, 'hashed_password_3', '2000-03-10'),
('tatiana_l', 'tatiana.lopez@email.com', 'Tatiana', 'López', '3109876543', 1, 'hashed_password_4', '1997-12-05'),
('santiago_p', 'santiago.perez@email.com', 'Santiago', 'Pérez', '3001112233', 1, 'hashed_password_5', '1999-07-22'),
('paula_m', 'paula.martinez@email.com', 'Paula', 'Martínez', '3112233445', 1, 'hashed_password_6', '1996-10-11'),
('jorge_t', 'jorge.torres@email.com', 'Jorge', 'Torres', '3223344556', 1, 'hashed_password_7', '2001-04-18'),
('valentina_r', 'valentina.ruiz@email.com', 'Valentina', 'Ruiz', '3154455667', 1, 'hashed_password_8', '1994-08-30'),
('esteban_r', 'esteban.rojas@email.com', 'Esteban', 'Rojas', '3105566778', 1, 'hashed_password_9', '1993-11-25'),
('gabriela_c', 'gabriela.castro@email.com', 'Gabriela', 'Castro', '3176677889', 1, 'hashed_password_10', '2002-02-14');


INSERT INTO `tatu_db`.`posts` (`user_id`, `post_text`, `num_likes`, `num_comments`, `num_repost`, `tattoo_styles_id`)
VALUES
(1, 'Mi último tatuaje realizado.', 120, 15, 5, 1),
(1, 'Diseño en progreso...', 85, 8, 2, 2),
(2, 'Quiero hacerme un tatuaje nuevo.', 200, 50, 10, 3),
(4, 'Blackwork en proceso.', 30, 5, 1, 6),
(5, '¿Minimalista o geométrico?', 45, 10, 3, 4),
(7, 'Tattoo lettering personalizado.', 100, 20, 6, 9),
(8, 'Mostrando mi nueva tienda.', 150, 25, 8, 8),
(9, 'Inspiración para nuevos diseños.', 90, 12, 4, 7),
(10, 'Old school nunca pasa de moda.', 110, 18, 5, 10),
(6, 'Explorando el arte del tatuaje.', 130, 22, 7, 5);

INSERT INTO `tatu_db`.`appointments` (`user_id`, `tattoo_artist_id`, `date`, `status`)
VALUES
(2, 1, '2025-03-15 10:00:00', 'confirmada'),
(2, 1, '2025-03-20 15:00:00', 'pendiente'),
(5, 4, '2025-04-10 14:00:00', 'confirmada'),
(6, 4, '2025-04-15 11:30:00', 'pendiente'),
(7, 1, '2025-04-20 16:00:00', 'cancelada'),
(8, 1, '2025-05-01 09:00:00', 'confirmada'),
(9, 4, '2025-05-05 12:00:00', 'pendiente'),
(10, 1, '2025-05-10 10:30:00', 'confirmada'),
(2, 4, '2025-05-15 13:00:00', 'pendiente'),
(5, 1, '2025-05-20 15:30:00', 'cancelada');

INSERT INTO `tatu_db`.`comments` (`post_id`, `user_id`, `content`)
VALUES
(1, 2, '¡Qué buen trabajo!'),
(1, 3, 'Me encanta el detalle.'),
(2, 2, 'Interesante estilo.'),
(3, 5, 'Me gustaría hacerme uno así.'),
(4, 7, '¡Ese Blackwork está increíble!'),
(5, 9, 'Minimalista sin duda.'),
(6, 8, 'Lettering bien hecho.'),
(7, 6, 'Voy a visitar la tienda.'),
(8, 4, 'Inspirador trabajo.'),
(9, 2, 'Old school siempre será arte.');


INSERT INTO `tatu_db`.`followers` (`follower_id`, `following_id`)
VALUES
(1, 2),
(1, 3),
(2, 4),
(2, 5),
(3, 6),
(4, 7),
(5, 8),
(6, 9),
(7, 10),
(8, 1);

-- Insertar mensajes de prueba para crear conversaciones
-- Nota: Los mensajes se insertan después de que los usuarios existan (línea 51-61)
-- Los perfiles se crean automáticamente mediante el trigger after_insert_user_profile
-- Usuarios referenciados: 1=carlos_r, 2=ana_g, 3=luis_f, 4=tatiana_l

-- Conversación entre usuario 1 (carlos_r) y usuario 2 (ana_g)
INSERT INTO `tatu_db`.`messages` (`sender_id`, `receiver_id`, `content`, `sent_at`) VALUES
(1, 2, 'Hola Ana! ¿Cómo estás?', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(2, 1, 'Hola Carlos! Muy bien, gracias. ¿Y tú?', DATE_SUB(NOW(), INTERVAL 110 MINUTE)),
(1, 2, 'Todo bien por aquí. ¿Te gustaría ver algunos de mis diseños?', DATE_SUB(NOW(), INTERVAL 100 MINUTE)),
(2, 1, '¡Claro! Me encantaría verlos.', DATE_SUB(NOW(), INTERVAL 90 MINUTE)),
(1, 2, 'Perfecto, te los muestro luego.', DATE_SUB(NOW(), INTERVAL 80 MINUTE));

-- Conversación entre usuario 1 (carlos_r) y usuario 3 (luis_f)
INSERT INTO `tatu_db`.`messages` (`sender_id`, `receiver_id`, `content`, `sent_at`) VALUES
(3, 1, 'Hola Carlos, vi tu último trabajo. ¡Está increíble!', DATE_SUB(NOW(), INTERVAL 3 HOUR)),
(1, 3, 'Gracias Luis! Me alegra que te haya gustado.', DATE_SUB(NOW(), INTERVAL 170 MINUTE)),
(3, 1, '¿Podrías hacerme un diseño similar?', DATE_SUB(NOW(), INTERVAL 160 MINUTE)),
(1, 3, 'Por supuesto, podemos hablar sobre el diseño que tienes en mente.', DATE_SUB(NOW(), INTERVAL 150 MINUTE));

-- Conversación entre usuario 2 (ana_g) y usuario 4 (tatiana_l)
INSERT INTO `tatu_db`.`messages` (`sender_id`, `receiver_id`, `content`, `sent_at`) VALUES
(2, 4, 'Hola Tatiana! ¿Cómo va tu nuevo tatuaje?', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(4, 2, 'Hola Ana! Va muy bien, ya está casi listo.', DATE_SUB(NOW(), INTERVAL 23 HOUR)),
(2, 4, '¡Qué emocionante! Debe verse genial.', DATE_SUB(NOW(), INTERVAL 22 HOUR 50 MINUTE)),
(4, 2, 'Sí, estoy muy contenta con el resultado.', DATE_SUB(NOW(), INTERVAL 22 HOUR 40 MINUTE));