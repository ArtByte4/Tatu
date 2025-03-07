
INSERT INTO roles (name) VALUES
('usuario'),
('tatudador'),
('administrador');


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

