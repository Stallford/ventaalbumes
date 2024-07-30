<?php
require 'includes/db.php';

$error_message = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $sql = "SELECT id, contraseña FROM usuarios WHERE nombre_usuario = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $username);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($id, $hashed_password);
        $stmt->fetch();

        if (password_verify($password, $hashed_password)) {
            session_start();
            $_SESSION['user_id'] = $id;
            $_SESSION['username'] = $username;
            header('Location: home.php');
            exit();
        } else {
            $error_message = 'Contraseña incorrecta.';
        }
    } else {
        $error_message = 'Usuario no encontrado.';
    }
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
    <?php if ($error_message): ?>
    <script>
        alert('<?php echo $error_message; ?>');
    </script>
    <?php endif; ?>
    <div class="container">
        <h1>Twice album store</h1>
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
