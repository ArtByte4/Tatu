# Documentación Técnica de Arquitectura - Tatu

**Versión:** 1.0  
**Fecha:** 7 de febrero de 2026  
**Estado:** Estable

---

## 1. Introducción y Visión General

Tatu es una red social especializada en la comunidad de tatuajes, diseñada como una plataforma moderna que conecta artistas, aficionados y clientes en un ecosistema digital. El sistema ha sido arquitectado bajo principios de modularidad y separación clara de responsabilidades, permitiendo tanto el mantenimiento actual como la escalabilidad futura.

El proyecto está construido sobre una arquitectura de tres capas principales: una aplicación frontend basada en React, un backend API REST con capacidades real-time, y una base de datos relacional MySQL. Esta separación fundamental permite a cada capa evolucionar independientemente mientras mantiene contratos bien definidos a través de interfaces HTTP y WebSocket.

### 1.1 Componentes Macro

```
┌─────────────────────────────────────────────────────────────────┐
│                    TATU SOCIAL NETWORK                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │   FRONTEND       │  │    BACKEND       │  │   DATABASE   │  │
│  │                  │  │                  │  │              │  │
│  │ React 19 + TS    │  │ Express + TS     │  │  MySQL 8.0   │  │
│  │ Vite Build       │  │ Socket.io        │  │              │  │
│  │ Zustand State    │━━┥ Modular Routes   ┃  │ 14+ Tablas   │  │
│  │ Axios + Zod      │  │ JWT Auth         ├──┬─ Triggers    │  │
│  │                  │  │ Pool Connections │  │ Funciones    │  │
│  └──────────────────┘  │                  │  │ SQL          │  │
│         (Vite)         │ Real-time Events │  │              │  │
│      Port 5173         └──────────────────┘  └──────────────┘  │
│                           (Node.js)                              │
│                          Port 3000              Port 3306        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

      HTTP + WebSocket (Socket.io)           MySQL Protocol
           ↑           ↓                            ↓
      Cookies (JWT)    Real-time Events    Raw SQL Queries
      CORS Enabled     Binary Protocol     Prepared Stmts
```

### 1.2 Características Principales

- **Autenticación Robusta:** JWT con refresh tokens en HTTP-only cookies, protección contra CSRF
- **Comunicación Real-time:** Socket.io bidireccional para mensajería instantánea e indicadores de escritura
- **Validación en Dos Capas:** Esquemas Zod en cliente y validaciones en backend
- **Persistencia Automática:** Triggers SQL crean automáticamente configuraciones de usuario al registrarse
- **Modularidad:** Código organizado por dominios (auth, user, posts, messages) tanto en frontend como backend
- **Type Safety:** TypeScript en 100% del código (backend y frontend)

---

## 2. Stack Tecnológico

### 2.1 Backend

| Componente | Herramienta | Versión | Propósito |
|-----------|-----------|---------|----------|
| **Runtime** | Node.js | 18.x+ | Ejecución de JavaScript/TypeScript |
| **Framework Web** | Express.js | 4.21.2+ | Enrutamiento HTTP y middleware |
| **Lenguaje** | TypeScript | 5.8.3+ | Type safety y desarrollo robusto |
| **Driver BD** | mysql2 | 3.13.0+ | Conexión a MySQL con soporte Promises |
| **Autenticación** | jsonwebtoken | 9.0.2+ | Generación y validación de JWT |
| **Encriptación** | bcrypt | 5.1.1+ | Hash de contraseñas (10 salt rounds) |
| **Real-time** | socket.io | 4.8.1+ | Comunicación bidireccional |
| **CORS** | cors | 2.8.5+ | Control de acceso entre orígenes |
| **Cuaderno** | cookie-parser | 1.4.7+ | Parseado de cookies HTTP |
| **Dev Tools** | tsx, nodemon | latest | Ejecución TS sin compilación, recarga automática |
| **Linting** | ESLint | latest | Análisis de código |
| **Gestor Paquetes** | pnpm | 9.x+ | Instalación de dependencias |

### 2.2 Frontend

| Componente | Herramienta | Versión | Propósito |
|-----------|-----------|---------|----------|
| **Framework** | React | 19.0.0+ | Interfaz de usuario declarativa |
| **Lenguaje** | TypeScript | 5.8.3+ | Type safety en frontend |
| **Build Tool** | Vite | 6.1.0+ | Bundler moderno ultra rápido |
| **Routing** | React Router | 7.2.0+ | Navegación client-side |
| **State Global** | Zustand | latest | State management minimalista |
| **HTTP Client** | Axios | latest | Solicitudes HTTP con interceptores |
| **Validación** | Zod | latest | Esquemas TypeScript con runtime validation |
| **Real-time** | Socket.io-client | 4.8.1+ | Cliente WebSocket |
| **Dev Server** | Vite Dev Server | 6.1.0+ | Hot Module Replacement (HMR) |
| **Linting** | ESLint | latest | Análisis de código frontend |
| **Gestor Paquetes** | pnpm | 9.x+ | Instalación de dependencias |

### 2.3 Database

| Componente | Especificación | Detalle |
|-----------|---------------|---------|
| **SGBD** | MySQL | 8.0+ |
| **Charset** | UTF-8 MB4 | Soporte completo Unicode |
| **Pool Conexiones** | mysql2 Pool | Reutilización de conexiones |
| **Índices** | 10+ índices | Optimización de búsquedas frecuentes |
| **Triggers** | 2 principales | Creación automática de perfil y settings |
| **Funciones SQL** | 2 funciones | Cálculos de edad y consultas complejas |
| **Relaciones** | 14+ tablas | Normalización hasta 3NF |

### 2.4 Herramientas Compartidas

- **pnpm Workspace:** Monorepo management con `pnpm-workspace.yaml`
- **ESLint:** Linting consistente en backend y frontend
- **TypeScript:** Compilador con `tsconfig.json` por proyecto

---

## 3. Arquitectura del Backend

### 3.1 Estructura Modular

El backend se organiza bajo el patrón de **Modular Monolith**, donde cada módulo representa un dominio de negocio autónomo:

```
backend/src/
├── index.ts                              (Punto de entrada)
├── app.ts                                (Configuración Express)
├── config.ts                             (Variables de entorno)
├── routes.ts                             (Agregador de rutas)
├── db.ts                                 (Pool de conexiones MySQL)
├────────────────────────────────────────
├── modules/
│   ├── auth/                             # Dominio: Autenticación
│   │   ├── authController.ts             (Lógica HTTP)
│   │   ├── authRoutes.ts                 (Definición de endpoints)
│   │   └── authService.ts                (Lógica de negocio)
│   │
│   ├── user/                             # Dominio: Gestión de usuarios
│   │   ├── userController.ts
│   │   ├── userRoutes.ts
│   │   ├── middlewares/
│   │   │   ├── validateToken.ts          (Verificación JWT)
│   │   │   └── validateAdmin.ts          (Verificación rol)
│   │   └── models/ (potencial)
│   │
│   ├── posts/                            # Dominio: Posts y comentarios
│   │   ├── postController.ts
│   │   ├── postModel.ts                  (Queries SQL)
│   │   ├── postRoutes.ts
│   │   ├── commentController.ts
│   │   └── commentModel.ts
│   │
│   ├── messages/                         # Dominio: Mensajería
│   │   ├── messageController.ts
│   │   ├── messageModel.ts
│   │   ├── messageRoutes.ts
│   │   └── socketService.ts              (Socket.io handlers)
│   │
│   └── models/                           # Modelos compartidos
│       └── userModel.ts                  (Queries de usuario)
│
└── scripts/
    └── createAdminUser.ts                (Script de setup)
```

### 3.2 Patrón Arquitectónico: MVC Modular

El backend implementa una variante del patrón MVC con separación clara de responsabilidades:

