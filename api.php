<?php
// Definir acceso seguro
define('SECURE_ACCESS', true);
require_once 'config.php';

// Headers para CORS y JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Función para conectar a la base de datos
function getConnection() {
    try {
        $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8", DB_USER, DB_PASS);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        return $pdo;
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error de conexión: ' . $e->getMessage()]);
        exit;
    }
}

// Función para responder con JSON
function jsonResponse($success, $data = null, $message = '') {
    echo json_encode([
        'success' => $success,
        'data' => $data,
        'message' => $message
    ]);
    exit;
}

// Obtener parámetros de la URL
$endpoint = $_GET['endpoint'] ?? '';
$action = $_GET['action'] ?? $_POST['action'] ?? 'list';
$method = $_SERVER['REQUEST_METHOD'];

// Router principal
switch($endpoint) {
    case 'clients':
        handleClients($action, $method);
        break;
    case 'access_points':
        handleAccessPoints($action, $method);
        break;
    case 'installations':
        handleInstallations($action, $method);
        break;
    case 'payments':
        handlePayments($action, $method);
        break;
    case 'invoices':
        handleInvoices($action, $method);
        break;
    case 'dashboard':
        handleDashboard($action, $method);
        break;
    case 'whatsapp':
        handleWhatsApp($action, $method);
        break;
    default:
        http_response_code(404);
        jsonResponse(false, null, 'Endpoint no encontrado');
}

// ==================== CLIENTES ====================
function handleClients($action, $method) {
    $pdo = getConnection();
    
    switch($action) {
        case 'list':
            $stmt = $pdo->query("SELECT * FROM clients ORDER BY created_at DESC");
            $clients = $stmt->fetchAll();
            jsonResponse(true, $clients, 'Clientes obtenidos correctamente');
            break;
            
        case 'create':
            $data = json_decode(file_get_contents('php://input'), true) ?: $_POST;
            
            $stmt = $pdo->prepare("INSERT INTO clients (nombre, telefono, status) VALUES (?, ?, ?)");
            $result = $stmt->execute([
                $data['nombre'],
                $data['telefono'],
                $data['status'] ?? 'active'
            ]);
            
            if($result) {
                $clientId = $pdo->lastInsertId();
                jsonResponse(true, ['id' => $clientId], 'Cliente creado correctamente');
            } else {
                jsonResponse(false, null, 'Error al crear cliente');
            }
            break;
            
        case 'update':
            $data = json_decode(file_get_contents('php://input'), true) ?: $_POST;
            $id = $data['id'];
            
            $stmt = $pdo->prepare("UPDATE clients SET nombre=?, telefono=?, status=? WHERE id=?");
            $result = $stmt->execute([
                $data['nombre'],
                $data['telefono'],
                $data['status'],
                $id
            ]);
            
            jsonResponse($result, null, $result ? 'Cliente actualizado correctamente' : 'Error al actualizar cliente');
            break;
            
        case 'delete':
            $id = $_GET['id'] ?? $_POST['id'];
            $stmt = $pdo->prepare("DELETE FROM clients WHERE id = ?");
            $result = $stmt->execute([$id]);
            
            jsonResponse($result, null, $result ? 'Cliente eliminado correctamente' : 'Error al eliminar cliente');
            break;
            
        case 'get':
            $id = $_GET['id'];
            $stmt = $pdo->prepare("SELECT * FROM clients WHERE id = ?");
            $stmt->execute([$id]);
            $client = $stmt->fetch();
            
            jsonResponse(!!$client, $client, $client ? 'Cliente encontrado' : 'Cliente no encontrado');
            break;
    }
}

