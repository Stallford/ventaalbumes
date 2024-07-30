document.addEventListener('DOMContentLoaded', () => {
  const albumCards = document.querySelectorAll('.album-card');
  const albumModal = document.getElementById('albumModal');
  const closeModal = albumModal.querySelector('.close');
  const addToCartBtn = albumModal.querySelector('#addToCartBtn');
  const cancelBtn = albumModal.querySelector('#cancelBtn');

  let currentAlbum = null;

  albumCards.forEach(card => {
    card.addEventListener('click', () => {
      const albumId = card.getAttribute('data-album-id');
      fetch(`getAlbumInfo.php?id=${albumId}`)
        .then(response => response.json())
        .then(data => {
          console.log(data); // Verifica el contenido de data
          const modalImage = albumModal.querySelector('.modal-image');
          const modalInfo = albumModal.querySelector('.modal-info');

          if (data.error) {
            modalImage.innerHTML = `<p>${data.error}</p>`;
            modalInfo.innerHTML = '';
          } else {
            modalImage.innerHTML = `<img src="albumes/${data.portada_foto}" alt="${data.nombre_album}">`;
            modalInfo.innerHTML = `
              <h3>${data.nombre_album}</h3>
              <p>Grupo: ${data.nombre_grupo}</p>
              <p>Fecha de lanzamiento: ${data.fecha_lanzamiento}</p>
              <p>Número de canciones: ${data.numero_canciones}</p>
              <p>Precio: $${data.precio}</p>
            `;
            currentAlbum = data; // Guarda la información del álbum actual
          }
          
          albumModal.style.display = 'block';
        })
        .catch(error => console.error('Error:', error));
    });
  });

  function closeModalHandler() {
    albumModal.style.display = 'none';
  }

  closeModal.addEventListener('click', closeModalHandler);
  cancelBtn.addEventListener('click', closeModalHandler);

  // Cerrar el modal si el usuario hace clic fuera de él
  window.addEventListener('click', (event) => {
    if (event.target === albumModal) {
      closeModalHandler();
    }
  });

  // Cerrar el modal si el usuario presiona la tecla 'Esc'
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeModalHandler();
    }
  });

  // Funcionalidad del botón "Agregar al carrito"
  addToCartBtn.addEventListener('click', () => {
    if (currentAlbum) {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart.push(currentAlbum);
      localStorage.setItem('cart', JSON.stringify(cart));
      alert('Álbum agregado al carrito');
    }
  });
});
