<?php
session_start();
if (isset($_SESSION['user_id'])) {
    header('Location: albums.php');
    exit();
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inicio de Sesión - Tienda de Álbumes</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
<video class="video-background" autoplay muted loop>
        <source src="bg/Background.mp4" type="video/mp4">
        Tu navegador no soporta el formato de video.
    </video>
    <div class="container">
        <h1>Album store</h1>
        <form action="login.php" method="post">
            <label for="username">Nombre de usuario:</label>
            <input type="text" id="username" name="username" required>
            <label for="password">Contraseña:</label>
            <input type="password" id="password" name="password" required>
            <button type="submit">Iniciar sesión</button>
        </form>
        <p>¿No tienes una cuenta? <a href="register.php">Regístrate aquí</a></p>
    </div>
</body>
</html>
