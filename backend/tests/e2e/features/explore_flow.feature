@e2e @e2e-explore
Feature: Flujo e2e de Explore - Responsable Juan Felipe Higuera
  Como usuario autenticado
  Quiero buscar personas y revisar su perfil
  Para explorar la comunidad

  Scenario: Login, buscar usuario y abrir perfil
    Given existe un entorno preparado para el flujo explore e2e
    When inicio sesion y consulto explore con una busqueda valida
    Then el flujo explore e2e finaliza exitosamente
