<?php
session_start();
require 'includes/db.php';

$response = array('error_message' => '', 'success_message' => '');

if (!isset($_SESSION['user_id'])) {
    $response['error_message'] = 'Debe iniciar sesión.';
    echo json_encode($response);
    exit();
}

$user_id = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $new_username = $_POST['username'];
    $new_email = $_POST['email'];
    $current_password = $_POST['current_password'];
    $new_password = $_POST['new_password'];
    $confirm_password = $_POST['confirm_password'];

    $sql = "SELECT contraseña FROM usuarios WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $stmt->bind_result($hashed_password);
    $stmt->fetch();

    if (password_verify($current_password, $hashed_password)) {
        if ($new_password === $confirm_password) {
            $new_hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
            $stmt->free_result();
            
            $sql = "UPDATE usuarios SET nombre_usuario = ?, correo = ?, contraseña = ? WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param('sssi', $new_username, $new_email, $new_hashed_password, $user_id);
            
            if ($stmt->execute()) {
                $_SESSION['username'] = $new_username;
                $response['success_message'] = 'Información actualizada correctamente.';
            } else {
                $response['error_message'] = 'Error al actualizar la información: ' . $stmt->error;
            }
        } else {
            $response['error_message'] = 'Las nuevas contraseñas no coinciden.';
        }
    } else {
        $response['error_message'] = 'La contraseña actual es incorrecta.';
    }
    echo json_encode($response);
    exit();
}

$sql = "SELECT nombre_usuario, correo FROM usuarios WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $user_id);
$stmt->execute();
$stmt->bind_result($username, $email);
$stmt->fetch();
$stmt->free_result();

$response['username'] = $username;
$response['email'] = $email;

echo json_encode($response);
?>
