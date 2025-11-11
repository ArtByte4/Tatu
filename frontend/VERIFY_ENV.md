# Verificación de Variables de Entorno - ImageKit

## Problema Detectado

El error 403 "Your account cannot be authenticated" indica que la variable `VITE_PRIVATE_KEY_IMAGEKIT` no está siendo cargada correctamente.

## Solución

### 1. Crear archivo .env o .env.local

Crea uno de estos archivos en el directorio `frontend/`:
- `.env` (para todos los entornos)
- `.env.local` (solo para tu máquina local, tiene prioridad sobre .env)

### 2. Agregar la variable requerida

Copia el contenido de `.env.example` y completa los valores:

```env
VITE_API_URL=http://localhost:3000

VITE_PUBLIC_KEY_IMAGEKIT=tu_public_key_aqui
VITE_PRIVATE_KEY_IMAGEKIT=tu_private_key_aqui

VITE_ID_ROL_ADMIN=3
```

### 3. Verificaciones importantes

- ✅ La variable **DEBE** tener el prefijo `VITE_` (requerido por Vite)
- ✅ El valor **NO** debe tener comillas alrededor
- ✅ El valor **NO** debe tener espacios antes o después del `=`
- ✅ El archivo debe estar en `frontend/.env` o `frontend/.env.local`

### 4. Reiniciar el servidor

**IMPORTANTE**: Después de crear o modificar el archivo `.env`, debes:
1. Detener el servidor de desarrollo (Ctrl+C)
2. Reiniciarlo con `pnpm run dev` o `npm run dev`

Vite solo carga las variables de entorno al iniciar, no las recarga automáticamente.

### 5. Verificar que funciona

Al intentar subir una imagen, en la consola del navegador deberías ver:
```
🔑 Validación de autenticación ImageKit: {
  hasPrivateKey: true,
  privateKeyLength: [número mayor a 0],
  encodedKeyLength: [número mayor a 20],
  isValidLength: true
}
```

Si `hasPrivateKey` es `false` o `privateKeyLength` es `0`, la variable no se está cargando correctamente.

## Ubicación de las credenciales

Las credenciales de ImageKit se obtienen de:
1. Dashboard de ImageKit: https://imagekit.io/dashboard
2. Settings → API Keys
3. Necesitas la "Private API Key"