```
HTTP Request
    ↓
[Express Router] → Match ruta
    ↓
[Middleware Stack] → cors, json parser, verifyToken, etc.
    ↓
[Controller] → Validaciones de entrada, orquestación
    ↓
[Service Layer] → Lógica de negocio (hash, comparación, etc.)
    ↓
[Model/Query] → Acceso a datos SQL
    ↓
[MySQL Database] → Ejecución y retorno
    ↓
[Response Handler] → JSON + Status Code
    ↓
HTTP Response
```

**Capas Identificadas:**

1. **Controllers:** Manejan solicitudes HTTP, validan input, invocan servicios
2. **Services:** Contienen lógica de negocio (bcrypt, JWT generation)
3. **Models:** Ejecutan queries SQL directas a la BD
4. **Middlewares:** Pre-procesan requests (autenticación, autorización)
5. **Routes:** Definen endpoints y mapean a controllers

### 3.3 Autenticación y Autorización

El sistema implementa autenticación con **JSON Web Tokens (JWT)** con refresh token strategy:

```
Login Flow:
─────────

1. POST /api/auth/login
   ├─ Body: { user_handle, password_hash }
   │
2. Controller Valida Input
   ├─ Verifica que no esté vacío
   │
3. Service ejecuta:
   ├─ getUserByUserHandle() → BD
   ├─ bcrypt.compare(input, hash) en BD
   │
4. Si válido, genera tokens:
   ├─ Access Token (JWT, 1 hora)
   │  └─ Payload: { id, role, username }
   ├─ Refresh Token (JWT, 7 días)
   │  └─ Payload: { id, username }
   │
5. Envía cookies HTTP-only:
   ├─ Cookie: access_token (1h expiry)
   ├─ Cookie: refresh_token (7d expiry)
   ├─ Flag: HttpOnly, Secure, SameSite=Strict
   │
6. Response: { validation: true, user_data }
   │
7. Frontend almacena en Zustand + localStorage
```

**Middleware de Verificación:**

```typescript
verifyToken middleware:
├─ Lee cookie: access_token
├─ Verifica firma JWT con SECRET_JWT_KEY
├─ Si válido: agrega req.user al contexto
├─ Si inválido o expirado: retorna 401 Unauthorized
│
Auto-refresh (desde frontend):
├─ Si recibe 401, interceptor Axios:
│  ├─ POST /api/auth/refresh
│  ├─ Envía refresh_token desde cookie
│  ├─ Backend genera nuevo access_token
│  ├─ Reinicia solicitud original automáticamente
│  └─ Si refresh falla: logout y redirect /login
```

**Autorización por Rol:**

```typescript
verificarAdmin middleware:
├─ Verifica que req.user.role === ID_ROL_ADMIN
├─ Si no es admin: retorna 403 Forbidden
└─ Protege endpoints sensibles (/api/admin/*)
```

### 3.4 Socket.io - Real-time Communications

El módulo de mensajería implementa comunicación en tiempo real bidireccional:

```
Connection Handshake:
────────────────────

1. Cliente intenta conectar a Socket.io
   └─ Envía token JWT en auth datos u query params

2. Servidor verifica token en middleware
   ├─ Extraer token de: auth → query → cookies
   ├─ Validar firma con SECRET_JWT_KEY
   ├─ Si inválido: rechaza conexión

3. Socket autenticado se une a salas
   └─ Emite evento: 'connection'

Event Flow (Mensajería):
───────────────────────

Cliente A envía:
└─ socket.emit('send_message', {
     receiver_id: 42,
     content: 'Hola mundo'
   })

Servidor recibe:
├─ Valida usuario y contenido
├─ Inserta en BD: messages table
├─ Genera roomId: Math.min(userId, receiverId) + Math.max(...)
├─ Socket.to(roomId).emit('new_message', {...})

Cliente B recibe:
└─ socket.on('new_message', updateUI)

Indicador de Escritura:
──────────────────────

start_typing:
├─ socket.emit('start_typing', {receiver_id})
├─ Servidor: io.to(roomId).emit('user_typing', {sender})

stop_typing (con timeout):
├─ socket.emit('stop_typing', {receiver_id})
├─ Evita loops con flag isRefreshing
└─ Limpia indicadores después de inactividad
```

### 3.5 Integración Express + Socket.io

```typescript
Instancia compartida:
├─ Express app crea servidor HTTP
├─ Socket.io se adjunta al mismo servidor
├─ Ambos escuchan en mismo puerto (3000)
│
Comunicación bidireccional:
├─ Express maneja REST: /api/*
├─ Socket.io maneja WebSocket: socket events
└─ Comparten autenticación (JWT + cookies)
```

### 3.6 Gestión de Base de Datos

```typescript
Connection Pool Strategy:
────────────────────────

const pool = mysql.createPool({
  host: DB_HOST,           // localhost
  user: DB_USER,           // usuario mysql
  password: DB_PASSWORD,   // contraseña
  database: DB_NAME,       // tatu_db
  port: DB_PORT,           // 3306
  waitForConnections: true,
  connectionLimit: 10,     // Máx conexiones simultáneas
  queueLimit: 0            // Sin límite de espera
});

Ejecutar Query:
──────────────

const [rows] = await pool.query(sql, [params]);

├─ Prepared Statements con ? placeholders
├─ Protección contra SQL injection
├─ Resultado es Promise that resolves to [rows, fields]
└─ Destructuring automático en controllers
```

### 3.7 Rutas Principales

```
POST   /api/auth/login              → Login con credenciales
POST   /api/auth/refresh            → Generar nuevos tokens
POST   /api/auth/logout             → Limpiar cookies

GET    /api/users/:userId           → Perfil de usuario
GET    /api/users/handle/:handle    → Buscar por username
PUT    /api/users/:userId           → Actualizar perfil
DELETE /api/users/:userId           → Eliminar cuenta
POST   /api/users/search            → Búsqueda de usuarios

POST   /api/posts                   → Crear post con imágenes
GET    /api/posts                   → Listar feed (con filtros)
GET    /api/posts/:postId           → Detalle de post
DELETE /api/posts/:postId           → Eliminar post
POST   /api/posts/:postId/like      → Like en post
DELETE /api/posts/:postId/like      → Unlike post

POST   /api/posts/:postId/comments  → Crear comentario
GET    /api/posts/:postId/comments  → Listar comentarios
DELETE /api/comments/:commentId     → Eliminar comentario

GET    /api/messages                → Listar conversaciones (REST backup)
POST   /api/messages                → Crear mensaje (REST backup)

GET    /api/admin/dashboard         → Panel administrativo (requiere rol admin)
POST   /api/admin/users             → Crear usuario (admin)
PUT    /api/admin/users/:userId     → Editar usuario (admin)
DELETE /api/admin/users/:userId     → Eliminar usuario (admin)
```

---

## 4. Arquitectura del Frontend

### 4.1 Estructura Feature-Based

El frontend organiza su código alrededor de **features** (dominios de negocio), no niveles técnicos:

