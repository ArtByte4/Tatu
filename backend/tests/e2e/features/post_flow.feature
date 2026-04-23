@e2e @e2e-post
Feature: Flujo e2e de Post - Responsable Cristian Fabian Munoz
  Como usuario autenticado
  Quiero crear una publicacion con imagen
  Para verla en el feed principal

  Scenario: Login, crear post y verificar feed
    Given existe un entorno preparado para el flujo post e2e
    When inicio sesion y publico un post con imagen
    Then el flujo post e2e finaliza exitosamente
