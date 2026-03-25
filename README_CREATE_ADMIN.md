# Crear Usuario Administrador

Este documento explica cómo crear un usuario administrador en la base de datos.

## Método 1: Script TypeScript (Recomendado)

Este es el método más fácil y seguro, ya que genera automáticamente el hash de la contraseña.

### Uso básico (valores por defecto)

```bash
cd backend
npm run create-admin
```

Esto creará un usuario con:
- **Username**: `admin`
- **Email**: `admin@tatu.com`
- **Contraseña**: `admin123`
- **Nombre**: `Administrador Sistema`
- **Teléfono**: `1234567890`
- **Fecha de nacimiento**: `1990-01-01`
- **Rol**: Administrador (role_id = 3)

### Uso con valores personalizados

Puedes personalizar los valores usando variables de entorno:

```bash
cd backend
ADMIN_USERNAME=miadmin \
ADMIN_EMAIL=admin@mitatu.com \
ADMIN_PASSWORD=MiPasswordSegura123 \
ADMIN_FIRSTNAME=Juan \
ADMIN_LASTNAME=Pérez \
ADMIN_PHONE=3001234567 \
ADMIN_BIRTHDAY=1985-05-15 \
npm run create-admin
```

### Variables de entorno disponibles

- `ADMIN_USERNAME`: Nombre de usuario (default: `admin`)
- `ADMIN_EMAIL`: Email del administrador (default: `admin@tatu.com`)
- `ADMIN_PASSWORD`: Contraseña (default: `admin123`)
- `ADMIN_FIRSTNAME`: Nombre (default: `Administrador`)
- `ADMIN_LASTNAME`: Apellido (default: `Sistema`)
- `ADMIN_PHONE`: Teléfono (default: `1234567890`)
- `ADMIN_BIRTHDAY`: Fecha de nacimiento en formato YYYY-MM-DD (default: `1990-01-01`)

## Método 2: Script SQL (Manual)

Si prefieres usar SQL directamente, puedes usar el archivo `db/create_admin_user.sql`, pero necesitarás generar el hash de la contraseña primero.

### Generar hash de contraseña

```bash
cd backend
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('tu_password', 10).then(h => console.log(h));"
```

Luego reemplaza `HASH_AQUI` en el archivo SQL con el hash generado y ejecuta:

```sql
-- En tu cliente MySQL
source db/create_admin_user.sql
```

## Verificar que el usuario fue creado

Puedes verificar que el usuario administrador fue creado correctamente ejecutando:

```sql
SELECT 
    user_id,
    user_handle,
    email_address,
    first_name,
    last_name,
    role_id,
    created_at
FROM users 
WHERE role_id = 3;
```

## Importante

1. **Cambia la contraseña** después del primer inicio de sesión
2. **Asegúrate** de que el rol administrador (role_id = 3) existe en la tabla `roles`
3. El script verifica automáticamente que no exista un usuario con el mismo username o email
4. Los triggers de la base de datos crearán automáticamente el perfil y las configuraciones del usuario

## Solución de problemas

### Error: "El rol administrador no existe"

Ejecuta primero:
```sql
INSERT INTO roles (name) VALUES ('administrador');
```

### Error: "Ya existe un usuario con ese username o email"

El script no creará un usuario duplicado. Cambia el username o email usando las variables de entorno.

### Error de conexión a la base de datos

Asegúrate de que las variables de entorno estén configuradas correctamente en tu archivo `.env`:
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_PORT`



