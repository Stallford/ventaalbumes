document.addEventListener('DOMContentLoaded', () => {
  const cartBtn = document.getElementById('cartBtn');
  const cartModal = document.getElementById('cartModal');
  const closeCartModalBtn = document.getElementById('closeCartModalBtn');
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');

  function updateCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartItems.innerHTML = ''; // Limpiar el contenido del carrito
    let total = 0;

    if (cart.length === 0) {
      cartItems.innerHTML = '<p>No hay elementos en el carrito.</p>';
      cartTotal.innerHTML = '';
    } else {
      cart.forEach(item => {
        const itemHTML = `
          <div class="cart-item">
            <img src="albumes/${item.portada_foto}" alt="${item.nombre_album}" class="cart-item-image">
            <div class="cart-item-info">
              <h4>${item.nombre_album}</h4>
              <p>Precio: $${item.precio}</p>
            </div>
          </div>
        `;
        cartItems.innerHTML += itemHTML;
        total += parseFloat(item.precio);
      });

      cartTotal.innerHTML = `<h4>Total: $${total.toFixed(2)}</h4>`;
    }
  }

  cartBtn.addEventListener('click', () => {
    updateCart();
    cartModal.style.display = 'block';
  });

  closeCartModalBtn.addEventListener('click', () => {
    cartModal.style.display = 'none';
  });

  // Cerrar el modal si el usuario hace clic fuera de él
  window.addEventListener('click', (event) => {
    if (event.target === cartModal) {
      cartModal.style.display = 'none';
    }
  });

  // Cerrar el modal si el usuario presiona la tecla 'Esc'
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      cartModal.style.display = 'none';
    }
  });
});
