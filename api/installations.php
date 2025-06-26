<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getInstallations($db);
        break;
    case 'POST':
        createInstallation($db);
        break;
    case 'PUT':
        updateInstallation($db);
        break;
    case 'DELETE':
        deleteInstallation($db);
        break;
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        break;
}

function getInstallations($db) {
    try {
        $query = "SELECT i.*, c.name as client_name, c.phone as client_phone, a.name as antenna_name 
                  FROM installations i 
                  JOIN clients c ON i.client_id = c.id 
                  JOIN starlink_antennas a ON i.antenna_id = a.id 
                  ORDER BY i.installation_date DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        
        $installations = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'data' => $installations
        ]);
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error al obtener instalaciones: ' . $e->getMessage()
        ]);
    }
}

function createInstallation($db) {
    try {
        $client_id = $_POST['client_id'] ?? 0;
        $antenna_id = $_POST['antenna_id'] ?? 0;
        $installation_date = $_POST['installation_date'] ?? '';
        $technician_name = $_POST['technician_name'] ?? '';
        $equipment_details = $_POST['equipment_details'] ?? '';
        $installation_cost = $_POST['installation_cost'] ?? 0;
        $notes = $_POST['notes'] ?? '';
        
        if (empty($client_id) || empty($antenna_id) || empty($installation_date)) {
            throw new Exception('Campos requeridos faltantes');
        }
        
        $query = "INSERT INTO installations (client_id, antenna_id, installation_date, technician_name, equipment_details, installation_cost, notes) 
                  VALUES (:client_id, :antenna_id, :installation_date, :technician_name, :equipment_details, :installation_cost, :notes)";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':client_id', $client_id);
        $stmt->bindParam(':antenna_id', $antenna_id);
        $stmt->bindParam(':installation_date', $installation_date);
        $stmt->bindParam(':technician_name', $technician_name);
        $stmt->bindParam(':equipment_details', $equipment_details);
        $stmt->bindParam(':installation_cost', $installation_cost);
        $stmt->bindParam(':notes', $notes);
        
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'message' => 'Instalación programada exitosamente'
            ]);
        } else {
            throw new Exception('Error al programar instalación');
        }
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
}

function updateInstallation($db) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $id = $input['id'] ?? 0;
        $status = $input['status'] ?? '';
        
        if (empty($id)) {
            throw new Exception('ID de instalación requerido');
        }
        
        $query = "UPDATE installations SET status = :status WHERE id = :id";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':status', $status);
        
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'message' => 'Instalación actualizada exitosamente'
            ]);
        } else {
            throw new Exception('Error al actualizar instalación');
        }
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
}

function deleteInstallation($db) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? 0;
        
        if (empty($id)) {
            throw new Exception('ID de instalación requerido');
        }
        
        $query = "DELETE FROM installations WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $id);
        
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'message' => 'Instalación eliminada exitosamente'
            ]);
        } else {
            throw new Exception('Error al eliminar instalación');
        }
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
}
?>
