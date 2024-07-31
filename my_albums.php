<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit();
}

// Conectar con la base de datos
$db = new mysqli('localhost', 'root', '', 'ventaalbumes');

// Verificar la conexión
if ($db->connect_error) {
    die("Error de conexión: " . $db->connect_error);
}

// Consultar los álbumes del usuario actual
$user_id = $_SESSION['user_id'];
$query = "SELECT * FROM albumes WHERE usuario_id = ?";
$stmt = $db->prepare($query);
$stmt->bind_param('i', $user_id);
$stmt->execute();
$result = $stmt->get_result();

?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mis Álbumes - Tienda de Álbumes</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
<header>
    <div class="header-left">
    <a href="home.php"><h2>Tienda de Álbumes</h2></a>
    </div>
    <div class="header-right">
        <a href="#" id="cartBtn" class="cart-button">
            <img src="icons/carrito.png" alt="Carrito" class="cart-icon">
        </a>
        <a href="#" id="editUserBtn"><?php echo htmlspecialchars($_SESSION['username']); ?></a>
        <a href="#" id="sellAlbumBtn" class="sell-album-button">Vende tu Álbum</a>
        <a href="logout.php" class="logout-button">Cerrar sesión</a>
    </div>
</header>

<div class="home-container">
    <div class="welcome-message">
        <h1>Mis Álbumes</h1>
    </div>
    <div class="search-bar">
        <input type="text" placeholder="Buscar álbumes...">
    </div>
    <?php
    if ($result->num_rows > 0) {
        echo '<div class="album-grid" id="albumGrid">';
        
        while ($row = $result->fetch_assoc()) {
            $portada_foto = $row['portada_foto'] ? 'albumes/' . $row['portada_foto'] : 'path/to/default/image.jpg';
            $nombre_album = htmlspecialchars($row['nombre']);
            $fecha_lanzamiento = htmlspecialchars($row['año_lanzamiento']);
            $numero_canciones = htmlspecialchars($row['numero_canciones']);
            $precio = htmlspecialchars($row['precio']);
            $nombre_grupo = htmlspecialchars($row['nombre_grupo']);
            $album_id = $row['id'];

            echo '
            <div class="album-card" data-album-id="' . $album_id . '">
                <img src="' . $portada_foto . '" alt="' . $nombre_album . '">
                <div class="album-info">
                    <h3>' . $nombre_album . '</h3>
                    <p>Grupo: ' . $nombre_grupo . '</p>
                    <p>Fecha de lanzamiento: ' . $fecha_lanzamiento . '</p>
                    <p>Número de canciones: ' . $numero_canciones . '</p>
                    <p>Precio: $' . number_format($precio, 2) . '</p>
                </div>
            </div>';
        }
        
        echo '</div>';
        echo '<p id="noResultsMessage" style="display: none;">No tienes álbumes publicados.</p>';
    } else {
        echo "<p>No tienes álbumes publicados.</p>";
    }

    $stmt->close();
    $db->close();
    ?>
</div>

<footer>
    <p>&copy; 2024 Tienda de Álbumes de Twice. Todos los derechos reservados.</p>
</footer>

<!-- Modal para editar usuario -->
<div id="editUserModal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <form id="editUserForm" method="post">
            <h2>Editar Usuario</h2>
            <div class="error" id="error_message"></div>
            <div class="success" id="success_message"></div>
            <label for="username">Nombre de usuario:</label>
            <input type="text" id="username" name="username" required>
            <label for="email">Correo electrónico:</label>
            <input type="email" id="email" name="email" required>
            <hr>
            <h2>Cambiar Contraseña</h2>
            <label for="current_password">Contraseña actual:</label>
            <input type="password" id="current_password" name="current_password">
            <label for="new_password">Nueva contraseña:</label>
            <input type="password" id="new_password" name="new_password">
            <label for="confirm_password">Confirmar nueva contraseña:</label>
            <input type="password" id="confirm_password" name="confirm_password">
            <button type="submit">Actualizar</button>
        </form>
    </div>
</div>
<!-- Modal para vender álbum -->
<div id="sellAlbumModal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <form id="sellAlbumForm" method="post" enctype="multipart/form-data">
            <h2>Vender Álbum</h2>
            <div class="error" id="sell_error_message"></div>
            <div class="success" id="sell_success_message"></div>
            <label for="nombre">Nombre del álbum:</label>
            <input type="text" id="nombre" name="nombre" required>
            <label for="año_lanzamiento">Año de lanzamiento:</label>
            <input type="text" id="año_lanzamiento" name="año_lanzamiento" required>
            <label for="numero_canciones">Número de canciones:</label>
            <input type="text" id="numero_canciones" name="numero_canciones" required>
            <label for="nombre_grupo">Nombre del grupo:</label>
            <input type="text" id="nombre_grupo" name="nombre_grupo" required>
            <label for="portada_foto">Portada del álbum:</label>
            <input type="file" id="portada_foto" name="portada_foto" accept="image/*" required>
            <label for="precio">Precio:</label>
            <input type="text" id="precio" name="precio" required>
            <button type="submit">Publicar</button>
            <button type="button" id="cancelSellAlbumBtn">Cancelar</button>
            <input type="hidden" name="action" value="add_album">
        </form>
    </div>
</div>
<!-- Modal para información del álbum -->
<div id="albumModal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <div class="modal-body">
            <div class="modal-image">
                <!-- Aquí se mostrará la imagen del álbum -->
            </div>
            <div class="modal-info">
                <!-- Aquí se mostrará la información del álbum -->
            </div>
            <button id="addToCartBtn">Agregar al carrito</button>
            <button id="cancelBtn">Cancelar</button>
        </div>
    </div>
</div>

<!-- Modal del Carrito -->
<div id="cartModal" class="modal">
    <div class="modal-content">
        <div id="cartItems">
            <!-- Los ítems del carrito se llenarán dinámicamente aquí -->
        </div>
        <div class="cart-total-container">
            <div class="cart-total" id="cartTotal">Total: $0.00</div>
        </div>
        <button id="checkoutBtn">Proceder al Pago</button>
        <button id="closeCartModalBtn">Cerrar</button>
    </div>
</div>

<script src="js/modal.js"></script>
<script src="js/search.js"></script>
<script src="js/albumInfo.js"></script>
<script src="js/cart.js"></script>
</body>
</html>
