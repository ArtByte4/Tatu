

 📌 Proyecto Tatu

Este repositorio contiene el proyecto **Tatu**, desarrollado con **Vite** y **React**.

⚠ **IMPORTANTE:** Antes de clonar el proyecto, cada desarrollador debe realizar un **fork** del repositorio y trabajar sobre su propio fork.

📌 [ArtByte4/Tatu](https://github.com/ArtByte4/Tatu)


## 📂 Estructura del Proyecto
```
/tatu_project
│── frontend/
│   ├── tatu/
│   │   ├── .nvmrc  ← Archivo con la versión de Node.js
|   |   ├── .gitignore 
│   │   ├── package.json
│   │   ├── package-lock.lson
│   │   ├── src/
│   │   ├── public/
│── backend/
|   |   ├── .gitignore 
|   |   ├── .env
│   │   ├── package.json
│   │   ├── package-lock.lson
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│── db/
|   |   ├── function/
|   |   ├── cargar_datos_prueba.sql
|   |   ├── script_tatu_db.sql
│── config.md
│── README.md
```
---

## 📌 Instalación y configuración

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/ArtByte4/Tatu.git
cd Tatu/frontend/tatu
```

### 2️⃣ Verificar la versión de Node.js

```bash
nvm use
```

### 3️⃣ Instalar dependencias

Ejecutar el siguiente comando en la carpeta correspondiente:

```bash
npm install
```

📌 Ubicación de dependencias:
- **Frontend:** `Tatu/frontend/tatu/`
- **Backend:** `Tatu/backend/`

⚠️ **Nota:** Cada vez que se instale una nueva dependencia, es necesario volver a ejecutar `npm install` en la carpeta correspondiente.

---

## 📌 Configuración de la base de datos

### 1️⃣ Crear la base de datos local

Ejecutar en **MySQL Workbench** el siguiente script:

```bash
Tatu/db/script_tatu_db.sql
```

📌 **Nota:** Solo es necesario ejecutar el script una vez. Si se realizan cambios en la estructura, volver a ejecutar.

### 2️⃣ Crear usuario en MySQL

Ejecutar el siguiente código en **MySQL Workbench**:

```sql
-- Creación de usuario
CREATE USER 'usuario'@'%' IDENTIFIED BY 'tu_contraseña_segura';

-- Asignación de permisos

GRANT CREATE ROUTINE, EXECUTE, SELECT, INSERT, UPDATE, ALTER ON tatu_db.* TO 'usuario'@'localhost';


-- Aplicar privilegios
FLUSH PRIVILEGES;
```

### 3️⃣ Cargar datos de prueba

Ejecutar los siguientes scripts en **MySQL Workbench** con el usuario creado:

```bash
Tatu/db/cargar_datos_prueba.sql  # Insertar datos de prueba
Tatu/db/funciones.sql  # Cargar funciones y procedimientos almacenados
```

---

## 📌 Conectar la base de datos con el backend

1️⃣ Asegurar que todas las dependecias esten instaladas en el backend

---

2️⃣ Crear un archivo **.env** en `Tatu/backend/.env` con la siguiente configuración:

```bash
DB_HOST=localhost
DB_USER=nombre_usuario
DB_PASSWORD=contraseña_usuario // con comillas la contraseña
DB_NAME=tatu_db
DB_PORT=3306

SECRET_JWT_KEY=Clave_secreta_firma_token // con comillas
```

---

## 📌 Ejecución del proyecto

### 🚀 Iniciar el frontend

📍 Ubicación del frontend:
```bash
Tatu/frontend/tatu/
```

Ejecutar el siguiente comando para iniciar el entorno de desarrollo:
```bash
npm run dev
```

### 🚀 Iniciar el backend

📍 Ubicación del backend:
```bash
Tatu/backend/
```

Ejecutar el siguiente comando:
```bash
npm run dev 
```

---

** Asegurate que ambos servidores esten encendidos para que todo funcione correctamente

🎯 **¡Listo! Ahora el proyecto está en ejecución.**

