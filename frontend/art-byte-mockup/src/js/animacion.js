
const imagenSrc = "/art-byte-mockup/src/img/pngegg.png";

// Función para generar una posición aleatoria dentro de la ventana, asegurando que no se salga

const x = Math.random();  // Posición X aleatoria, restando el ancho de la imagen
const y = Math.random(); // Posición Y aleatoria, restando el alto de la imagen


function crearImagen() {
  const img = document.createElement('img');  // Crear un nuevo elemento <img>
  img.src = imagenSrc;  // Asignar la fuente de la imagen
  img.classList.add('imagen');  // Agregar la clase de CSS

  // Generar un tamaño aleatorio para la imagen
  const ancho = generarTamanoAleatorio();  // Ancho aleatorio dentro de 50px a 150px
  const alto = generarTamanoAleatorio();   // Alto aleatorio dentro de 50px a 150px

  // Asignar el tamaño real de la imagen
  img.style.width = `${ancho}px`;
  img.style.height = `${alto}px`;

  // Generar una posición aleatoria para la imagen
  const { x, y } = generarPosicionAleatoria(ancho, alto);

  // Asignar variables CSS para la posición inicial
  img.style.setProperty('--pos-x', x / window.innerWidth);  // Asignar posición X en porcentaje
  img.style.setProperty('--pos-y', y / window.innerHeight); // Asignar posición Y en porcentaje

  // Añadir la imagen al documento
  document.body.appendChild(img);

  // Función para mover la imagen a una nueva posición aleatoria
  function moverImagen() {
    // Generar nueva posición aleatoria
    const { x, y } = generarPosicionAleatoria(ancho, alto);

    // Actualizar las variables CSS para la nueva posición
    img.style.setProperty('--pos-x', x / window.innerWidth);
    img.style.setProperty('--pos-y', y / window.innerHeight);
  }

  // Llamar a moverImagen cuando quieras cambiar la posición
  setInterval(moverImagen, 3000);  // Cambiar la posición cada 3 segundos, por ejemplo

  // Usar CSS para aplicar las posiciones y la escala
  img.style.position = 'absolute';
  img.style.left = `calc(var(--pos-x) * 100vw)`;
  img.style.top = `calc(var(--pos-y) * 100vh)`;
}