// ==================== PUNTOS DE ACCESO ====================
function handleAccessPoints($action, $method) {
    $pdo = getConnection();
    
    switch($action) {
        case 'list':
            $stmt = $pdo->query("SELECT * FROM access_points ORDER BY created_at DESC");
            $accessPoints = $stmt->fetchAll();
            jsonResponse(true, $accessPoints, 'Puntos de acceso obtenidos correctamente');
            break;
            
        case 'create':
            $data = json_decode(file_get_contents('php://input'), true) ?: $_POST;
            
            $stmt = $pdo->prepare("INSERT INTO access_points (codigo, ubicacion, router_marca, router_modelo, router_ip, router_usuario, router_password, router_mac, capacidad_clientes, estado, notas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $result = $stmt->execute([
                $data['codigo'],
                $data['ubicacion'],
                $data['router_marca'] ?? 'Mikrotik',
                $data['router_modelo'],
                $data['router_ip'],
                $data['router_usuario'],
                $data['router_password'],
                $data['router_mac'] ?? null,
                $data['capacidad_clientes'] ?? 50,
                $data['estado'] ?? 'activo',
                $data['notas'] ?? null
            ]);
            
            if($result) {
                $accessPointId = $pdo->lastInsertId();
                jsonResponse(true, ['id' => $accessPointId], 'PUNTO DE ACCESO creado correctamente');
            } else {
                jsonResponse(false, null, 'Error al crear PUNTO DE ACCESO');
            }
            break;
            
        case 'update':
            $data = json_decode(file_get_contents('php://input'), true) ?: $_POST;
            $id = $data['id'];
            
            $stmt = $pdo->prepare("UPDATE access_points SET codigo=?, ubicacion=?, router_marca=?, router_modelo=?, router_ip=?, router_usuario=?, router_password=?, router_mac=?, capacidad_clientes=?, estado=?, notas=? WHERE id=?");
            $result = $stmt->execute([
                $data['codigo'],
                $data['ubicacion'],
                $data['router_marca'],
                $data['router_modelo'],
                $data['router_ip'],
                $data['router_usuario'],
                $data['router_password'],
                $data['router_mac'],
                $data['capacidad_clientes'],
                $data['estado'],
                $data['notas'],
                $id
            ]);
            
            jsonResponse($result, null, $result ? 'PUNTO DE ACCESO actualizado correctamente' : 'Error al actualizar PUNTO DE ACCESO');
            break;
            
        case 'delete':
            $id = $_GET['id'] ?? $_POST['id'];
            $stmt = $pdo->prepare("DELETE FROM access_points WHERE id = ?");
            $result = $stmt->execute([$id]);
            
            jsonResponse($result, null, $result ? 'PUNTO DE ACCESO eliminado correctamente' : 'Error al eliminar PUNTO DE ACCESO');
            break;
            
        case 'get':
            $id = $_GET['id'];
            $stmt = $pdo->prepare("SELECT * FROM access_points WHERE id = ?");
            $stmt->execute([$id]);
            $accessPoint = $stmt->fetch();
            
            jsonResponse(!!$accessPoint, $accessPoint, $accessPoint ? 'PUNTO DE ACCESO encontrado' : 'PUNTO DE ACCESO no encontrado');
            break;
    }
}

