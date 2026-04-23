# Prueba Unitaria para useSearch Hook

## Descripción General

Esta es una prueba unitaria completa para el hook `useSearch` que se encarga de manejar la lógica de búsqueda de usuarios en la aplicación. La prueba está escrita usando **Vitest** y **React Testing Library**.

## ¿Qué es una Prueba Unitaria?

Una prueba unitaria es una verificación automatizada que comprueba que una pequeña parte del código (en este caso, un hook de React) funciona correctamente en aislamiento. Es como hacer preguntas específicas a tu código:
- ¿Se inicializa correctamente?
- ¿Maneja errores?
- ¿Actualiza el estado como se espera?

## Componentes de la Prueba

### 1. **Importaciones**
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
```

- `describe`: Agrupa las pruebas relacionadas
- `it`: Define una prueba individual
- `expect`: Verifica si algo es verdad
- `vi`: Crea mocks (simulaciones) de funciones
- `renderHook`: Ejecuta un hook de React en un ambiente de prueba
- `act`, `waitFor`: Utilitarios para manejar efectos asincronos

### 2. **Mock de la API**
```typescript
vi.mock('../api/searchApi', () => ({
  searchUsers: vi.fn()
}));
```

Esto **simula** la función `searchUsers` para que podamos controlar completamente qué datos devuelve, sin necesidad de hacer peticiones reales al backend. Es como tener un doble de riesgo en cine.

### 3. **beforeEach**
```typescript
beforeEach(() => {
  vi.clearAllMocks();
});
```

Se ejecuta antes de cada prueba para limpiar los mocks y evitar interferencias entre pruebas.

## Las Pruebas Explicadas

### Prueba 1: Inicialización
```typescript
it('debe inicializar con valores por defecto', () => {
  const { result } = renderHook(() => useSearch());

  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBeNull();
  expect(result.current.searchResults).toEqual([]);
});
```

**¿Qué verifica?**
- Cuando se crea el hook, `loading` debe ser `false`
- `error` debe ser `null`
- `searchResults` debe ser un array vacío `[]`

**¿Por qué es importante?**
Asegura que el hook se inicializa en un estado correcto.

---

### Prueba 2: Búsqueda Exitosa
```typescript
it('debe actualizar los resultados cuando se busca con un término válido', async () => {
  const mockResults = [
    {
      username: 'prueba',
      first_name: 'Prueba',
      last_name: 'Usuario',
      email_address: 'prueba@gmail.com',
      image: 'https://example.com/image.jpg'
    }
  ];

  vi.mocked(searchApi.searchUsers).mockResolvedValue(mockResults);

  const { result } = renderHook(() => useSearch());

  await act(async () => {
    await result.current.searchForUsers('prueba');
  });

  await waitFor(() => {
    expect(result.current.searchResults).toEqual(mockResults);
  });
});
```

**¿Qué verifica?**
1. Se crea un resultado simulado
2. Se configura el mock para devolver ese resultado
3. Se ejecuta la búsqueda
4. Se verifica que `searchResults` ahora contiene los datos

**¿Por qué es importante?**
Asegura que cuando la búsqueda funciona, los resultados se actualizan correctamente.

---

### Prueba 3: Término Vacío
```typescript
it('debe limpiar los resultados cuando el término de búsqueda está vacío', async () => {
  const { result } = renderHook(() => useSearch());

  await act(async () => {
    await result.current.searchForUsers('');
  });

  expect(result.current.searchResults).toEqual([]);
});
```

**¿Qué verifica?**
Si intentas buscar con un string vacío, no se hacen peticiones y los resultados se limpian.

---

### Prueba 4: Manejo de Errores
```typescript
it('debe mostrar error cuando la búsqueda falla', async () => {
  vi.mocked(searchApi.searchUsers).mockRejectedValue(new Error('Error en la búsqueda'));

  const { result } = renderHook(() => useSearch());

  await act(async () => {
    await result.current.searchForUsers('prueba');
  });

  await waitFor(() => {
    expect(result.current.error).toBe('Error al buscar usuarios. Por favor, intenta de nuevo.');
    expect(result.current.searchResults).toEqual([]);
  });
});
```

**¿Qué verifica?**
Cuando la API falla, el hook:
- Captura el error
- Muestra un mensaje amigable al usuario
- Limpia los resultados

**¿Por qué es importante?**
Asegura una experiencia de usuario robusta incluso cuando algo falla.

---

### Prueba 5: Error 401 (Autenticación)
```typescript
it('debe manejar error 401 de autenticación', async () => {
  const mockError = {
    response: { status: 401 }
  };
  vi.mocked(searchApi.searchUsers).mockRejectedValue(mockError);

  const { result } = renderHook(() => useSearch());

  await act(async () => {
    await result.current.searchForUsers('prueba');
  });

  await waitFor(() => {
    expect(result.current.error).toContain('Sesión expirada');
  });
});
```

**¿Qué verifica?**
Cuando la sesión expira (error 401), el hook muestra un mensaje específico sobre la sesión.

---

### Prueba 6: Estado de Carga
```typescript
it('debe establecer loading en true mientras se busca', async () => {
  vi.mocked(searchApi.searchUsers).mockImplementation(
    () => new Promise(resolve => setTimeout(() => resolve([]), 100))
  );

  const { result } = renderHook(() => useSearch());

  act(() => {
    result.current.searchForUsers('prueba');
  });

  expect(result.current.loading).toBe(true);

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });
});
```

**¿Qué verifica?**
- Mientras se busca, `loading` es `true`
- Cuando termina, `loading` es `false`

**¿Por qué es importante?**
Verifica que la UI puede mostrar un spinner de carga mientras se busca.

## ¿Cómo Ejecutar las Pruebas?

Una vez que instales las dependencias, ejecuta:

```bash
# Ejecutar todas las pruebas
pnpm test

