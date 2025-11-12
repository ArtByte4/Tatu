-- Script SQL para crear un usuario administrador
-- NOTA: Este script requiere que generes el hash de la contraseña primero usando bcrypt
-- Es más fácil usar el script TypeScript: npx tsx backend/scripts/createAdminUser.ts

-- Verificar que el rol administrador existe
-- Si no existe, ejecuta primero:
-- INSERT INTO roles (name) VALUES ('administrador');

-- Crear usuario administrador
-- IMPORTANTE: Reemplaza 'HASH_AQUI' con el hash bcrypt de tu contraseña
-- Puedes generar el hash ejecutando: node -e "const bcrypt = require('bcrypt'); bcrypt.hash('tu_password', 10).then(h => console.log(h));"

INSERT INTO users (
    user_handle, 
    email_address, 
    first_name, 
    last_name, 
    phonenumber, 
    role_id, 
    password_hash, 
    birth_day
) VALUES (
    'admin',                    -- user_handle (cambiar si es necesario)
    'admin@tatu.com',          -- email_address (cambiar si es necesario)
    'Administrador',           -- first_name
    'Sistema',                 -- last_name
    '1234567890',              -- phonenumber
    3,                         -- role_id (3 = administrador)
    'HASH_AQUI',              -- password_hash (REEMPLAZAR con hash bcrypt)
    '1990-01-01'              -- birth_day
);

-- Verificar que se creó correctamente
SELECT 
    user_id,
    user_handle,
    email_address,
    first_name,
    last_name,
    role_id,
    created_at
FROM users 
WHERE user_handle = 'admin';


