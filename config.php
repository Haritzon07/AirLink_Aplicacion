<?php
// Prevenir acceso directo
if (!defined('SECURE_ACCESS')) {
    die('Acceso denegado');
}

// Configuración de la base de datos
define('DB_HOST', 'localhost');
define('DB_NAME', 'internet_management');
define('DB_USER', 'root'); // Cambia por tu usuario
define('DB_PASS', ''); // Cambia por tu contraseña

// Configuración de la aplicación
define('APP_NAME', 'Sistema de Gestión de Internet');
define('APP_VERSION', '2.0');

// Configuración de archivos
define('UPLOAD_DIR', 'uploads/');
define('UPLOAD_MAX_SIZE', 5 * 1024 * 1024); // 5MB
define('ALLOWED_IMAGE_TYPES', ['jpg', 'jpeg', 'png', 'gif']);
define('ALLOWED_DOCUMENT_TYPES', ['pdf', 'doc', 'docx']);
define('MAX_FILE_SIZE', 5 * 1024 * 1024); // 5MB

// Configuración de WhatsApp
define('WHATSAPP_API_URL', 'https://api.whatsapp.com/send');

// Configuración de zona horaria
date_default_timezone_set('America/Mexico_City');

// Configuración de errores (cambiar en producción)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Headers de seguridad
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// Crear directorio de uploads si no existe
if (!file_exists(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0755, true);
    mkdir(UPLOAD_DIR . 'documents/', 0755, true);
    mkdir(UPLOAD_DIR . 'photos/', 0755, true);
}
?>
