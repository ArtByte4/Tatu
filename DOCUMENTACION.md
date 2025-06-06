# 📌 Proyecto Tatu

Este repositorio contiene el proyecto **Tatu**, una red social desarrollada con **Vite**, **React** y **Node.js**.


## 📂 Estructura del Proyecto
```
/tatu_project
│── frontend/
│   ├── Tatu/
│   │   ├── package.json
│   │   ├── tsconfig.json            # Configuración de TypeScript
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
│   ├── package.json
│   ├── tsconfig.json                # Configuración de TypeScript
│   ├── src/
│   │   ├── app.ts                   # Configuración de la aplicación
│   │   ├── config.ts                # Variables de configuración
│   │   ├── db.ts                    # Configuración de base de datos
│   │   ├── index.ts                 # Punto de entrada
│   │   ├── routes.ts                # Rutas principales
│   │   ├── models/                  # Modelos de datos
│   │   └── modules/                 # Módulos de la aplicación
│   │       ├── auth/                # Módulo de autenticación
│   │       │   ├── authController.ts
│   │       │   ├── authRoutes.ts
│   │       │   └── authService.ts
│   │       └── user/                # Módulo de usuarios
│   │           ├── userController.ts
│   │           ├── userRoutes.ts
│   │           └── middlewares/     # Middlewares específicos
└── db/
    ├── functions/                    # Funciones SQL
    ├── triggers/                     # Triggers de la BD
    ├── cargar_datos_prueba.sql      # Datos iniciales
    └── script_tatu_db.sql           # Estructura de BD
```

## 🚀 Requisitos Previos

- Node.js versión 22 o superior
- MySQL 8.0 o superior
- Git
- pnpm (Package Manager)
- TypeScript 5.0 o superior
- ESLint para TypeScript

## 📌 Instalación y Configuración

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/[tu-usuario]/Tatu.git
cd Tatu
```

### 2️⃣ Configuración del Frontend

1. Navegar al directorio del frontend:
```bash
cd frontend/Tatu
```

2. Instalar dependencias usando pnpm:
```bash
pnpm install
```

3. Configurar variables de entorno:
Crear archivo `.env.local` en `frontend/Tatu/`:
```
VITE_API_URL=url_api
VITE_PUBLIC_KEY_IMAGEKIT=public_key 
VITE_PRIVATE_KEY_IMAGEKIT=private_key
```

4. Compilar TypeScript:
```bash
pnpm run build
```

### 3️⃣ Configuración del Backend

1. Navegar al directorio del backend:
```bash
cd backend
```

2. Instalar dependencias usando pnpm:
```bash
pnpm install
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

4. Compilar TypeScript:
```bash
pnpm run build
```


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

### Tecnologías
- Frontend construido con React + TypeScript + Vite
- Backend desarrollado en Node.js + TypeScript + Express
- Base de datos MySQL con funciones y triggers personalizados
- Sistema de autenticación JWT
- Estado global con Context API y stores tipados

### Arquitectura Backend
- Arquitectura modular por dominios (auth, user, etc.)
- Cada módulo contiene su propio controlador, rutas y servicios
- Middlewares específicos por módulo
- Tipos TypeScript para todos los modelos y respuestas API
- Sistema de validación de datos con TypeScript

### Características de Usuario
- Gestión de perfiles de usuario
- Carga y gestión de imágenes de perfil
- Sistema de seguidores
- Exploración de usuarios
- Sistema de verificación de usuarios
- Panel de administración
- Rutas protegidas por rol
- Diseño responsive

## 🛠 Scripts Disponibles

### Frontend
- `pnpm run dev`: Inicia el servidor de desarrollo
- `pnpm run build`: Compila TypeScript y construye la aplicación para producción
- `pnpm run preview`: Previsualiza la versión de producción
- `pnpm run lint`: Ejecuta ESLint para TypeScript
- `pnpm run typecheck`: Verifica tipos de TypeScript

### Backend
- `pnpm run dev`: Inicia el servidor en modo desarrollo con ts-node
- `pnpm run build`: Compila TypeScript para producción
- `pnpm run start`: Inicia el servidor en modo producción
- `pnpm run lint`: Ejecuta ESLint para TypeScript
- `pnpm run typecheck`: Verifica tipos de TypeScript

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

## 📝 Convenciones de Código y Buenas Prácticas

### TypeScript
- Usar tipos explícitos en lugar de `any`
- Interfaces para definir formas de objetos
- Enums para valores constantes
- Type Guards para narrowing de tipos
- Genéricos cuando sea apropiado
- Decoradores para metadatos (cuando sea necesario)

### Arquitectura y Organización
- Estructura modular por dominios
- Separación clara de responsabilidades (Controlador/Servicio/Modelo)
- Middlewares específicos por módulo
- Rutas tipadas y validadas
- Manejo centralizado de errores

### Convenciones de Nombrado
- PascalCase para interfaces, tipos y clases
- camelCase para variables y funciones
- UPPER_CASE para constantes
- Prefijo 'I' para interfaces (ej: IUser)
- Sufijo 'Type' para tipos (ej: UserType)

### Documentación
- TSDoc para funciones y clases públicas
- Comentarios explicativos para lógica compleja
- README.md en cada módulo importante
- Tipos exportados documentados

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

## 🔄 Migración y Mantenimiento

### Migración a TypeScript
- El proyecto ha sido completamente migrado de JavaScript a TypeScript
- Se mantienen solo archivos de configuración en JavaScript (vite.config.js, eslint.config.js)
- Todos los componentes React usan TypeScript (.tsx)
- Backend completamente tipado con TypeScript

### Control de Calidad
- ESLint configurado para TypeScript
- Comprobación estática de tipos
- Tests unitarios tipados
- Validación de tipos en tiempo de compilación

### Mantenimiento
- Usar `pnpm run typecheck` antes de commits
- Mantener definiciones de tipos actualizadas
- Seguir las convenciones de TypeScript
- Documentar cambios en tipos y interfaces

### Actualizaciones Futuras
- Mantener dependencias actualizadas con `pnpm update`
- Revisar compatibilidad de tipos después de actualizaciones
- Seguir las mejores prácticas de TypeScript
- Mantener la documentación actualizada

## 📚 Referencias

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Node.js TypeScript Guide](https://nodejs.org/en/learn/getting-started/nodejs-with-typescript)

---

🎯 **¡Listo! Ahora tienes todo configurado para comenzar a desarrollar en Tatu.**

Para cualquier duda adicional, consulta los archivos de configuración específicos o abre un issue en el repositorio.