```
src/
├── pages/                                  (Componentes de página)
│   ├── index.ts
│   ├── AdminDashboard/                    (Feature admin)
│   ├── Explore/                           (Feed principal)
│   ├── Messages/                          (Mensajería)
│   ├── Perfil/                            (Perfil de usuario)
│   └── Search/                            (Búsqueda)
│
├── features/                               (Lógica por dominio)
│   ├── auth/                              # Dominio: Autenticación
│   │   ├── index.ts                       (Exportación pública)
│   │   ├── components/
│   │   │   └── AuthForm.tsx               (Formulario login)
│   │   ├── api/
│   │   │   └── loginUser.ts               (Llamada HTTP)
│   │   ├── hooks/
│   │   │   └── useAuth.ts                 (Lógica del form)
│   │   ├── context/
│   │   │   └── AuthProvider.tsx
│   │   ├── types/
│   │   │   └── FormState.ts
│   │   ├── validation/
│   │   │   └── loginValidation.ts         (Esquema Zod)
│   │   └── styles/
│   │       └── authForm.css
│   │
│   ├── posts/
│   │   ├── components/
│   │   │   ├── PostCard.tsx               (Item individual)
│   │   │   ├── PostGrid.tsx               (Grilla)
│   │   │   ├── PostModal.tsx              (Modal detalle)
│   │   │   ├── CommentsModal.tsx
│   │   │   └── PostForm.tsx               (Creación)
│   │   ├── api/
│   │   │   └── postApi.ts                 (CRUD operations)
│   │   ├── hooks/
│   │   │   ├── usePosts.ts                (Fetch + state)
│   │   │   ├── useCreatePost.ts
│   │   │   └── useFilterPosts.ts
│   │   ├── types/
│   │   │   └── Post.ts
│   │   └── styles/
│   │
│   ├── messages/
│   │   ├── components/
│   │   │   ├── ConversationList.tsx
│   │   │   └── ChatWindow.tsx
│   │   ├── api/
│   │   ├── hooks/
│   │   │   ├── useMessages.ts
│   │   │   └── useSocket.ts
│   │   ├── context/
│   │   │   └── MessageProvider.tsx
│   │   └── styles/
│   │
│   ├── profile/
│   ├── explore/
│   ├── filter/
│   ├── navigation/
│   ├── search/
│   ├── admin/
│   └── registration/
│
├── components/
│   └── PrivateRoute.tsx                    (Protección de rutas)
│
├── lib/
│   ├── axiosConfig.ts                      (Instancia Axios con interceptores)
│   ├── config.ts                           (Constantes globales)
│   └── index.ts
│
├── stores/
│   ├── authStore.ts                        (Zustand global state)
│   └── index.ts
│
├── routes/
│   └── ProtectedRouterAdmin.tsx            (Router con guard admin)
│
├── assets/
│   └── styles/
│       ├── variables.css                   (Colores, espaciados)
│       └── index.css                       (Globales)
│
├── App.tsx
└── main.tsx
```

### 4.2 State Management

**Zustand - Global State (authStore):**

```typescript
useAuthStore estructura:
├─ isAuthenticated: boolean
├─ user: { username: string, rol: number, id: number }
├─ photo: string | null
│
├─ login(user_handle, user_id, role_id): void
│  └─ Actualiza estado + persiste en localStorage
│
├─ logout(): void
│  └─ Limpia estado y localStorage
│
└─ profileData(url): void
   └─ Actualiza foto de perfil

Persistencia:
├─ Middleware: persist() de zustand
├─ Storage: localStorage
├─ Clave: 'auth-storage'
└─ Se recupera automáticamente en page load
```

**React Context - Feature-Specific (MessageProvider):**

```typescript
MessageContext usado para:
├─ Compartir socket.io instance
├─ Distribución de eventos Socket
├─ Cache de conversaciones
└─ Estado de mensajes sin globalizar
```

### 4.3 Axios y Auto-Refresh con Interceptores

```
Configuración Base:
──────────────────

export const instance = axios.create({
  baseURL: VITE_API_BASE_URL,      // http://localhost:3000
  withCredentials: true,            // Envía cookies
  timeout: 5000                     // Timeout 5s
});

Interceptor Response (Auto-refresh):
─────────────────────────────────

1. Respuesta 401 Unauthorized
   ├─ Cola de solicitudes pendientes
   └─ Llama a refreshAccessToken()

2. refreshAccessToken():
   ├─ POST /api/auth/refresh
   ├─ Envía refresh_token desde cookie
   ├─ Recibe nuevo access_token
   └─ Persiste en cookie (servidor)

3. Reintenta solicitud original:
   ├─ Con nuevo token automático
   ├─ Procesa respuesta
   └─ Retorna a componente

4. Si refresh falla (401):
   ├─ useAuthStore.logout()
   ├─ Limpia localStorage
   └─ Redirect a /login

Ventajas:
─────────
✅ Transparente para components
✅ Token siempre fresco
✅ Evita race conditions con cola
✅ Logout automático si refresh falla
```

### 4.4 Validación Zod

El frontend implementa validación en dos capas usando esquemas Zod:

```
Login Validation:
────────────────

LoginSchema = z.object({
  user_handle: z.string()
    .nonempty("Nombre de usuario requerido")
    .trim(),
  password_hash: z.string()
    .nonempty("Contraseña requerida")
    .trim()
});

Uso en componente:
├─ onBlur: validateField(name, value)
├─ Muestra errores en tiempo real
├─ onSubmit: valida esquema completo
└─ Si pasa → llamada HTTP


Registro (3 pasos):
──────────────────

Step 1 - SignupStepOneSchema:
├─ first_name: string (3-30 chars)
├─ last_name: string (3-30 chars)
└─ email_address: email válido

Step 2 - SignupStepTwoSchema:
├─ phonenumber: string (formato COL: 3XXXXXXXXX)
├─ user_handle: string (3-30, alphanumeric)
└─ password_hash: string (6-30)

Step 3 - SignupStepThreeSchema:
├─ birth_day: date
├─ Validación custom:
│  └─ age >= 13 años (supRefine)
└─ Si falla: mensaje personalizado

Ventajas Zod:
─────────────
✅ TypeScript-first schemas
✅ Runtime validation (no solo types)
✅ Mensajes de error customizables
✅ Composición de esquemas
✅ Validación condicional (superRefine)
```

### 4.5 Hooks Customizados

**useAuth:** Maneja lógica del formulario de login
```
├─ Estado: email, password, errores, loading
├─ handleChange: actualiza estado
├─ performLogin: invoca API y actualiza Zustand
└─ handleSubmit: orquesta validación y login
```

**usePosts:** Fetch y gestión de posts
```
├─ Fetch posts con filtros opcionales
├─ Loading y error states
├─ deletePost con optimistic updates
└─ Invalidación de cache
```

**useFilterPosts:** Filtrado por estilos de tatuaje
```
├─ Fetch de estilos disponibles
├─ Estado de selección
└─ Requery de posts al cambiar filtro
```

**useMessages:** Gestión de conversaciones
```
├─ Fetch conversaciones previas
├─ Actualización en tiempo real vía Socket
├─ Persistencia de últimos mensajes
└─ Integración con MessageProvider
```

**useSocket:** Cliente Socket.io
```
├─ Creación de conexión autenticada
├─ Manejo de eventos (new_message, user_typing)
├─ Desconexión limpia
└─ Reconexión automática
```

### 4.6 Routing y Protección

```
React Router v7:

Public Routes:
├─ /login                    → AuthForm
└─ /register                 → StepsRegister

Protected Routes (requiere isAuthenticated):
├─ /                         → Explore (feed)
├─ /profile/:username        → Perfil de usuario
├─ /messages                 → Mensajería
└─ /search                   → Búsqueda

Admin Routes (requiere role === ADMIN):
└─ /admin/dashboard          → AdminDashboard

Componentes de Protección:
─────────────────────────

<PrivateRoute>:
├─ Verifica useAuthStore.isAuthenticated
├─ Si false: redirect /login
└─ Si true: renderiza children

<ProtectedRouterAdmin>:
├─ Verifica role en Zustand
├─ Verificación secundaria: GET /api/admin/dashboard
├─ Si falla: redirect /
└─ Renderiza <Outlet> si válido
```

---

## 5. Arquitectura de Base de Datos

### 5.1 Modelo Relacional

La base de datos contiene 14+ tablas normalizadas hasta 3NF (Tercera Forma Normal):

