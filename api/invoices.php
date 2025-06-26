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
        getInvoices($db);
        break;
    case 'POST':
        createInvoice($db);
        break;
    case 'PUT':
        updateInvoice($db);
        break;
    case 'DELETE':
        deleteInvoice($db);
        break;
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        break;
}

function getInvoices($db) {
    try {
        $query = "SELECT i.*, c.name as client_name, c.phone as client_phone, c.address as client_address 
                  FROM invoices i 
                  JOIN clients c ON i.client_id = c.id 
                  ORDER BY i.issue_date DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        
        $invoices = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'data' => $invoices
        ]);
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error al obtener facturas: ' . $e->getMessage()
        ]);
    }
}

function createInvoice($db) {
    try {
        $client_id = $_POST['client_id'] ?? 0;
        $amount = $_POST['amount'] ?? 0;
        $due_date = $_POST['due_date'] ?? '';
        $description = $_POST['description'] ?? '';
        
        if (empty($client_id) || empty($amount) || empty($due_date)) {
            throw new Exception('Campos requeridos faltantes');
        }
        
        // Generate invoice number
        $year = date('Y');
        $query = "SELECT COUNT(*) as count FROM invoices WHERE YEAR(issue_date) = :year";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':year', $year);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $next_number = $result['count'] + 1;
        $invoice_number = "FAC-{$year}-" . str_pad($next_number, 3, '0', STR_PAD_LEFT);
        
        $issue_date = date('Y-m-d');
        
        $query = "INSERT INTO invoices (invoice_number, client_id, amount, issue_date, due_date, description, status) 
                  VALUES (:invoice_number, :client_id, :amount, :issue_date, :due_date, :description, 'pending')";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':invoice_number', $invoice_number);
        $stmt->bindParam(':client_id', $client_id);
        $stmt->bindParam(':amount', $amount);
        $stmt->bindParam(':issue_date', $issue_date);
        $stmt->bindParam(':due_date', $due_date);
        $stmt->bindParam(':description', $description);
        
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'message' => 'Factura creada exitosamente',
                'invoice_number' => $invoice_number
            ]);
        } else {
            throw new Exception('Error al crear factura');
        }
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
}

function updateInvoice($db) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $id = $input['id'] ?? 0;
        $status = $input['status'] ?? '';
        $payment_method = $input['payment_method'] ?? null;
        
        if (empty($id)) {
            throw new Exception('ID de factura requerido');
        }
        
        $query = "UPDATE invoices SET status = :status, payment_method = :payment_method WHERE id = :id";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':payment_method', $payment_method);
        
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'message' => 'Factura actualizada exitosamente'
            ]);
        } else {
            throw new Exception('Error al actualizar factura');
        }
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
}

function deleteInvoice($db) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? 0;
        
        if (empty($id)) {
            throw new Exception('ID de factura requerido');
        }
        
        $query = "DELETE FROM invoices WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $id);
        
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'message' => 'Factura eliminada exitosamente'
            ]);
        } else {
            throw new Exception('Error al eliminar factura');
        }
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
}
?>
