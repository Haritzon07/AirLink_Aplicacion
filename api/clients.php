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
        getClients($db);
        break;
    case 'POST':
        createClient($db);
        break;
    case 'PUT':
        updateClient($db);
        break;
    case 'DELETE':
        deleteClient($db);
        break;
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        break;
}

function getClients($db) {
    try {
        $query = "SELECT c.*, a.name as antenna_name 
                  FROM clients c 
                  LEFT JOIN starlink_antennas a ON c.antenna_id = a.id 
                  ORDER BY c.name";
        $stmt = $db->prepare($query);
        $stmt->execute();
        
        $clients = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'data' => $clients
        ]);
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error al obtener clientes: ' . $e->getMessage()
        ]);
    }
}

function createClient($db) {
    try {
        $name = $_POST['name'] ?? '';
        $phone = $_POST['phone'] ?? '';
        $email = $_POST['email'] ?? '';
        $address = $_POST['address'] ?? '';
        $antenna_id = $_POST['antenna_id'] ?? null;
        $monthly_fee = $_POST['monthly_fee'] ?? 0;
        $payment_day = $_POST['payment_day'] ?? 1;
        $status = $_POST['status'] ?? 'active';
        
        if (empty($name) || empty($phone) || empty($address)) {
            throw new Exception('Campos requeridos faltantes');
        }
        
        $query = "INSERT INTO clients (name, phone, email, address, antenna_id, monthly_fee, payment_day, status) 
                  VALUES (:name, :phone, :email, :address, :antenna_id, :monthly_fee, :payment_day, :status)";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':phone', $phone);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':address', $address);
        $stmt->bindParam(':antenna_id', $antenna_id);
        $stmt->bindParam(':monthly_fee', $monthly_fee);
        $stmt->bindParam(':payment_day', $payment_day);
        $stmt->bindParam(':status', $status);
        
        if ($stmt->execute()) {
            $client_id = $db->lastInsertId();
            
            // Get the created client with antenna name
            $query = "SELECT c.*, a.name as antenna_name 
                      FROM clients c 
                      LEFT JOIN starlink_antennas a ON c.antenna_id = a.id 
                      WHERE c.id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id', $client_id);
            $stmt->execute();
            $client = $stmt->fetch(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'success' => true,
                'message' => 'Cliente creado exitosamente',
                'client' => $client
            ]);
        } else {
            throw new Exception('Error al crear cliente');
        }
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
}

function updateClient($db) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $id = $input['id'] ?? 0;
        $name = $input['name'] ?? '';
        $phone = $input['phone'] ?? '';
        $email = $input['email'] ?? '';
        $address = $input['address'] ?? '';
        $antenna_id = $input['antenna_id'] ?? null;
        $monthly_fee = $input['monthly_fee'] ?? 0;
        $payment_day = $input['payment_day'] ?? 1;
        $status = $input['status'] ?? 'active';
        
        if (empty($id) || empty($name) || empty($phone) || empty($address)) {
            throw new Exception('Campos requeridos faltantes');
        }
        
        $query = "UPDATE clients SET name = :name, phone = :phone, email = :email, address = :address, 
                  antenna_id = :antenna_id, monthly_fee = :monthly_fee, payment_day = :payment_day, status = :status 
                  WHERE id = :id";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':phone', $phone);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':address', $address);
        $stmt->bindParam(':antenna_id', $antenna_id);
        $stmt->bindParam(':monthly_fee', $monthly_fee);
        $stmt->bindParam(':payment_day', $payment_day);
        $stmt->bindParam(':status', $status);
        
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'message' => 'Cliente actualizado exitosamente'
            ]);
        } else {
            throw new Exception('Error al actualizar cliente');
        }
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
}

function deleteClient($db) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? 0;
        
        if (empty($id)) {
            throw new Exception('ID de cliente requerido');
        }
        
        $query = "DELETE FROM clients WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $id);
        
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'message' => 'Cliente eliminado exitosamente'
            ]);
        } else {
            throw new Exception('Error al eliminar cliente');
        }
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
}
?>
