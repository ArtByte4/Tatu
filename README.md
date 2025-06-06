# Tatu - Red Social para Artistas 🎨

<div align="center">
  <img src="./frontend/Tatu/public/img/Banner-documentacion.png" alt="Tatu Logo"/>
  <br>
  <p><strong>Una plataforma social diseñada exclusivamente para la comunidad artística</strong></p>
</div>

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen.svg)](https://nodejs.org)
[![React Version](https://img.shields.io/badge/react-18.x-blue.svg)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/typescript-%3E%3D5.0.0-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/vite-latest-purple.svg)](https://vitejs.dev)
[![MySQL](https://img.shields.io/badge/mysql-8.0-blue.svg)](https://www.mysql.com)

## 🌟 Características Principales

- 🔐 **Autenticación Segura**: Sistema robusto de autenticación con JWT
- 👤 **Perfiles Personalizables**: Gestión completa de perfiles de usuario
- 🖼️ **Gestión de Imágenes**: Carga y administración de imágenes de perfil
- 🤝 **Sistema de Seguidores**: Conecta con otros artistas
- 🔍 **Exploración**: Descubre nuevos artistas y obras
- ✅ **Verificación**: Sistema de verificación de usuarios
- 📱 **Responsive**: Diseño adaptable a todos los dispositivos

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js ≥ 22.0.0
- MySQL 8.0 o superior
- pnpm
- Git
- TypeScript ≥ 5.0.0
- nvm (Node Version Manager)

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/[tu-usuario]/Tatu.git
cd Tatu
```

2. **Configurar el Frontend**
```bash
cd frontend/tatu
nvm use
pnpm install
```

3. **Configurar el Backend**
```bash
cd ../../backend
nvm use
pnpm install
```

4. **Configurar la Base de Datos**
- Ejecutar los scripts SQL en `db/script_tatu_db.sql`
- Configurar el usuario de la base de datos
- Cargar datos iniciales y funciones

Para más detalles sobre la instalación y configuración, consulta nuestra [Documentación Completa](DOCUMENTACION.md).

## 🛠️ Tecnologías Utilizadas

### Frontend
- React 18
- TypeScript 5
- Vite
- React Router DOM
- Axios
- Zustand
- React Icons

### Backend
- Node.js
- TypeScript
- Express.js
- JWT
- MySQL2
- Bcrypt
- Multer

### Base de Datos
- MySQL 8.0
- Triggers
- Stored Procedures
- Funciones Personalizadas

## 📁 Estructura del Proyecto

```
tatu_project/
├── frontend/           # Aplicación React con Vite
│   └── Tatu/
│       ├── src/
│       │   ├── features/    # Módulos principales
│       │   ├── lib/        # Configuraciones y utilidades
│       │   ├── stores/     # Estado global con Zustand
│       │   └── pages/      # Páginas principales
├── backend/           # Servidor Node.js/Express
│   └── src/
│       ├── modules/  # Módulos de la aplicación
│       └── models/   # Modelos de datos
└── db/               # Scripts y configuración de BD
```

Para una estructura más detallada, consulta nuestra [Documentación](DOCUMENTACION.md).

## 🚀 Scripts Disponibles

### Frontend
```bash
pnpm run dev      # Inicia el servidor de desarrollo
pnpm run build    # Construye para producción
pnpm run preview  # Preview de producción
```

### Backend
```bash
pnpm run dev      # Inicia el servidor en modo desarrollo
pnpm run start    # Inicia el servidor en producción
```

Para más información sobre las convenciones de código y commit, consulta [COMMIT_CONVENTION.md](COMMIT_CONVENTION.md).

## 🔐 Seguridad

- Autenticación JWT
- Encriptación de contraseñas
- Validación de datos
- Protección contra XSS
- Rate limiting
- Sanitización de inputs

## 🛡️ Licencia
Este proyecto está licenciado bajo la licencia [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/).  
Artbyte Technology se reserva el derecho exclusivo de uso comercial.

## 👥 Equipo

Desarrollado por el equipo de ArtByte.

## 🤔 Soporte

Si tienes problemas o sugerencias:

1. Revisa la [documentación](DOCUMENTACION.md)
2. Abre un issue

---

<div align="center">
  <p>Hecho con ❤️ por ArtByte</p>
  <img src="./frontend/Tatu/public/img/Logo _ART_BYTE.png" alt="ArtByte Logo" width="100"/>
</div>


