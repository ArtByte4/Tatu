
# 🧾 Convención de Commits

Esta convención asegura que todos los desarrolladores sigan un estilo profesional, consistente y fácil de mantener a lo largo del proyecto.

---

## 📌 Formato base

<tipo>(scope): mensaje corto en presente

---

## 🎯 Tipos de commit

| Tipo       | Uso                                                   |
|------------|--------------------------------------------------------|
| feat       | Nueva funcionalidad o componente                      |
| fix        | Corrección de errores                                 |
| refactor   | Cambio de código sin afectar comportamiento           |
| style      | Cambios de formato (espacios, comillas, etc.)         |
| docs       | Cambios en documentación                              |
| test       | Agregar o corregir pruebas                            |
| chore      | Tareas menores (scripts, dependencias, config)        |
| perf       | Mejora de rendimiento                                 |
| ci         | Cambios en configuración de integración continua      |

---

## 🏷️ Scope (área o módulo afectado)

El `scope` indica la parte del sistema afectada por el commit.

Ejemplos de scopes en este proyecto:

- registration
- auth
- profile
- steps
- navbar
- vite-config
- components
- styles

---

## ✅ Reglas generales

- Usa tiempo presente e infinitivo (crear, corregir, agregar…)
- No inicies el mensaje con mayúscula
- No uses punto final (`.`)
- Haz commits pequeños, enfocados y significativos
- Usa `scope` siempre que sea posible

---

## 📦 Ejemplos válidos

 - feat(auth): agregar validación de correo 
 - fix(registration): corregir error en el paso dos 
 - refactor(profile): simplificar lógica del formulario s
 - tyle(navbar): aplicar estilos responsivos 
 - docs: actualizar README con pasos de instalación 
 - chore: actualizar dependencias del proyecto


---

> Siguiendo esta convención, los commits serán más claros, mantenibles y fáciles de revisar por cualquier miembro del equipo o colaborador externo.
