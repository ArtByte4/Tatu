# 📌 Proyecto Tatu

Este repositorio contiene tanto el **frontend** como el **backend** del proyecto Tatu. Es importante seguir correctamente los pasos de instalación para evitar errores.

## 🚀 Clonación del repositorio

1. Abre una terminal y clona el repositorio con:

   ```sh
   git clone https://github.com/tu-usuario/tatu.git
   ```

2. Accede al directorio del proyecto:

   ```sh
   cd tatu
   ```

## 🛠 Configuración del entorno

### 1️⃣ Configurar la versión de Node.js

Este proyecto usa una versión específica de **Node.js**, definida en el archivo `.nvmrc`. Para asegurarte de usar la versión correcta:

- Si tienes `nvm` instalado, ejecuta:
  ```sh
  nvm use
  ```
  Si no tienes `nvm`, instala Node.js manualmente en la versión indicada en `.nvmrc`.

### 2️⃣ Instalar dependencias del **Frontend**

El frontend se encuentra en la carpeta `frontend`, por lo que debes moverte a esa carpeta antes de instalar las dependencias:

```sh
cd frontend
npm install
```

Esto instalará todas las dependencias definidas en `frontend/package.json`.

### 3️⃣ Volver a la raíz del proyecto

Después de instalar las dependencias del frontend, puedes volver a la raíz del proyecto si es necesario:

```sh
cd ..
```

## 🏗 Uso del proyecto

### 📌 Iniciar el **Frontend**

Para ejecutar el frontend en modo desarrollo:

```sh
cd frontend
npm run dev
```

Esto iniciará el servidor de desarrollo de Vite.

