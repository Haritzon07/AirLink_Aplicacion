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
        getAntennas($db);
        break;
    case 'POST':
        createAntenna($db);
        break;
    case 'PUT':
        updateAntenna($db);
        break;
    case 'DELETE':
        deleteAntenna($db);
        break;
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        break;
}

function getAntennas($db) {
    try {
        $query = "SELECT * FROM starlink_antennas ORDER BY name";
        $stmt = $db->prepare($query);
        $stmt->execute();
        
        $antennas = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'data' => $antennas
        ]);
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error al obtener antenas: ' . $e->getMessage()
        ]);
    }
}

function createAntenna($db) {
    try {
        $name = $_POST['name'] ?? '';
        $location = $_POST['location'] ?? '';
        $coverage_area = $_POST['coverage_area'] ?? '';
        $max_capacity = $_POST['max_capacity'] ?? 50;
        $signal_strength = $_POST['signal_strength'] ?? 90;
        $installation_date = $_POST['installation_date'] ?? date('Y-m-d');
        
        if (empty($name) || empty($location)) {
            throw new Exception('Campos requeridos faltantes');
        }
        
        $query = "INSERT INTO starlink_antennas (name, location, coverage_area, max_capacity, signal_strength, installation_date, last_maintenance) 
                  VALUES (:name, :location, :coverage_area, :max_capacity, :signal_strength, :installation_date, :last_maintenance)";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':location', $location);
        $stmt->bindParam(':coverage_area', $coverage_area);
        $stmt->bindParam(':max_capacity', $max_capacity);
        $stmt->bindParam(':signal_strength', $signal_strength);
        $stmt->bindParam(':installation_date', $installation_date);
        $stmt->bindParam(':last_maintenance', $installation_date);
        
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'message' => 'Antena creada exitosamente'
            ]);
        } else {
            throw new Exception('Error al crear antena');
        }
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
}

function updateAntenna($db) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $id = $input['id'] ?? 0;
        $name = $input['name'] ?? '';
        $location = $input['location'] ?? '';
        $status = $input['status'] ?? 'active';
        $coverage_area = $input['coverage_area'] ?? '';
        $max_capacity = $input['max_capacity'] ?? 50;
        $signal_strength = $input['signal_strength'] ?? 90;
        
        if (empty($id)) {
            throw new Exception('ID de antena requerido');
        }
        
        $query = "UPDATE starlink_antennas SET name = :name, location = :location, status = :status, 
                  coverage_area = :coverage_area, max_capacity = :max_capacity, signal_strength = :signal_strength 
                  WHERE id = :id";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':location', $location);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':coverage_area', $coverage_area);
        $stmt->bindParam(':max_capacity', $max_capacity);
        $stmt->bindParam(':signal_strength', $signal_strength);
        
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'message' => 'Antena actualizada exitosamente'
            ]);
        } else {
            throw new Exception('Error al actualizar antena');
        }
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
}

function deleteAntenna($db) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? 0;
        
        if (empty($id)) {
            throw new Exception('ID de antena requerido');
        }
        
        $query = "DELETE FROM starlink_antennas WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $id);
        
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'message' => 'Antena eliminada exitosamente'
            ]);
        } else {
            throw new Exception('Error al eliminar antena');
        }
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
}
?>
