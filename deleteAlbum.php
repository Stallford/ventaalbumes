<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'No estás autenticado.']);
    exit();
}

$db = new mysqli('localhost', 'root', '', 'ventaalbumes');
if ($db->connect_error) {
    die("Error de conexión: " . $db->connect_error);
}

$id = isset($_POST['id']) ? intval($_POST['id']) : 0;

if ($id > 0) {

    $query = "DELETE FROM albumes WHERE id = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param('i', $id);
    
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['success' => true, 'message' => 'Álbum eliminado exitosamente.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Álbum no encontrado.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al eliminar el álbum.']);
    }
    
    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'ID inválido.']);
}

$db->close();
?>
