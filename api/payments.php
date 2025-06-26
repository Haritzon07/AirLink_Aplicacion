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
        getPayments($db);
        break;
    case 'POST':
        createPayment($db);
        break;
    case 'PUT':
        updatePayment($db);
        break;
    case 'DELETE':
        deletePayment($db);
        break;
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        break;
}

function getPayments($db) {
    try {
        $query = "SELECT p.*, c.name as client_name, c.phone as client_phone 
                  FROM payments p 
                  JOIN clients c ON p.client_id = c.id 
                  ORDER BY p.due_date DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        
        $payments = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'data' => $payments
        ]);
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error al obtener pagos: ' . $e->getMessage()
        ]);
    }
}

function createPayment($db) {
    try {
        $client_id = $_POST['client_id'] ?? 0;
        $amount = $_POST['amount'] ?? 0;
        $due_date = $_POST['due_date'] ?? '';
        $status = $_POST['status'] ?? 'pending';
        $payment_method = $_POST['payment_method'] ?? null;
        $notes = $_POST['notes'] ?? '';
        
        if (empty($client_id) || empty($amount) || empty($due_date)) {
            throw new Exception('Campos requeridos faltantes');
        }
        
        $payment_date = null;
        if ($status === 'paid') {
            $payment_date = date('Y-m-d');
        }
        
        $query = "INSERT INTO payments (client_id, amount, payment_date, due_date, payment_method, status, notes) 
                  VALUES (:client_id, :amount, :payment_date, :due_date, :payment_method, :status, :notes)";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':client_id', $client_id);
        $stmt->bindParam(':amount', $amount);
        $stmt->bindParam(':payment_date', $payment_date);
        $stmt->bindParam(':due_date', $due_date);
        $stmt->bindParam(':payment_method', $payment_method);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':notes', $notes);
        
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'message' => 'Pago registrado exitosamente'
            ]);
        } else {
            throw new Exception('Error al registrar pago');
        }
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
}

function updatePayment($db) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $id = $input['id'] ?? 0;
        $status = $input['status'] ?? '';
        $payment_method = $input['payment_method'] ?? null;
        $payment_date = $input['payment_date'] ?? null;
        
        if (empty($id)) {
            throw new Exception('ID de pago requerido');
        }
        
        $query = "UPDATE payments SET status = :status, payment_method = :payment_method, payment_date = :payment_date 
                  WHERE id = :id";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':payment_method', $payment_method);
        $stmt->bindParam(':payment_date', $payment_date);
        
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'message' => 'Pago actualizado exitosamente'
            ]);
        } else {
            throw new Exception('Error al actualizar pago');
        }
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
}

function deletePayment($db) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? 0;
        
        if (empty($id)) {
            throw new Exception('ID de pago requerido');
        }
        
        $query = "DELETE FROM payments WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $id);
        
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'message' => 'Pago eliminado exitosamente'
            ]);
        } else {
            throw new Exception('Error al eliminar pago');
        }
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
}
?>