// ==================== INSTALACIONES ====================
function handleInstallations($action, $method) {
    $pdo = getConnection();
    
    switch($action) {
        case 'list':
            $stmt = $pdo->query("
                SELECT i.*, c.nombre as client_name, ap.codigo as access_point_codigo 
                FROM installations i 
                LEFT JOIN clients c ON i.client_id = c.id 
                LEFT JOIN access_points ap ON i.access_point_id = ap.id 
                ORDER BY i.created_at DESC
            ");
            $installations = $stmt->fetchAll();
            jsonResponse(true, $installations, 'Instalaciones obtenidas correctamente');
            break;
            
        case 'create':
            $data = $_POST; // Para manejar archivos
            
            // Manejar subida de fotos
            $fotos = [];
            if (isset($_FILES['fotos']) && $_FILES['fotos']['error'][0] !== UPLOAD_ERR_NO_FILE) {
                $uploadDir = 'uploads/installations/';
                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0777, true);
                }
                
                foreach ($_FILES['fotos']['tmp_name'] as $key => $tmpName) {
                    if ($_FILES['fotos']['error'][$key] === UPLOAD_ERR_OK) {
                        $fileName = uniqid() . '_' . $_FILES['fotos']['name'][$key];
                        $uploadPath = $uploadDir . $fileName;
                        
                        if (move_uploaded_file($tmpName, $uploadPath)) {
                            $fotos[] = $uploadPath;
                        }
                    }
                }
            }
            
            $stmt = $pdo->prepare("INSERT INTO installations (client_id, access_point_id, direccion, coordenadas, plan, precio_plan, dia_pago, router_marca, router_modelo, router_ip_local, router_mac, router_usuario, router_password, usuario_pppoe, clave_pppoe, clave_wifi, nombre_wifi, ip_publica, fecha_instalacion, estado, fotos_instalacion, notas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $result = $stmt->execute([
                $data['client_id'],
                $data['access_point_id'],
                $data['direccion'] ?? null,
                $data['coordenadas'] ?? null,
                $data['plan'],
                $data['precio_plan'],
                $data['dia_pago'],
                $data['router_marca'] ?? null,
                $data['router_modelo'] ?? null,
                $data['router_ip_local'] ?? null,
                $data['router_mac'],
                $data['router_usuario'] ?? null,
                $data['router_password'] ?? null,
                $data['usuario_pppoe'],
                $data['clave_pppoe'],
                $data['clave_wifi'],
                $data['nombre_wifi'] ?? null,
                $data['ip_publica'] ?? null,
                $data['fecha_instalacion'],
                $data['estado'] ?? 'pendiente',
                json_encode($fotos),
                $data['notas'] ?? null
            ]);
            
            if($result) {
                $installationId = $pdo->lastInsertId();
                jsonResponse(true, ['id' => $installationId], 'Instalación creada correctamente');
            } else {
                jsonResponse(false, null, 'Error al crear instalación');
            }
            break;
            
        case 'update':
            $data = $_POST; // Para manejar archivos
            $id = $data['id'];
            
            // Obtener fotos existentes
            $stmt = $pdo->prepare("SELECT fotos_instalacion FROM installations WHERE id = ?");
            $stmt->execute([$id]);
            $existing = $stmt->fetch();
            $existingFotos = json_decode($existing['fotos_instalacion'] ?? '[]', true);
            
            // Manejar nuevas fotos
            $fotos = $existingFotos;
            if (isset($_FILES['fotos']) && $_FILES['fotos']['error'][0] !== UPLOAD_ERR_NO_FILE) {
                $uploadDir = 'uploads/installations/';
                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0777, true);
                }
                
                foreach ($_FILES['fotos']['tmp_name'] as $key => $tmpName) {
                    if ($_FILES['fotos']['error'][$key] === UPLOAD_ERR_OK) {
                        $fileName = uniqid() . '_' . $_FILES['fotos']['name'][$key];
                        $uploadPath = $uploadDir . $fileName;
                        
                        if (move_uploaded_file($tmpName, $uploadPath)) {
                            $fotos[] = $uploadPath;
                        }
                    }
                }
            }
            
            $stmt = $pdo->prepare("UPDATE installations SET client_id=?, access_point_id=?, direccion=?, coordenadas=?, plan=?, precio_plan=?, dia_pago=?, router_marca=?, router_modelo=?, router_ip_local=?, router_mac=?, router_usuario=?, router_password=?, usuario_pppoe=?, clave_pppoe=?, clave_wifi=?, nombre_wifi=?, ip_publica=?, fecha_instalacion=?, estado=?, fotos_instalacion=?, notas=? WHERE id=?");
            $result = $stmt->execute([
                $data['client_id'],
                $data['access_point_id'],
                $data['direccion'] ?? null,
                $data['coordenadas'] ?? null,
                $data['plan'],
                $data['precio_plan'],
                $data['dia_pago'],
                $data['router_marca'] ?? null,
                $data['router_modelo'] ?? null,
                $data['router_ip_local'] ?? null,
                $data['router_mac'],
                $data['router_usuario'] ?? null,
                $data['router_password'] ?? null,
                $data['usuario_pppoe'],
                $data['clave_pppoe'],
                $data['clave_wifi'],
                $data['nombre_wifi'] ?? null,
                $data['ip_publica'] ?? null,
                $data['fecha_instalacion'],
                $data['estado'],
                json_encode($fotos),
                $data['notas'] ?? null,
                $id
            ]);
            
            jsonResponse($result, null, $result ? 'Instalación actualizada correctamente' : 'Error al actualizar instalación');
            break;
            
        case 'get':
            $id = $_GET['id'] ?? $_POST['id'];
            $stmt = $pdo->prepare("
                SELECT i.*, c.nombre as client_name, ap.codigo as access_point_codigo 
                FROM installations i 
                LEFT JOIN clients c ON i.client_id = c.id 
                LEFT JOIN access_points ap ON i.access_point_id = ap.id 
                WHERE i.id = ?
            ");
            $stmt->execute([$id]);
            $installation = $stmt->fetch();
            
            jsonResponse(!!$installation, $installation, $installation ? 'Instalación encontrada' : 'Instalación no encontrada');
            break;
            
        case 'delete':
            $id = $_GET['id'] ?? $_POST['id'];
            $stmt = $pdo->prepare("DELETE FROM installations WHERE id = ?");
            $result = $stmt->execute([$id]);
            
            jsonResponse($result, null, $result ? 'Instalación eliminada correctamente' : 'Error al eliminar instalación');
            break;
    }
}

