document.addEventListener('DOMContentLoaded', () => {
  const cartBtn = document.getElementById('cartBtn');
  const cartModal = document.getElementById('cartModal');
  const closeCartModalBtn = document.getElementById('closeCartModalBtn');
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');

  function updateCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartItems.innerHTML = ''; // Limpiar el contenido del carrito
    let total = 0;

    if (cart.length === 0) {
      cartItems.innerHTML = '<p>No hay elementos en el carrito.</p>';
      cartTotal.innerHTML = '';
      checkoutBtn.style.display = 'none'; // Ocultar el botón de pago si el carrito está vacío
    } else {
      cart.forEach((item, index) => {
        const itemHTML = `
          <div class="cart-item" data-index="${index}">
            <img src="albumes/${item.portada_foto}" alt="${item.nombre_album}" class="cart-item-image">
            <div class="cart-item-info">
              <h4>${item.nombre_album}</h4>
              <p>Precio: $${item.precio}</p>
              <button id="remove-btn-${index}" class="remove-btn">X</button> <!-- Botón para eliminar el ítem -->
            </div>
          </div>
        `;
        cartItems.innerHTML += itemHTML;
        total += parseFloat(item.precio);
      });

      cartTotal.innerHTML = `<h4>Total: $${total.toFixed(2)}</h4>`;
      checkoutBtn.style.display = 'block'; // Mostrar el botón de pago si el carrito no está vacío
    }

    // Añadir event listeners a los botones de eliminación
    cart.forEach((item, index) => {
      const removeBtn = document.getElementById(`remove-btn-${index}`);
      if (removeBtn) {
        removeBtn.addEventListener('click', () => {
          removeFromCart(index);
        });
      }
    });
  }

  function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1); // Eliminar el ítem del carrito
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart(); // Actualizar el carrito
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

  // Event listener para el botón de proceder al pago
  checkoutBtn.addEventListener('click', () => {
    localStorage.removeItem('cart');
    alert('Pago realizado con éxito');
    cartModal.style.display = 'none';
    updateCart(); // Actualizar la vista del carrito
  });
});
