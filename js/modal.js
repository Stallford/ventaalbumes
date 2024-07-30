document.addEventListener("DOMContentLoaded", function() {
  var editUserModal = document.getElementById("editUserModal");
  var editUserBtn = document.getElementById("editUserBtn");
  var sellAlbumModal = document.getElementById("sellAlbumModal");
  var sellAlbumBtn = document.getElementById("sellAlbumBtn");
  var closeBtns = document.getElementsByClassName("close");
  var cancelSellAlbumBtn = document.getElementById("cancelSellAlbumBtn");

  var errorMessage = document.getElementById('error_message');
  var successMessage = document.getElementById('success_message');
  var sellErrorMessage = document.getElementById('sell_error_message');
  var sellSuccessMessage = document.getElementById('sell_success_message');

  // Abrir modal de editar usuario
  if (editUserBtn) {
      editUserBtn.onclick = function() {
          editUserModal.style.display = "block";
          fetch('edit_user.php')
              .then(response => response.json())
              .then(data => {
                  document.getElementById('username').value = data.username || '';
                  document.getElementById('email').value = data.email || '';
                  errorMessage.innerText = data.error_message || '';
                  successMessage.innerText = data.success_message || '';

                  errorMessage.style.display = data.error_message ? 'block' : 'none';
                  successMessage.style.display = data.success_message ? 'block' : 'none';
              });
      }
  }

  // Abrir modal de vender álbum
  if (sellAlbumBtn) {
      sellAlbumBtn.onclick = function() {
          sellAlbumModal.style.display = "block";
      }
  }

  // Cerrar modal al hacer clic en (x)
  Array.from(closeBtns).forEach(btn => {
      btn.onclick = function() {
          editUserModal.style.display = "none";
          sellAlbumModal.style.display = "none";
          clearModalFields();
          clearSellModalFields();
      }
  });

  // Cerrar modal al hacer clic en el botón de cancelar
  if (cancelSellAlbumBtn) {
      cancelSellAlbumBtn.onclick = function() {
          sellAlbumModal.style.display = "none";
          clearSellModalFields();
      }
  }

  // Cerrar modal al hacer clic fuera del contenido del modal
  window.onclick = function(event) {
      if (event.target === editUserModal || event.target === sellAlbumModal) {
          editUserModal.style.display = "none";
          sellAlbumModal.style.display = "none";
          clearModalFields();
          clearSellModalFields();
      }
  }

  // Manejar el envío del formulario de editar usuario
  var editUserForm = document.getElementById('editUserForm');
  if (editUserForm) {
      editUserForm.onsubmit = function(event) {
          event.preventDefault();

          var formData = new FormData(this);
          
          fetch('edit_user.php', {
              method: 'POST',
              body: formData
          })
          .then(response => response.json())
          .then(data => {
              errorMessage.innerText = data.error_message || '';
              successMessage.innerText = data.success_message || '';

              errorMessage.style.display = data.error_message ? 'block' : 'none';
              successMessage.style.display = data.success_message ? 'block' : 'none';

              if (!data.error_message && data.success_message) {
                  setTimeout(() => {
                      editUserModal.style.display = "none";
                      clearModalFields();
                  }, 2000); // Cierra el modal después de 2 segundos solo en caso de éxito
              }
          });
      }
  }

  // Manejar el envío del formulario de vender álbum
  var sellAlbumForm = document.getElementById('sellAlbumForm');
  if (sellAlbumForm) {
      sellAlbumForm.onsubmit = function(event) {
          event.preventDefault();

          var formData = new FormData(this);
          
          fetch('sell_album.php', {
              method: 'POST',
              body: formData
          })
          .then(response => response.json())
          .then(data => {
              sellErrorMessage.innerText = data.error_message || '';
              sellSuccessMessage.innerText = data.success_message || '';

              sellErrorMessage.style.display = data.error_message ? 'block' : 'none';
              sellSuccessMessage.style.display = data.success_message ? 'block' : 'none';

              if (!data.error_message && data.success_message) {
                  setTimeout(() => {
                      sellAlbumModal.style.display = "none";
                      clearSellModalFields();
                      window.location.reload();
                  }, 2000); // Cierra el modal después de 2 segundos solo en caso de éxito
              }
          });
      }
  }

  function clearModalFields() {
      document.getElementById('username').value = '';
      document.getElementById('email').value = '';
      document.getElementById('current_password').value = '';
      document.getElementById('new_password').value = '';
      document.getElementById('confirm_password').value = '';
      errorMessage.innerText = '';
      successMessage.innerText = '';
  }

  function clearSellModalFields() {
      document.getElementById('nombre').value = '';
      document.getElementById('año_lanzamiento').value = '';
      document.getElementById('numero_canciones').value = '';
      document.getElementById('nombre_grupo').value = '';
      document.getElementById('portada_foto').value = '';
      document.getElementById('precio').value = '';
      sellErrorMessage.innerText = '';
      sellSuccessMessage.innerText = '';
  }
});