# Ejecutar pruebas en modo watch (se re-ejecutan al cambiar el código)
pnpm test -- --watch

# Ver resultados en interfaz gráfica
pnpm test:ui

# Generar reporte de cobertura
pnpm test:coverage
```

## Instalación de Dependencias

```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

## Estructura de Archivos

```
frontend/
├── src/
│   ├── features/search/
│   │   └── hooks/
│   │       ├── useSearch.ts (archivo original)
│   │       └── useSearch.test.ts (prueba unitaria)
│   └── test/
│       └── setup.ts (configuración de pruebas)
├── vitest.config.ts (configuración de Vitest)
└── package.json (actualizado con scripts de test)
```

## Conceptos Clave

### Mock (Simulación)
Crear una versión fake de una función para controlar su comportamiento:
```typescript
vi.mocked(searchApi.searchUsers).mockResolvedValue([...])
```

### act()
Envuelve actualización de estado para que React las procese:
```typescript
await act(async () => {
  await result.current.searchForUsers('prueba');
});
```

### waitFor()
Espera hasta que una condición sea verdadera:
```typescript
await waitFor(() => {
  expect(result.current.searchResults).toEqual(mockResults);
});
```

## Beneficios de las Pruebas Unitarias

✅ **Detección de errores temprana**: Los errores se encuentran rápido
✅ **Refactorización segura**: Puedes cambiar el código sin miedo
✅ **Documentación viva**: Las pruebas muestran cómo se espera que funcione el código
✅ **Confianza**: Sabes que tu código funciona en diferentes escenarios
✅ **Ahorro de tiempo**: Automatizar pruebas es más rápido que hacerlas manualmente

## Próximos Pasos

1. Instala las dependencias
2. Ejecuta las pruebas: `pnpm test`
3. Veras un reporte mostrando si todas las pruebas pasaron ✓
4. Puedes crear más pruebas para otros componentes y hooks

---

**¿Preguntas?** Las pruebas unitarias son una habilidad crucial en desarrollo moderno. ¡Practica creando más pruebas!