```
┌─────────────────────────────────────────────────────────────┐
│                     USUARIOS Y PERFILES                     │
├─────────────────────────────────────────────────────────────┤
│
│  users (PK: user_id)
│  ├─ user_id: INT PRIMARY KEY AUTO_INCREMENT
│  ├─ first_name: VARCHAR(255)
│  ├─ last_name: VARCHAR(255)
│  ├─ email_address: VARCHAR(255) UNIQUE
│  ├─ user_handle: VARCHAR(255) UNIQUE
│  ├─ password_hash: VARCHAR(255) [bcrypt hash]
│  ├─ birth_day: DATE
│  ├─ phonenumber: VARCHAR(10)
│  └─ created_at: TIMESTAMP
│
│     ↓ (1:1)
│
│  profile (PK: profile_id, FK: user_id)
│  ├─ profile_id: INT
│  ├─ user_id: INT UNIQUE FK → users
│  ├─ date_of_birth: DATE
│  ├─ gender: ENUM('M', 'F', 'O')
│  ├─ country_id: INT FK → country
│  ├─ image: VARCHAR(500) [URL o path]
│  ├─ image_header: VARCHAR(500)
│  ├─ bio: TEXT
│  ├─ follower_count: INT DEFAULT 0
│  └─ updated_at: TIMESTAMP
│
│     ↓ (1:1)
│
│  user_settings (PK: user_settings_id, FK: user_id)
│  ├─ user_settings_id: INT
│  ├─ user_id: INT UNIQUE FK → users
│  ├─ settings: JSON
│  │  └─ Estructura: {
│  │      allow_notifications: bool,
│  │      email_notifications: bool,
│  │      private_account: bool,
│  │      theme: 'light'|'dark',
│  │      language: 'es'|'en',
│  │      show_last_seen: bool,
│  │      allow_messages: bool
│  │    }
│  └─ updated_at: TIMESTAMP
│
│     ↓ (1:N)
│
│  image (PK: image_id, FK: user_id)
│  └─ Almacenamiento de todas las imágenes del usuario
│
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   CONTENIDO Y SOCIAL                        │
├─────────────────────────────────────────────────────────────┤
│
│  posts (PK: post_id, FK: user_id, tattoo_styles_id)
│  ├─ post_id: INT PRIMARY KEY AUTO_INCREMENT
│  ├─ user_id: INT FK → users
│  ├─ tattoo_styles_id: INT FK → tattoo_styles
│  ├─ description: TEXT
│  ├─ created_at: TIMESTAMP
│  └─ updated_at: TIMESTAMP
│
│     ↓ (N:M)
│
│  post_image (PK: (post_id, image_id))
│  ├─ post_id: INT FK → posts
│  └─ image_id: INT FK → image
│
│  post_likes (PK: (user_id, post_id))
│  ├─ user_id: INT FK → users
│  └─ post_id: INT FK → posts
│
│  comments (PK: comment_id, FK: post_id, user_id)
│  ├─ comment_id: INT PRIMARY KEY
│  ├─ post_id: INT FK → posts
│  ├─ user_id: INT FK → users
│  ├─ content: TEXT
│  ├─ created_at: TIMESTAMP
│  └─ updated_at: TIMESTAMP
│
│  tattoo_styles (PK: tattoo_styles_id)
│  ├─ tattoo_styles_id: INT PRIMARY KEY
│  ├─ style_name: VARCHAR(100)
│  └─ description: TEXT
│
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   MENSAJERÍA Y RELACIONES                   │
├─────────────────────────────────────────────────────────────┤
│
│  messages (PK: message_id, FK: sender_id, receiver_id)
│  ├─ message_id: INT PRIMARY KEY AUTO_INCREMENT
│  ├─ sender_id: INT FK → users
│  ├─ receiver_id: INT FK → users
│  ├─ content: TEXT
│  ├─ read: BOOLEAN DEFAULT FALSE
│  ├─ created_at: TIMESTAMP
│  └─ updated_at: TIMESTAMP
│
│  followers (PK: (follower_id, following_id))
│  ├─ follower_id: INT FK → users
│  ├─ following_id: INT FK → users
│  └─ created_at: TIMESTAMP
│
│  appointments (PK: appointment_id)
│  ├─ appointment_id: INT PRIMARY KEY
│  ├─ user_id: INT FK → users
│  ├─ tattoo_artist_id: INT FK → users
│  ├─ appointment_date: DATETIME
│  ├─ description: TEXT
│  └─ status: ENUM('pending', 'confirmed', 'completed', 'cancelled')
│
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                 UBICACIÓN Y REFERENCIAS                     │
├─────────────────────────────────────────────────────────────┤
│
│  country (PK: country_id)
│  ├─ country_id: INT PRIMARY KEY
│  └─ country_name: VARCHAR(100)
│
│     ↓ (1:N)
│
│  cities (PK: city_id, FK: country_id)
│  ├─ city_id: INT PRIMARY KEY
│  ├─ country_id: INT FK → country
│  └─ city_name: VARCHAR(100)
│
│  roles (PK: role_id)
│  ├─ role_id: INT PRIMARY KEY
│  └─ role_name: VARCHAR(50) [e.g., 'admin', 'user', 'artist']
│
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Índices de Optimización

```sql
-- Búsqueda primaria de usuarios
INDEX idx_email_address ON users(email_address)
INDEX idx_user_handle ON users(user_handle)

-- Queries de mensajería
INDEX idx_sender_id_messages ON messages(sender_id)
INDEX idx_receiver_id_messages ON messages(receiver_id)
INDEX idx_created_at_messages ON messages(created_at)

-- Queries de comentarios y likes
INDEX idx_post_id_comments ON comments(post_id)
INDEX idx_post_id_post_likes ON post_likes(post_id)
INDEX idx_user_id_post_likes ON post_likes(user_id)

-- Búsqueda por estilo
INDEX idx_tattoo_styles_posts ON posts(tattoo_styles_id)

-- Búsqueda de seguidores
INDEX idx_follower_id ON followers(follower_id)
INDEX idx_following_id ON followers(following_id)
```

### 5.3 Triggers Automáticos

**Trigger: `after_insert_user`**

```sql
Se dispara: AFTER INSERT en tabla users
Acción:
├─ Crea automáticamente registro en user_settings
├─ Inicializa JSON con configuraciones por defecto
│  └─ allow_notifications: true
│  └─ email_notifications: false
│  └─ private_account: false
│  └─ theme: 'dark'
│  └─ language: 'es'
│  └─ show_last_seen: true
│  └─ allow_messages: true
└─ Se ejecuta sin intervención manual
```

**Trigger: `after_insert_user_profile`**

```sql
Se dispara: AFTER INSERT en tabla users
Acción:
├─ Crea automáticamente registro en profile
├─ Inicializa con valores por defecto
│  ├─ date_of_birth: birth_day del usuario
│  ├─ gender: 'M' (se actualiza después)
│  ├─ country_id: 1 (valor por defecto)
│  ├─ image: URL a imagen por defecto
│  ├─ image_header: NULL
│  ├─ bio: cadena vacía
│  └─ follower_count: 0
└─ Se ejecuta sin intervención manual
```

**Beneficios:**
- Garantiza integridad referencial
- Evita datos inconsistentes
- Automatiza flujos comunes
- Reduce código backend

### 5.4 Funciones SQL

**Función: `get_user_age`**

```sql
DELIMITER //
CREATE FUNCTION get_user_age(user_id_param INT)
RETURNS INT DETERMINISTIC
BEGIN
  DECLARE user_age INT;
  SELECT TIMESTAMPDIFF(YEAR, birth_day, CURDATE())
  INTO user_age
  FROM users
  WHERE user_id = user_id_param;
  RETURN user_age;
END //
DELIMITER ;

Uso: SELECT get_user_age(5) → retorna 24
```

**Función: `getComments`**

```
Propósito: Obtener comentarios de un post con información de usuario
Parámetro: post_id
Retorna: Resultset con comentarios y datos de autor
```

### 5.5 Cardinalidad de Relaciones

```
users          (1) ──── (1) profile
users          (1) ──── (1) user_settings
users          (1) ──── (N) posts
users          (1) ──── (N) images
users          (1) ──── (N) comments
users          (1) ──── (N) messages (sender)
users          (1) ──── (N) messages (receiver)
users          (N) ──┬── (N) users (followers)
                     └─ followers table

posts          (1) ──── (1) tattoo_styles
posts          (1) ──── (N) comments
posts          (1) ──── (N) post_likes
posts          (N) ──── (N) images (via post_image JUNCTION)

