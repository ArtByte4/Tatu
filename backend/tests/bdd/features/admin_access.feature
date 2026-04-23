Feature: Acceso al endpoint admin
  Como sistema
  Quiero validar permisos de administrador
  Para proteger rutas críticas

  Scenario: Rechazar cuando no hay token
    Given no envío cookie access_token
    When consulto el endpoint admin protegido
    Then la respuesta debe ser 401

  Scenario: Permitir cuando el token es de administrador
    Given envío un token válido con rol de administrador
    When consulto el endpoint admin protegido
    Then la respuesta debe ser 200

  Scenario: Rechazar cuando el token es de usuario normal
    Given envío un token válido con rol no administrador
    When consulto el endpoint admin protegido
    Then la respuesta debe ser 403
