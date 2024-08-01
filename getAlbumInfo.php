<?php
header('Content-Type: application/json');
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

$db = new mysqli('localhost', 'root', '', 'ventaalbumes');


if ($db->connect_error) {
    die("Error de conexión: " . $db->connect_error);
}

$query = $db->prepare("SELECT * FROM albumes WHERE id = ?");
$query->bind_param('i', $id);
$query->execute();
$result = $query->get_result();

if ($result->num_rows > 0) {
    $album = $result->fetch_assoc();
    $response = [
        'id' => $album['id'], 
        'nombre_album' => $album['nombre'],
        'nombre_grupo' => $album['nombre_grupo'],
        'fecha_lanzamiento' => $album['año_lanzamiento'],
        'numero_canciones' => $album['numero_canciones'],
        'precio' => $album['precio'],
        'portada_foto' => $album['portada_foto']
    ];
    echo json_encode($response);
} else {
    echo json_encode(['error' => 'Álbum no encontrado']);
}

$db->close();
?>
