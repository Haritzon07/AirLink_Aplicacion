-- Base de datos actualizada con las modificaciones
CREATE DATABASE IF NOT EXISTS internet_management;
USE internet_management;

-- Tabla de clientes simplificada
CREATE TABLE IF NOT EXISTS clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de puntos de acceso (antes antenas)
CREATE TABLE IF NOT EXISTS access_points (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    ubicacion VARCHAR(255) NOT NULL,
    router_marca VARCHAR(100) DEFAULT 'Mikrotik',
    router_modelo VARCHAR(100),
    router_ip VARCHAR(15),
    router_usuario VARCHAR(50),
    router_password VARCHAR(100),
    router_mac VARCHAR(17),
    capacidad_clientes INT DEFAULT 50,
    estado ENUM('activo', 'mantenimiento', 'inactivo') DEFAULT 'activo',
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de instalaciones actualizada
CREATE TABLE IF NOT EXISTS installations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    access_point_id INT NOT NULL,
    direccion TEXT,
    coordenadas VARCHAR(100),
    plan ENUM('4_megas', '5_megas') NOT NULL,
    precio_plan DECIMAL(10,2) NOT NULL,
    dia_pago INT NOT NULL CHECK (dia_pago >= 1 AND dia_pago <= 31),
    
    -- Datos del router del cliente
    router_marca VARCHAR(100),
    router_modelo VARCHAR(100),
    router_ip_local VARCHAR(15),
    router_mac VARCHAR(17) NOT NULL,
    router_usuario VARCHAR(50),
    router_password VARCHAR(100),
    
    -- Configuración de conexión
    usuario_pppoe VARCHAR(100) NOT NULL,
    clave_pppoe VARCHAR(100) NOT NULL,
    clave_wifi VARCHAR(100) NOT NULL,
    nombre_wifi VARCHAR(100),
    ip_publica VARCHAR(15),
    
    fecha_instalacion DATE NOT NULL,
    estado ENUM('pendiente', 'instalado_completo', 'presenta_fallas', 'suspendido') DEFAULT 'pendiente',
    fotos_instalacion JSON,
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (access_point_id) REFERENCES access_points(id) ON DELETE RESTRICT
);

-- Tabla de pagos (actualizada para relacionar con instalaciones)
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    installation_id INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha_pago DATE NOT NULL,
    metodo_pago ENUM('efectivo', 'transferencia', 'tarjeta') NOT NULL,
    estado ENUM('pendiente', 'pagado', 'vencido') DEFAULT 'pendiente',
    mes_correspondiente VARCHAR(7) NOT NULL, -- YYYY-MM
    fecha_vencimiento DATE NOT NULL,
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (installation_id) REFERENCES installations(id) ON DELETE CASCADE
);

-- Tabla de facturas (actualizada)
CREATE TABLE IF NOT EXISTS invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_factura VARCHAR(50) UNIQUE NOT NULL,
    installation_id INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha_emision DATE NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    estado ENUM('pendiente', 'pagada', 'vencida') DEFAULT 'pendiente',
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (installation_id) REFERENCES installations(id) ON DELETE CASCADE
);

-- Insertar datos de ejemplo
INSERT INTO clients (nombre, telefono) VALUES
('Juan Pérez', '5551234567'),
('María González', '5559876543'),
('Carlos Rodríguez', '5551122334'),
('Ana López', '5554455667'),
('Luis Martínez', '5557788990');

INSERT INTO access_points (codigo, ubicacion, router_modelo, router_ip, router_usuario, router_password, capacidad_clientes) VALUES
('AP-001', 'Sector Norte - Torre Principal', 'hAP ac²', '192.168.1.10', 'admin', 'admin123', 80),
('AP-002', 'Sector Sur - Edificio Central', 'hAP ac³', '192.168.1.11', 'admin', 'admin123', 60),
('AP-003', 'Sector Este - Casa Comunal', 'hAP lite', '192.168.1.12', 'admin', 'admin123', 40),
('AP-004', 'Sector Oeste - Plaza Principal', 'hAP ac²', '192.168.1.13', 'admin', 'admin123', 50);

INSERT INTO installations (client_id, access_point_id, direccion, plan, precio_plan, dia_pago, router_marca, router_modelo, router_mac, usuario_pppoe, clave_pppoe, clave_wifi, nombre_wifi, fecha_instalacion, estado) VALUES
(1, 1, 'Calle Principal #123', '5_megas', 25.00, 15, 'TP-Link', 'Archer C20', '00:11:22:33:44:55', 'juan_perez_ppp', 'pass123', 'wifi123', 'Internet_Juan', '2024-01-15', 'instalado_completo'),
(2, 2, 'Avenida Central #456', '4_megas', 20.00, 10, 'TP-Link', 'Archer C6', '00:11:22:33:44:56', 'maria_gonzalez_ppp', 'pass456', 'wifi456', 'Internet_Maria', '2024-01-20', 'instalado_completo'),
(3, 1, 'Barrio Nuevo #789', '5_megas', 25.00, 5, 'Mercusys', 'AC12G', '00:11:22:33:44:57', 'carlos_rodriguez_ppp', 'pass789', 'wifi789', 'Internet_Carlos', '2024-01-25', 'pendiente'),
(4, 3, 'Calle Secundaria #321', '4_megas', 20.00, 20, 'TP-Link', 'Archer C20', '00:11:22:33:44:58', 'ana_lopez_ppp', 'pass321', 'wifi321', 'Internet_Ana', '2024-02-01', 'instalado_completo'),
(5, 4, 'Avenida Norte #654', '5_megas', 25.00, 25, 'TP-Link', 'Archer C6', '00:11:22:33:44:59', 'luis_martinez_ppp', 'pass654', 'wifi654', 'Internet_Luis', '2024-02-05', 'presenta_fallas');
