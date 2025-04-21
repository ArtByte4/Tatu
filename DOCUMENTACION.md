# 📌 Proyecto Tatu

Este repositorio contiene el proyecto **Tatu**, una red social desarrollada con **Vite**, **React** y **Node.js**.


## 📂 Estructura del Proyecto
```
/tatu_project
│── frontend/
│   ├── tatu/
│   │   ├── .nvmrc
│   │   ├── .gitignore
│   │   ├── package.json
│   │   ├── vite.config.js
│   │   ├── src/
│   │   │   ├── features/
│   │   │   │   ├── auth/             # Autenticación y autorización
│   │   │   │   ├── explore/          # Exploración de usuarios
│   │   │   │   ├── navigation/       # Navegación principal
│   │   │   │   ├── profile/          # Gestión de perfiles
│   │   │   │   └── registration/     # Registro de usuarios
│   │   │   ├── lib/                  # Configuraciones y utilidades
│   │   │   ├── stores/               # Estado global (auth)
│   │   │   └── pages/                # Páginas principales
│   │   └── public/
│   │       ├── img/                  # Imágenes estáticas
│   │       └── fuentes/              # Fuentes personalizadas
│── backend/
│   ├── .gitignore
│   ├── .env
│   ├── package.json
│   ├── controllers/                  # Lógica de negocio
│   ├── models/                       # Modelos de datos
│   ├── routes/                       # Rutas API
│   └── services/                     # Servicios (auth, etc)
└── db/
    ├── functions/                    # Funciones SQL
    ├── triggers/                     # Triggers de la BD
    ├── cargar_datos_prueba.sql      # Datos iniciales
    └── script_tatu_db.sql           # Estructura de BD
```

## 🚀 Requisitos Previos

- Node.js versión 22 o superior (especificada en `.nvmrc`)
- MySQL 8.0 o superior
- nvm (Node Version Manager)
- Git
- npm versión 9 o superior

## 📌 Instalación y Configuración

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/[tu-usuario]/Tatu.git
cd Tatu
```

### 2️⃣ Configuración del Frontend

1. Navegar al directorio del frontend:
```bash
cd frontend/tatu
```

2. Verificar/instalar la versión correcta de Node.js:
```bash
nvm install
nvm use
```

3. Instalar dependencias:
```bash
npm install
```

4. Configurar variables de entorno:
Crear archivo `.env.local` en `frontend/tatu/`:
```
VITE_API_URL= url_api
VITE_PUBLIC_KEY_IMAGEKIT=public_key 
ITE_PRIVATE_KEY_IMAGEKIT=private_key
```

### 3️⃣ Configuración del Backend

1. Navegar al directorio del backend:
```bash
cd backend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
Crear archivo `.env` en `backend/`:
```
# Database Configuration
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD="tu_contraseña"
DB_NAME=DB_NAME
DB_PORT=3306

# JWT Configuration
SECRET_JWT_KEY="tu_clave_secreta"
JWT_EXPIRES_IN=24h


### 4️⃣ Configuración de la Base de Datos

1. Crear la base de datos:
   - Abrir MySQL Workbench
   - Ejecutar el script: `db/script_tatu_db.sql`

2. Configurar usuario de la base de datos:
```sql
CREATE USER 'tu_usuario'@'localhost' IDENTIFIED BY 'tu_contraseña';

GRANT ALL PRIVILEGES ON tatu_db.* TO 'tu_usuario'@'localhost';

FLUSH PRIVILEGES;
```

3. Cargar datos iniciales y funciones:
```bash
# Ejecutar en MySQL Workbench en este orden:
db/cargar_datos_prueba.sql
db/functions/*.sql    # Funciones como get_user_age y getComments
db/triggers/*.sql     # Triggers para perfiles y usuarios
```

## 🚀 Ejecución del Proyecto

### Frontend

1. En `frontend/tatu/`:
```bash
npm run dev
```
El frontend estará disponible en: `http://localhost:5173`

### Backend

1. En `backend/`:
```bash
npm run dev
```
El servidor estará disponible en: `http://localhost:3000`

## 🔍 Características Principales

- Sistema de autenticación JWT
- Gestión de perfiles de usuario
- Carga y gestión de imágenes de perfil
- Sistema de seguidores
- Exploración de usuarios
- Sistema de verificación de usuarios
- Diseño responsive
- Rutas protegidas
- Estado global con Context API

## 🛠 Scripts Disponibles

### Frontend
- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run preview`: Previsualiza la versión de producción
- `npm run lint`: Ejecuta el linter

### Backend
- `npm run dev`: Inicia el servidor en modo desarrollo
- `npm run start`: Inicia el servidor en modo producción
- `npm run lint`: Ejecuta el linter

## ⚠️ Solución de Problemas Comunes

1. **Error de conexión a la base de datos**:
   - Verificar que MySQL esté ejecutándose: `sudo systemctl status mysql`
   - Comprobar credenciales en `.env`
   - Verificar que el puerto 3306 esté disponible: `netstat -tuln | grep 3306`

2. **Error en la carga de imágenes**:
   - Verificar permisos del directorio `uploads`
   - Comprobar la configuración de CORS
   - Validar el tamaño máximo de archivo (5MB por defecto)

3. **Errores de CORS**:
   - Verificar que `CORS_ORIGIN` coincida con la URL del frontend
   - Comprobar que ambos servidores estén ejecutándose

4. **Problemas con las rutas protegidas**:
   - Validar que el token JWT esté siendo enviado correctamente
   - Verificar la expiración del token
   - Comprobar la clave secreta en el backend

## 📝 Convenciones de Código

### Estructura de Commits
```
tipo(alcance): descripción corta

[cuerpo opcional]

[nota al pie opcional]
```

Tipos de commits:
- `feat`: Nueva característica
- `fix`: Corrección de error
- `docs`: Cambios en documentación
- `style`: Cambios de formato
- `refactor`: Refactorización de código
- `test`: Añadir o modificar tests
- `chore`: Tareas de mantenimiento


### Estilo de Código
- Usar ESLint con la configuración proporcionada
- Indentación con 2 espacios
- Punto y coma al final de las líneas
- Comillas simples para strings
- Nombres de componentes en PascalCase
- Nombres de funciones en camelCase

## 🔐 Seguridad

- No compartir variables de entorno
- Mantener dependencias actualizadas: `npm audit`
- Implementar rate limiting en producción
- Sanitizar inputs de usuario
- Usar HTTPS en producción
- Validar tokens JWT
- Encriptar contraseñas con bcrypt


## 📦 Dependencias Principales

### Frontend
- React 18
- React Router DOM
- Axios
- React Icons
- Zustand para estado global

### Backend
- Express.js
- MySQL2
- JWT
- Bcrypt
- Multer para uploads
- CORS

---

🎯 **¡Listo! Ahora tienes todo configurado para comenzar a desarrollar en Tatu.**

Para cualquier duda adicional, consulta los archivos de configuración específicos o abre un issue en el repositorio.