country        (1) ──── (N) cities
country        (1) ──── (N) profiles
```

---

## 6. Patrones de Diseño

### 6.1 Patrones Identificados

| Patrón | Ubicación | Propósito |
|--------|-----------|----------|
| **Module Pattern** | `backend/modules/*`, `frontend/features/*` | Encapsulación de lógica por dominio |
| **Repository Pattern** | `*Model.ts` | Abstracción de acceso a datos |
| **Factory Pattern** | `SocketService`, Connection pool | Creación de instancias complejas |
| **Observer Pattern** | Socket.io events | Notificación de cambios en tiempo real |
| **Strategy Pattern** | Validaciones (email, username, phone) | Múltiples algoritmos de validación |
| **Middleware Pattern** | Express middlewares | Pre/post procesamiento de requests |
| **Provider Pattern** | `MessageProvider`, `AuthProvider` | Distribución de estado vía Context |
| **Custom Hooks Pattern** | `useAuth`, `usePosts`, `useMessages` | Reutilización de lógica stateful |
| **Service Locator Pattern** | `axiosConfig`, database pool | Acceso centralizado a servicios |
| **Singleton Pattern** | Zustand store, Socket instance | Instancia única global |

### 6.2 Architectural Paradigm

**Backend:** Modular Monolith
- ✅ Un monolito dividido por dominios empresariales
- ✅ Bajo acoplamiento entre módulos
- ✅ Fácil de escalar a microservicios (sin refactoring mayor)
- ✅ Reutilización de middlewares
- ✅ Deploys simplificados

**Frontend:** Feature-Based Modular
- ✅ Cada feature es un dominio autónomo
- ✅ Posibilidad de lazy loading por feature
- ✅ Reutilización de hooks y utilidades
- ✅ Escalabilidad sin degradación de performance

### 6.3 Principios SOLID

**Single Responsibility:**
- Controllers manejan HTTP, no lógica de BD
- Services contienen reglas de negocio
- Models ejecutan queries

**Open/Closed:**
- Middlewares extensibles sin modificar routes
- Hooks composables para nuevas features

**Liskov Substitution:**
- Interfaces de servicios reemplazables

**Interface Segregation:**
- Tipos específicos por dominio (no mega-types)

**Dependency Inversion:**
- Inyección implícita vía importes
- Frontend depende de interfaces de API

---

## 7. Convenciones y Estándares

### 7.1 Convención de Nombres

```
PascalCase:
├─ Interfaces: IUser, IPost, IAuthResponse
├─ Tipos: UserType, PostType
├─ Clases: AuthService (si las hay)
├─ Componentes React: LoginForm, PostCard, UserProfile
└─ Enums: UserRole, PostStatus

camelCase:
├─ Variables: const user = {...}
├─ Funciones: getUserById(), createPost()
├─ Métodos: user.getAge(), post.addComment()
├─ Propiedades de objeto: { firstName, lastName }
└─ Hooks: useAuth, usePosts, useMessages

UPPER_CASE:
├─ Constantes: const DEFAULT_TIMEOUT = 5000
├─ Variables de entorno: DB_HOST, SECRET_JWT_KEY
└─ Enums de configuración: API_BASE_URL

kebab-case:
├─ Nombre de archivos CSS: auth-form.css
├─ Valores de atributos data: data-test-id
└─ URLs de rutas: /profile/:username
```

### 7.2 Convención de Commits

Formato: `<tipo>(scope): descripción`

```
feat(auth): agregar recuperación de contraseña
fix(posts): corregir cálculo de likes
refactor(messages): extraer lógica de Socket en servicio
style(auth-form): ajustar espaciado de input
docs(architecture): actualizar diagramas
test(user-service): añadir test de bcrypt
chore(deps): actualizar React a v19
perf(feed): optimizar query de posts con índices
ci(github): agregar workflow de tests
```

**Tipos válidos:**
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `refactor`: Reestructuración sin cambiar comportamiento
- `style`: Cambios de formato/espaciado (no lógica)
- `docs`: Documentación
- `test`: Agregar o actualizar tests
- `chore`: Cambios en build, deps, etc.
- `perf`: Mejoras de performance
- `ci`: Cambios en CI/CD

**Scopes comunes:**
`registration`, `auth`, `profile`, `posts`, `messages`, `admin`, `navbar`, `footer`, `db`, `types`, `api`, etc.

### 7.3 TypeScript - Estándares de Código

```typescript
// ✅ CORRECTO - Tipos explícitos
interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user' | 'artist';
}

const getUser = async (id: number): Promise<User> => {
  // ...
};

// ❌ EVITAR - any, tipos implícitos
const getUser = async (id) => {
  const user: any = await fetch(...);
  return user;
};

// ✅ Type Guards
const isAdmin = (user: User): user is Admin => {
  return user.role === 'admin';
};

// ✅ Genéricos
const getPaginatedResults = <T>(items: T[], page: number): T[] => {
  return items.slice((page - 1) * 10, page * 10);
};
```

### 7.4 Organización de Archivos

```
Patrón por módulo/feature:

backend/src/modules/auth/
├── authController.ts          (Handlers HTTP)
├── authRoutes.ts             (Definición de rutas)
├── authService.ts            (Lógica de negocio)
└── types/
    └── auth.types.ts         (Interfaces)

frontend/src/features/auth/
├── index.ts                  (Re-exports públicos)
├── components/
│   ├── AuthForm.tsx
│   └── index.ts
├── api/
│   └── authApi.ts
├── hooks/
│   ├── useAuth.ts
│   └── index.ts
├── types/
│   └── auth.types.ts
├── validation/
│   └── authValidation.ts
├── context/
│   └── AuthProvider.tsx
└── styles/
    └── auth.css
```

### 7.5 ESLint y Formateo

**Backend ESLint:**
- Base: `@eslint/js` recommended
- Globals: browser + node
- Parser: ES2020+
- Regla de punto y coma: required
- Comillas: single quotes

**Frontend ESLint:**
- Base: eslint + react + react-hooks + react-refresh
- React version: 19.0
- Reglas extra:
  - `jsx-no-target-blank: off`
  - `react-refresh/only-export-components: warn`

**Formateo General:**
- Indentación: 2 espacios
- Line length: no enforcement estricto
- Trailing comma: es5 compatible
- Semicolons: requerido

---

## 8. Seguridad

### 8.1 Implementaciones Actuales

```
✅ Autenticación JWT
   ├─ Access tokens: 1 hora de expiración
   ├─ Refresh tokens: 7 días de expiración
   └─ Almacenamiento: HTTP-only cookies

✅ Encriptación de Contraseñas
   ├─ Algoritmo: bcrypt
   ├─ Salt rounds: 10 (comentario sugiere mejorar a 13)
   └─ Verificación: bcrypt.compareSync()

✅ CORS Configurado
   ├─ Origen: ORIGIN_URL desde .env
   ├─ Métodos: GET, POST, PUT, DELETE, OPTIONS
   ├─ Credenciales: permitidas (withCredentials: true)
   └─ maxAge: 600 segundos

✅ Prepared Statements
   ├─ Placeholders: ? en queries
   ├─ Parámetros: pasados por separado
   └─ Protección: contra SQL injection

✅ Type Safety
   ├─ TypeScript en 100% del código
   ├─ Eliminación de `any` requerida
   └─ Validación en tiempo de compilación

✅ Validación en Dos Capas
   ├─ Frontend: esquemas Zod
   ├─ Backend: validación servidor-side
   └─ Nunca confiar solo en frontend
```

### 8.2 Vulnerabilidades Conocidas y Recomendaciones

```
⚠️ Rate Limiting NO implementado
   Solución: Expresar rate-limit middleware
   Impacto: ALTO - previene ataques de fuerza bruta

⚠️ HTTPS solo en producción
   Solución: Configurar servidor HTTPS + Strict-Transport-Security
   Impacto: CRÍTICO - previene man-in-the-middle

⚠️ CSP (Content Security Policy) no mencionado
   Solución: Agregar header CSP en Express
   Impacto: MEDIO - previene XSS

⚠️ Helmet.js no implementado
   Solución: app.use(helmet()) en Express
   Impacto: MEDIO - protecciones varias (X-Frame-Options, etc.)

⚠️ Validación de file uploads no documentada
   Solución: Validar tipo de archivo, tamaño máximo
   Impacto: MEDIO - previene subidas maliciosas

⚠️ Logging de seguridad básico
   Solución: Implementar logging centralizado de eventos
   Impacto: BAJO - trazabilidad en incidentes

⚠️ CSRF Protection (token-based)
   Nota: Parcialmente mitigado con HTTP-only cookies + SameSite
   Solución: Agregar double-submit cookies si es necesario
   Impacto: MEDIO
```

---

## 9. Flujos Principales

### 9.1 Flujo de Autenticación (Login)

```
Usuario entra a /login
     ↓
Componente AuthForm (React)
├─ Carga useAuth hook
├─ Estado: { user_handle, password_hash, errors }
     ↓
Usuario completa credenciales
├─ onChange valida campos localmente con Zod
├─ onBlur muestra errores inline
     ↓
Usuario hace submit
├─ validateField verifica contra esquema LoginSchema
├─ Si errores: muestra mensaje
├─ Si válido: performLogin() → API
     ↓
performLogin(credentials):
├─ POST /api/auth/login
├─ Body: { user_handle, password_hash }
├─ Backend: verifyToken middleware (skip en login)
     ↓
Backend Login Handler:
├─ getUserByUserHandle(user_handle)
├─ bcrypt.compareSync(input_password, hash_bd)
├─ Si falla: response { validation: false }
├─ Si válido:
│  ├─ Genera Access Token (1h)
│  ├─ Genera Refresh Token (7d)
│  ├─ Envía ambos como cookies HTTP-only
│  └─ Response: { validation: true, user_data }
     ↓
Frontend recibe respuesta:
├─ Si validation: true
│  ├─ useAuthStore.login(user_data)
│  ├─ Actualiza Zustand store
│  ├─ Persiste en localStorage
│  └─ navigate("/")
├─ Si validation: false
│  └─ Muestra error "Credenciales inválidas"
     ↓
FIN - Usuario autenticado
└─ Cookies incluidas automáticamente en futuras requests
```

### 9.2 Flujo de Registro (3 Pasos)

```
Usuario entra a /register
     ↓
StepsRegister Component
├─ currentStep: 1 | 2 | 3

STEP 1 - Datos personales:
├─ first_name (3-30 chars)
├─ last_name (3-30 chars)
├─ email_address (validar formato)
     ↓
Validación onBlur con SignupStepOneSchema:
├─ Si errores: muestra tooltip
├─ Si válido: habilita botón Next
     ↓
Click Next → setCurrentStep(2)

STEP 2 - Credenciales:
├─ phonenumber
│  └─ Validación COL: ^3[0-9]{9}$
├─ user_handle (3-30, unique en BD)
│  └─ API call: nameValidation() backend
├─ password_hash (6-30, char especiales opcionales)
     ↓
Validación SignupStepTwoSchema
├─ Validación real-time de uniqueness
├─ Si user_handle disponible: check verde
     ↓
Click Next → setCurrentStep(3)

STEP 3 - Verificación de edad:
├─ birth_day: DATE picker
     ↓
Validación SignupStepThreeSchema (superRefine):
├─ Calcula edad: new Date().getFullYear() - birth_day.getFullYear()
├─ Si edad < 13: error "Debes tener al menos 13 años"
├─ Si válido: habilita botón Create Account
     ↓
Click Create Account:
├─ POST /api/users (o /api/auth/register)
├─ Body: { first_name, last_name, email, phonenumber, user_handle, password_hash, birth_date }
     ↓
Backend createUser Handler:
├─ Valida inputs nuevamente
├─ bcrypt.hash(password, 10 salt rounds)
├─ INSERT INTO users (...)
├─ Triggers automáticos:
│  ├─ INSERT INTO user_settings (defaults)
│  └─ INSERT INTO profile (defaults)
├─ Response: { success: true, user_id }
     ↓
Frontend recibe:
├─ Si success: true
│  ├─ Muestra confirmación "Registro exitoso"
│  ├─ navigate("/login")
│  └─ Mensaje: "Ahora inicia sesión con tus credenciales"
├─ Si error: muestra mensaje (email ya existe, username duplicado, etc.)

FIN - Usuario listo para login
```

### 9.3 Flujo de Mensajería Real-time

```
Usuario A abre /messages
     ↓
Componente Messages:
├─ useMessages hook
├─ useSocket hook
     ↓
useSocket hook:
├─ Conecta a Socket.io: io(API_URL, { auth: { token: access_token } })
├─ Socket middleware verifica JWT
├─ Si válido: resuelve conexión
├─ Si inválido: socket.disconnect()
     ↓
useMessages:
├─ Fetch GET /api/messages
├─ Obtiene lista de conversaciones previas
├─ setState: conversationList
     ↓
Usuario A selecciona conversación con Usuario B:
├─ socket.emit('join_conversation', { 
│    userId_a: 123,
│    userId_b: 456
│  })
     ↓
Backend recibe join_conversation:
├─ Calcula roomId: Math.min(123, 456) + Math.max(...)
├─ socket.join(roomId)
├─ Emite a sala: 'user_joined'
     ↓
Usuario A escribe mensaje:
├─ socket.emit('start_typing', { receiver_id: 456 })
     ↓
Backend emite a roomId:
├─ io.to(roomId).emit('user_typing', { sender: 123, isTyping: true })
     ↓
Usuario B recibe notificación:
├─ ChatWindow muestra: "Usuario A está escribiendo..."
     ↓
Usuario A para escribir (sin enviar):
├─ Después de 3 segundos: socket.emit('stop_typing')
     ↓
Backend emite:
├─ io.to(roomId).emit('user_typing', { sender: 123, isTyping: false })
     ↓
Usuario A envía mensaje:
├─ socket.emit('send_message', {
│    receiver_id: 456,
│    content: "Hola, ¿cómo estás?"
│  })
     ↓
Backend recibe send_message:
├─ Valida contenido (no vacío)
├─ INSERT INTO messages (sender_id, receiver_id, content, ...)
├─ Emite a roomId: 'new_message' con datos persistidos
├─ Socket.io transmite binario (eficiente)
     ↓
Usuario B recibe new_message:
├─ useMessages hook escucha evento
├─ Agrega mensaje a conversationList
├─ ChatWindow re-renderiza con nuevo mensaje
├─ Automáticamente scrollea a último mensaje
     ↓
Flujo completo:
Este proceso se repite bidireccionalmentebetween Usuario A y B
├─ Latencia: <500ms típicamente
├─ Fallback: REST API si Socket.io desconecta
└─ Persistencia: Todos los mensajes en BD

FIN - Conversación en tiempo real activa
```

### 9.4 Flujo de Posts

```
Usuario A abre /
     ↓
Explore Component:
├─ usePosts hook
├─ useState: { posts, loading, error, selectedStyle }
     ↓
useEffect (load posts):
├─ GET /api/posts?style_id=optional
├─ Si es primer load: loading = true
├─ Fetch completa parseada como Post[]
├─ setState: posts
     ↓
PostGrid Component:
├─ Renderiza PostCard para cada post
├─ Muestra imagen principal, autor, descripción, likes

Usuario A hace click en post:
     ↓
PostModal abre:
├─ Muestra todas las imágenes (carousel)
├─ Información del usuario autor
├─ Botón de Like
├─ Comentarios
     ↓
Usuario A hace click Like:
├─ POST /api/posts/:postId/like
├─ Backend: INSERT INTO post_likes
├─ Response: { likeCount: newCount }
├─ Frontend actualiza UI optimisticamente
├─ Si falla: reversión y error message
     ↓
Usuario A escribe comentario:
├─ Input local con estado
├─ Click Submit → POST /api/posts/:postId/comments
├─ Backend: INSERT INTO comments
├─ Response: { commentId, content, author, timestamp }
├─ Frontend agrega comentario a lista local (optimistic update)
     ↓
Usuario A crea nuevo post:
├─ /posts/create abre PostForm modal
├─ Selecciona imágenes (drag & drop)
├─ Escribe descripción
├─ Selecciona estilo de tatuaje
     ↓
Click Create Post:
├─ Compilar FormData con imágenes + metadata
├─ POST /api/posts
├─ multipart/form-data encoding
     ↓
Backend recibe:
├─ INSERT INTO posts (user_id, description, tattoo_styles_id)
├─ Para cada imagen:
│  ├─ Guarda archivo o URL
│  ├─ INSERT INTO image
│  ├─ INSERT INTO post_image (junction)
├─ Response: { postId, post_data }
     ↓
Frontend:
├─ Muestra confirmación "Post creado"
├─ Agrega post a principio de feed
├─ Cierra PostForm modal
├─ Usuario ve su nuevo post inmediatamente
     ↓
Filtrado por estilo:
├─ Usuario selecciona estilo desde dropdown
├─ GET /api/posts?style_id=5
├─ Backend: WHERE tattoo_styles_id = 5
├─ Frontend reemplaza posts con resultados filtrados

FIN - Flujo de posts completo
```

---

## 10. Arquitectura Recomendada para Escalabilidad

A medida que el proyecto crece en usuarios, volumen de datos y complejidad funcional, se recomienda una evolución arquitectónica que mantenga la escalabilidad, confiabilidad y mantenibilidad. Esta sección propone la roadmap técnica para los próximos 12-24 meses.

### 10.1 Microservicios

**Motivación:** Separar responsabilidades en servicios independientes permite escalar cada componente según su demanda.

```
Actual (Monolito):
┌──────────────────────────────┐
│     Express Monolith         │
├──────────────────────────────┤
│ auth + users + posts +       │
│ messages + admin + ...       │
│ (TODO en puerto 3000)        │
└──────────────────────────────┘
         ↓
         1 BD

Propuesto (Microservicios):
┌─────────────────────────────────────────────────────┐
│          API Gateway (Kong / AWS ALB)               │
├─────────────────────────────────────────────────────┤
│ Routing • Load Balancing • Auth Centralizada         │
└──────────┬──────────────┬──────────────┬────────────┘
           ↓              ↓              ↓
      ┌─────────┐   ┌─────────┐   ┌──────────┐
      │ Auth    │   │ Posts   │   │ Messages │
      │Service  │   │Service  │   │Service   │
      │:3001    │   │:3002    │   │:3003     │
      └────┬────┘   └────┬────┘   └────┬─────┘
           │             │             │
      ┌────┴─────────────┴─────────────┴────┐
      │      Shared PostgreSQL (RDS)        │
      │  (En lugar de MySQL para escala)    │
      ├─────────────────────────────────────┤
      │ Schemas:                            │
      │ ├─ auth_db                          │
      │ ├─ posts_db                         │
      │ ├─ messages_db                      │
      │ └─ shared_db (users reference)      │
      └─────────────────────────────────────┘

Beneficios:
├─ Escalar auth independientemente de posts
├─ Cambiar BD por servicio si es necesario
├─ Deployments independientes
└─ Fallos aislados (fault isolation)
```

**Servicios Propuestos:**

1. **Auth Service (puerto 3001)**
   - `POST /auth/login`
   - `POST /auth/refresh`
   - `POST /auth/logout`
   - `POST /auth/register`
   - BD: auth_db (usuarios, roles)

2. **Posts Service (puerto 3002)**
   - `GET /posts`
   - `POST /posts`
   - `DELETE /posts/:id`
   - `POST /posts/:id/like`
   - `POST /posts/:id/comments`
   - BD: posts_db (posts, comments, images)

3. **Messages Service (puerto 3003)**
   - `GET /messages`
   - `POST /messages`
   - Socket.io (mensajería real-time)
   - BD: messages_db

4. **User Service (puerto 3004)**
   - `GET /users/:id`
   - `PUT /users/:id`
   - `GET /users/search`
   - BD: shared_db (profiles, followers)

5. **Admin Service (puerto 3005)**
   - `GET /admin/*`
   - `POST /admin/users`
   - BD: shared_db (acceso)

### 10.2 Containerización con Docker

```yaml
# docker-compose.yml para Development

version: '3.8'
services:
  # API Gateway
  api-gateway:
    image: kong:latest
    environment:
      KONG_DATABASE: postgres
      KONG_PG_HOST: postgres
    ports:
      - "8000:8000"         # API
      - "8443:8443"         # HTTPS
    depends_on:
      - postgres

  # Auth Microservice
  auth-service:
    build:
      context: ./backend
      dockerfile: Dockerfile.auth
    environment:
      NODE_ENV: production
      DB_HOST: postgres
      PORT: 3001
    ports:
      - "3001:3001"
    depends_on:
      - postgres
    restart: unless-stopped

  # Posts Microservice
  posts-service:
    build:
      context: ./backend
      dockerfile: Dockerfile.posts
    environment:
      NODE_ENV: production
      DB_HOST: postgres
      PORT: 3002
    ports:
      - "3002:3002"
    depends_on:
      - postgres
    restart: unless-stopped

  # Messages Microservice (con Socket.io)
  messages-service:
    build:
      context: ./backend
      dockerfile: Dockerfile.messages
    environment:
      NODE_ENV: production
      DB_HOST: postgres
      PORT: 3003
      REDIS_URL: redis://redis:6379
    ports:
      - "3003:3003"
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  # PostgreSQL (reemplaza MySQL)
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: tatu_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: tatu_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./db/migrations:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"

  # Redis (para caché y sesiones)
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

**Dockerfile para cada servicio:**

```dockerfile
# Dockerfile.auth

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN pnpm install --prod

COPY src ./src
COPY tsconfig.json .

RUN pnpm build

EXPOSE 3001

CMD ["node", "dist/index.js"]
```

### 10.3 Orquestación con Kubernetes (Producción)

```yaml
# kubernetes/auth-service-deployment.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
  labels:
    app: tatu-auth
spec:
  replicas: 3                    # 3 instancias para alta disponibilidad
  selector:
    matchLabels:
      app: tatu-auth
  template:
    metadata:
      labels:
        app: tatu-auth
    spec:
      containers:
      - name: auth-service
        image: gcr.io/tatu-project/auth-service:latest
        ports:
        - containerPort: 3001
        env:
        - name: DB_HOST
          valueFrom:
            secretKeyRef:
              name: database-secrets
              key: host
        - name: NODE_ENV
          value: "production"
        resources:
          requests:
            memory: "256Mi"       # Mínimo
            cpu: "250m"
          limits:
            memory: "512Mi"       # Máximo
            cpu: "500m"
        livenessProbe:            # Restart si no responde
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 10
          periodSeconds: 10
        readinessProbe:           # Espera antes de enviar tráfico
          httpGet:
            path: /ready
            port: 3001
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: auth-service
spec:
  selector:
    app: tatu-auth
  ports:
  - protocol: TCP
    port: 80                      # Externo
    targetPort: 3001              # Interno
  type: ClusterIP                 # Solo acceso interno
```

### 10.4 Redis Cache

```typescript
// Propuesto: Caché de posts en Redis

import redis from 'redis';

const redisClient = redis.createClient({
  host: REDIS_URL,
  port: 6379,
});

// En PostService:
export const getPostsWithCache = async (
  style_id?: number,
): Promise<Post[]> => {
  const cacheKey = `posts:style:${style_id || 'all'}`;
  
  // Intentar obtener del caché
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Miss en caché: query BD
  const posts = await queryPostsFromDB(style_id);
  
  // Guardar en caché por 5 minutos
  await redisClient.setEx(cacheKey, 300, JSON.stringify(posts));
  
  return posts;
};

// Invalidación de caché al crear post:
export const createPostAndInvalidateCache = async (data) => {
  const post = await insertPostToDB(data);
  
  // Limpiar todos los cachés de posts
  const keys = await redisClient.keys('posts:*');
  if (keys.length > 0) {
    await redisClient.del(keys);
  }
  
  return post;
};
```

**Beneficios:**
- ✅ Reduce latencia de lectura: < 100ms vs > 500ms en BD
- ✅ Disminuye carga en base de datos
- ✅ Escalabilidad horizontal: agregar servidores Redis

### 10.5 CDN para Contenido Estático

```typescript
// Propuesto: Servir imágenes desde CloudFront / Cloudflare

// En frontend, reemplazar URLs de imágenes:
const CDN_URL = 'https://cdn.tatu.com/images';

// Antes:
<img src={`http://localhost:3000/uploads/${imageId}`} />

// Después:
<img src={`${CDN_URL}/${imageId}`} />

// En backend, servir desde S3:
const uploadImage = async (file, userId) => {
  const s3Key = `users/${userId}/${Date.now()}-${file.originalname}`;
  
  await s3.upload({
    Bucket: 'tatu-images',
    Key: s3Key,
    Body: file.buffer,
    ContentType: file.mimetype,
    CacheControl: 'max-age=31536000',  // 1 año
  }).promise();
  
  // Retornar URL CloudFront
  return `${CDN_URL}/${s3Key}`;
};
```

**Flujo:**
```
Frontend solicita imagen
  ↓
CloudFront cache (< 100ms)
  ↓
Si miss: S3 origin (< 500ms)
  ↓
Caché en navegador 1 año
  ↓
Reducción de 90% en requests a backend
```

### 10.6 API Gateway (Kong / AWS ALB)

```yaml
# Kong Configuration (kong.yml)

_format_version: "3.0"

services:
  - name: auth-api
    url: http://auth-service:3001
    routes:
      - name: auth-login
        paths:
          - /api/auth/login
          - /api/auth/refresh
          - /api/auth/logout
    plugins:
      - name: rate-limiting
        config:
          minute: 10              # 10 requests/minuto
          hour: 100
      - name: request-transformer
        config:
          add:
            headers:
              - X-Service: auth

  - name: posts-api
    url: http://posts-service:3002
    routes:
      - name: posts
        paths:
          - /api/posts
    plugins:
      - name: rate-limiting
        config:
          minute: 30
      - name: cors
        config:
          origins:
            - https://tatu.com
            - https://www.tatu.com

  - name: messages-api
    url: http://messages-service:3003
    routes:
      - name: messages
        paths:
          - /api/messages
        protocols:
          - http
          - ws
          - wss
    plugins:
      - name: request-transformer
        config:
          add:
            headers:
              - X-Service: messages

plugins:
  - name: jwt
    config:
      key_claim_name: "iss"
      algorithm: "HS256"
  - name: key-auth
    config:
      key_names:
        - apikey
  - name: cors
    config:
      origins: ["*"]
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
      headers: ["Content-Type", "Authorization"]
      credentials: true
```

**Beneficios:**
- ✅ Rate limiting centralizado
- ✅ Routing inteligente
- ✅ Autenticación en un lugar
- ✅ Fácil agregar/quitar servicios

### 10.7 Message Queue (RabbitMQ)

Para tareas asincrónicas (emails, notificaciones):

```typescript
// Propuesto: Notificaciones con RabbitMQ

import amqp from 'amqplib/callback_api';

export const publishEvent = async (
  exchange: string,
  routingKey: string,
  data: any,
) => {
  amqp.connect(`amqp://${RABBITMQ_URL}`, (err, conn) => {
    if (err) throw err;
    
    conn.createChannel((err, ch) => {
      if (err) throw err;
      
      ch.assertExchange(exchange, 'topic', { durable: true });
      
      ch.publish(
        exchange,
        routingKey,
        Buffer.from(JSON.stringify(data)),
      );
    });
  });
};

// En PostService, cuando se crea un post:
await publishEvent('tatu_events', 'post.created', {
  postId: post.id,
  userId: post.user_id,
  description: post.description,
});

// En NotificationService (consumidor separado):
ch.assertQueue('notifications', { durable: true });
ch.bindQueue('notifications', 'tatu_events', 'post.#');

ch.consume('notifications', (msg) => {
  const event = JSON.parse(msg.content.toString());
  
  if (event.type === 'post.created') {
    // Enviar email a followers
    // Crear notificación push
    // etc.
  }
});
```

### 10.8 Monitoreo y Observabilidad

```yaml
# docker-compose.yml - Monitoring Stack

  # Prometheus (métricas)
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'

  # Grafana (visualización)
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin
    depends_on:
      - prometheus

  # ELK - Elasticsearch (logs)
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.0.0
    environment:
      discovery.type: single-node
      xpack.security.enabled: false
    ports:
      - "9200:9200"

  # Kibana (visualización de logs)
  kibana:
    image: docker.elastic.co/kibana/kibana:8.0.0
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch
```

**En Backend, agregar instrumentación:**

```typescript
import prometheus from 'prom-client';

// Métricas
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
});

const loginAttempts = new prometheus.Counter({
  name: 'login_attempts_total',
  help: 'Total number of login attempts',
  labelNames: ['success'],
});

// Middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration
      .labels(req.method, req.route?.path || 'unknown', res.statusCode)
      .observe(duration);
  });
  
  next();
});

// Endpoint de métricas
app.get('/metrics', (req, res) => {
  res.set('Content-Type', prometheus.register.contentType);
  res.end(prometheus.register.metrics());
});
```

---

## 11. Conclusión y Roadmap

### 11.1 Resumen de Fortalezas Actuales

El proyecto Tatu posee una base sólida y bien estructurada:

✅ **Arquitectura Modular:**
- Separación clara backend/frontend/database
- Módulos independientes reutilizables
- Bajo acoplamiento entre componentes

✅ **Type Safety Completo:**
- TypeScript en 100% del código
- Validación en compilación y runtime
- Interfaces bien definidas

✅ **Autenticación Robusta:**
- JWT con refresh tokens
- HTTP-only cookies contra XSS
- Autorización por rol

✅ **Real-time Capabilities:**
- Socket.io implementado correctamente
- Eventos bidireccionales eficientes
- Fallback REST API

✅ **Documentación y Estándares:**
- Convenciones de nombres claras
- ESLint enforcement
- Convenciones de commits

### 11.2 Áreas de Mejora Identificadas

⚠️ **Testing:**
- No se menciona cobertura de tests
- Agregar Jest + testing-library

⚠️ **Rate Limiting:**
- No implementado en ningún endpoint
- Vulnerabilidad a ataques de fuerza bruta

⚠️ **Logging Estructurado:**
- Logs básicos
- Migrar a pino o winston

⚠️ **Error Handling:**
- Centralizado pero sin clasificación
- Agregar error middleware específico

⚠️ **CI/CD:**
- Pipelines de automatización necesarios
- GitHub Actions recomendado

### 11.3 Roadmap Propuesto (12-24 meses)

**Q1 2026 - Estabilización:**
- Agregar suite de tests (80%+ cobertura)
- Rate limiting en endpoints críticos
- Logging centralizado con ELK

**Q2 2026 - Performance:**
- Implementar Redis cache para posts
- CDN para imágenes
- Optimización de queries SQL

**Q3 2026 - Escalabilidad:**
- Separar en microservicios (auth, posts, messages)
- Containerización con Docker
- API Gateway (Kong)

**Q4 2026 - Producción:**
- Kubernetes deployment
- Monitoreo con Prometheus + Grafana
- Disaster recovery plan

**2027 - Crecimiento:**
- Mensajería asincrónica (RabbitMQ)
- Replicación BD (Master-Slave)
- Multi-región deployment

---

## 12. Referencias y Documentación Adicional

- **Backend:** [code](backend/src)
- **Frontend:** [code](frontend/src)
- **Database:** [scripts](db)
- **Documentación:** [DOCUMENTACION.md](DOCUMENTACION.md)
- **Commits:** [COMMIT_CONVENTION.md](COMMIT_CONVENTION.md)

---

**Documento preparado para desarrolladores, arquitectos y stakeholders técnicos. Última actualización: 7 de febrero de 2026.**