// ==================== PAGOS ====================
function handlePayments($action, $method) {
    $pdo = getConnection();
    
    switch($action) {
        case 'list':
            $stmt = $pdo->query("
                SELECT p.*, c.nombre as client_name 
                FROM payments p 
                LEFT JOIN installations i ON p.installation_id = i.id
                LEFT JOIN clients c ON i.client_id = c.id 
                ORDER BY p.fecha_pago DESC
            ");
            $payments = $stmt->fetchAll();
            jsonResponse(true, $payments, 'Pagos obtenidos correctamente');
            break;
            
        case 'create':
            $data = json_decode(file_get_contents('php://input'), true) ?: $_POST;
            
            $stmt = $pdo->prepare("INSERT INTO payments (installation_id, monto, fecha_pago, metodo_pago, estado, mes_correspondiente, fecha_vencimiento, notas) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $result = $stmt->execute([
                $data['installation_id'],
                $data['monto'],
                $data['fecha_pago'],
                $data['metodo_pago'],
                $data['estado'] ?? 'pagado',
                $data['mes_correspondiente'],
                $data['fecha_vencimiento'],
                $data['notas'] ?? ''
            ]);
            
            if($result) {
                $paymentId = $pdo->lastInsertId();
                jsonResponse(true, ['id' => $paymentId], 'Pago registrado correctamente');
            } else {
                jsonResponse(false, null, 'Error al registrar pago');
            }
            break;
    }
}

