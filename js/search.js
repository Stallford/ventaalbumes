// search.js

document.addEventListener('DOMContentLoaded', () => {
  const searchBar = document.querySelector('.search-bar input');
  const albumGrid = document.getElementById('albumGrid');
  const albumCards = albumGrid.querySelectorAll('.album-card');
  const noResultsMessage = document.getElementById('noResultsMessage');

  searchBar.addEventListener('input', () => {
      const searchTerm = searchBar.value.toLowerCase();
      let hasResults = false;

      albumCards.forEach(card => {
          // Obtener los textos que queremos comparar con el término de búsqueda
          const albumName = card.querySelector('h3').innerText.toLowerCase();
          const groupName = card.querySelector('p:nth-of-type(1)').innerText.toLowerCase().replace('grupo: ', '').trim();
          const releaseDate = card.querySelector('p:nth-of-type(2)').innerText.toLowerCase().replace('fecha de lanzamiento: ', '').trim();
          const songCount = card.querySelector('p:nth-of-type(3)').innerText.toLowerCase().replace('número de canciones: ', '').trim();
          const price = card.querySelector('p:nth-of-type(4)').innerText.toLowerCase().replace('precio: $', '').trim();

          // Verificar si el término de búsqueda está en alguno de los textos, con comparaciones exactas para número de canciones
          if (
              albumName.includes(searchTerm) ||
              groupName.includes(searchTerm) ||
              releaseDate.includes(searchTerm) ||
              songCount === searchTerm ||
              price.includes(searchTerm) // Cambiar de `price === searchTerm` a `price.includes(searchTerm)`
          ) {
              card.style.display = '';
              hasResults = true;
          } else {
              card.style.display = 'none';
          }
      });

      // Mostrar u ocultar el mensaje de "No hay álbumes disponibles"
      if (hasResults) {
          noResultsMessage.style.display = 'none';
      } else {
          noResultsMessage.style.display = 'block';
      }
  });
});
