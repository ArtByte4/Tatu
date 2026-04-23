@e2e @e2e-auth
Feature: Flujo e2e de Auth - Responsable Michael Yesid Castro
  Como equipo de Art Byte Technology
  Queremos validar el flujo completo de autenticacion
  Para asegurar el acceso y el cierre de sesion

  Scenario: Registro a cierre de sesion
    Given existe un entorno limpio para el flujo auth e2e
    When completo el flujo de registro, login, acceso protegido y logout
    Then el flujo auth e2e finaliza exitosamente