// ==================== FACTURAS ====================
function handleInvoices($action, $method) {
    $pdo = getConnection();
    
    switch($action) {
        case 'list':
            $stmt = $pdo->query("
                SELECT inv.*, c.nombre as client_name 
                FROM invoices inv 
                LEFT JOIN installations i ON inv.installation_id = i.id
                LEFT JOIN clients c ON i.client_id = c.id 
                ORDER BY inv.created_at DESC
            ");
            $invoices = $stmt->fetchAll();
            jsonResponse(true, $invoices, 'Facturas obtenidas correctamente');
            break;
            
        case 'create':
            $data = json_decode(file_get_contents('php://input'), true) ?: $_POST;
            
            // Generar número de factura
            $stmt = $pdo->query("SELECT COUNT(*) as count FROM invoices");
            $count = $stmt->fetch()['count'];
            $invoiceNumber = 'INV-' . date('Y') . '-' . str_pad($count + 1, 4, '0', STR_PAD_LEFT);
            
            $stmt = $pdo->prepare("INSERT INTO invoices (numero_factura, installation_id, monto, fecha_emision, fecha_vencimiento, estado, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $result = $stmt->execute([
                $invoiceNumber,
                $data['installation_id'],
                $data['monto'],
                $data['fecha_emision'],
                $data['fecha_vencimiento'],
                $data['estado'] ?? 'pendiente',
                $data['descripcion'] ?? ''
            ]);
            
            if($result) {
                $invoiceId = $pdo->lastInsertId();
                jsonResponse(true, ['id' => $invoiceId, 'numero_factura' => $invoiceNumber], 'Factura creada correctamente');
            } else {
                jsonResponse(false, null, 'Error al crear factura');
            }
            break;
    }
}

// ==================== DASHBOARD ====================
function handleDashboard($action, $method) {
    $pdo = getConnection();
    
    switch($action) {
        case 'stats':
            // Estadísticas generales
            $stats = [];
            
            // Total clientes
            $stmt = $pdo->query("SELECT COUNT(*) as count FROM clients WHERE status = 'active'");
            $stats['total_clients'] = $stmt->fetch()['count'];
            
            // Total puntos de acceso
            $stmt = $pdo->query("SELECT COUNT(*) as count FROM access_points WHERE estado = 'activo'");
            $stats['total_access_points'] = $stmt->fetch()['count'];
            
            // Total instalaciones
            $stmt = $pdo->query("SELECT COUNT(*) as count FROM installations");
            $stats['total_installations'] = $stmt->fetch()['count'];
            
            // Ingresos mensuales proyectados
            $stmt = $pdo->query("SELECT SUM(precio_plan) as total FROM installations WHERE estado = 'instalado_completo'");
            $stats['monthly_revenue'] = $stmt->fetch()['total'] ?? 0;
            
            jsonResponse(true, $stats, 'Estadísticas obtenidas correctamente');
            break;
            
        case 'recent_activity':
            // Actividad reciente
            $activities = [];
            
            // Últimos clientes
            $stmt = $pdo->query("SELECT nombre, created_at FROM clients ORDER BY created_at DESC LIMIT 5");
            $recent_clients = $stmt->fetchAll();
            
            // Últimas instalaciones
            $stmt = $pdo->query("SELECT i.created_at, c.nombre as client_name FROM installations i LEFT JOIN clients c ON i.client_id = c.id ORDER BY i.created_at DESC LIMIT 5");
            $recent_installations = $stmt->fetchAll();
            
            $activities = [
                'recent_clients' => $recent_clients,
                'recent_installations' => $recent_installations
            ];
            
            jsonResponse(true, $activities, 'Actividad reciente obtenida correctamente');
            break;
    }
}

// ==================== WHATSAPP ====================
function handleWhatsApp($action, $method) {
    switch($action) {
        case 'send_reminder':
            $data = json_decode(file_get_contents('php://input'), true) ?: $_POST;
            
            $phone = $data['phone'];
            $message = $data['message'];
            
            // Limpiar número de teléfono
            $phone = preg_replace('/[^0-9]/', '', $phone);
            if(substr($phone, 0, 1) !== '5') {
                $phone = '52' . $phone; // Agregar código de país México
            }
            
            // URL de WhatsApp
            $whatsapp_url = "https://api.whatsapp.com/send?phone=" . $phone . "&text=" . urlencode($message);
            
            jsonResponse(true, ['url' => $whatsapp_url], 'URL de WhatsApp generada correctamente');
            break;
    }
}

// Manejar errores no capturados
function handleError($errno, $errstr, $errfile, $errline) {
    http_response_code(500);
    jsonResponse(false, null, 'Error interno del servidor');
}

set_error_handler('handleError');
?>
