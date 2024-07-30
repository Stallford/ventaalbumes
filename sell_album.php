<?php
session_start();

header('Content-Type: application/json'); // Asegúrate de que la respuesta sea JSON

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = $_POST['nombre'];
    $año_lanzamiento = $_POST['año_lanzamiento'];
    $numero_canciones = $_POST['numero_canciones'];
    $nombre_grupo = $_POST['nombre_grupo'];
    $precio = $_POST['precio'];

    if (isset($_FILES['portada_foto']) && $_FILES['portada_foto']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['portada_foto']['tmp_name'];
        $fileName = $_FILES['portada_foto']['name'];
        $fileSize = $_FILES['portada_foto']['size'];
        $fileType = $_FILES['portada_foto']['type'];
        $fileNameCmps = explode(".", $fileName);
        $fileExtension = strtolower(end($fileNameCmps));
        
        $allowedfileExtensions = array('jpg', 'gif', 'png');
        if (in_array($fileExtension, $allowedfileExtensions)) {
            $uploadFileDir = './albumes/';
            $dest_path = $uploadFileDir . $fileName;

            if(move_uploaded_file($fileTmpPath, $dest_path)) {
                // Insertar datos en la base de datos
                $db = new mysqli('localhost', 'root', '', 'ventaalbumes');

                if ($db->connect_error) {
                    $response['error_message'] = "Error de conexión a la base de datos: " . $db->connect_error;
                } else {
                    $stmt = $db->prepare("INSERT INTO albumes (nombre, año_lanzamiento, numero_canciones, nombre_grupo, portada_foto, precio) VALUES (?, ?, ?, ?, ?, ?)");
                    $stmt->bind_param("ssissd", $nombre, $año_lanzamiento, $numero_canciones, $nombre_grupo, $fileName, $precio);
                    
                    if ($stmt->execute()) {
                        $response['success_message'] = "Álbum publicado exitosamente.";
                    } else {
                        $response['error_message'] = "Error al guardar el álbum: " . $stmt->error;
                    }

                    $stmt->close();
                    $db->close();
                }
            } else {
                $response['error_message'] = "Error al mover el archivo cargado.";
            }
        } else {
            $response['error_message'] = "Extensión de archivo no permitida. Solo se permiten archivos JPG, GIF y PNG.";
        }
    } else {
        $response['error_message'] = "Error en la carga del archivo.";
    }
} else {
    $response['error_message'] = "Método de solicitud no permitido.";
}

echo json_encode($response);
?>
