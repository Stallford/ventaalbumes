document.addEventListener('DOMContentLoaded', () => {
  const albumCards = document.querySelectorAll('.album-card');
  const albumModal = document.getElementById('albumModal');
  const closeModal = albumModal.querySelector('.close');
  const deleteAlbumBtn = albumModal.querySelector('#deleteAlbumBtn');
  const cancelBtn = albumModal.querySelector('#cancelBtn');

  let currentAlbum = null;

  albumCards.forEach(card => {
    card.addEventListener('click', () => {
      const albumId = card.getAttribute('data-album-id');
      fetch(`getAlbumInfo.php?id=${albumId}`)
        .then(response => response.json())
        .then(data => {
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
            currentAlbum = data; 
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

 
  window.addEventListener('click', (event) => {
    if (event.target === albumModal) {
      closeModalHandler();
    }
  });

  
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeModalHandler();
    }
  });


  deleteAlbumBtn.addEventListener('click', () => {
    if (currentAlbum && currentAlbum.id) {
      if (confirm('¿Estás seguro de que quieres eliminar este álbum?')) {
        fetch('deleteAlbum.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            id: currentAlbum.id
          }).toString()
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert('Álbum eliminado exitosamente');
            location.reload(); 
          } else {
            alert('Error al eliminar el álbum: ' + (data.message || ''));
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Error al eliminar el álbum');
        });
      }
    } else {
      alert('No se pudo encontrar el ID del álbum.');
    }
  });
});
