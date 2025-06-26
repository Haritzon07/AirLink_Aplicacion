-- Crear base de datos
CREATE DATABASE IF NOT EXISTS internet_management;
USE internet_management;

-- Tabla de antenas Starlink
CREATE TABLE IF NOT EXISTS starlink_antennas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(200) NOT NULL,
    status ENUM('active', 'inactive', 'maintenance') DEFAULT 'active',
    installation_date DATE,
    coverage_area TEXT,
    max_capacity INT DEFAULT 50,
    signal_strength INT DEFAULT 90,
    connected_clients INT DEFAULT 0,
    last_maintenance DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS clients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    address TEXT NOT NULL,
    antenna_id INT,
    monthly_fee DECIMAL(10,2) NOT NULL,
    payment_day INT NOT NULL,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    registration_date DATE DEFAULT (CURRENT_DATE),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (antenna_id) REFERENCES starlink_antennas(id)
);

-- Tabla de instalaciones
CREATE TABLE IF NOT EXISTS installations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT NOT NULL,
    antenna_id INT NOT NULL,
    installation_date DATE NOT NULL,
    technician_name VARCHAR(100),
    equipment_details TEXT,
    installation_cost DECIMAL(10,2),
    status ENUM('completed', 'pending', 'cancelled') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (antenna_id) REFERENCES starlink_antennas(id)
);

-- Tabla de pagos
CREATE TABLE IF NOT EXISTS payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE,
    due_date DATE NOT NULL,
    payment_method ENUM('cash', 'transfer', 'card') DEFAULT 'cash',
    status ENUM('paid', 'pending', 'overdue') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Tabla de facturas
CREATE TABLE IF NOT EXISTS invoices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    client_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    status ENUM('paid', 'pending', 'overdue') DEFAULT 'pending',
    description TEXT,
    payment_method ENUM('cash', 'transfer', 'card'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Tabla de notificaciones
CREATE TABLE IF NOT EXISTS payment_notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT NOT NULL,
    payment_id INT,
    notification_type ENUM('payment_reminder', 'due_today', 'final_warning') NOT NULL,
    sent_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    whatsapp_status ENUM('sent', 'delivered', 'failed') DEFAULT 'sent',
    message_content TEXT,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE
);

-- Insertar datos de ejemplo
INSERT INTO starlink_antennas (name, location, status, installation_date, coverage_area, max_capacity, signal_strength, connected_clients, last_maintenance) VALUES
('Antena Norte', 'Sector Norte - Calle Principal', 'active', '2024-01-15', 'Barrios: El Prado, Los Alamos, Villa Norte', 50, 95, 2, '2024-11-01'),
('Antena Sur', 'Sector Sur - Avenida Central', 'active', '2024-02-01', 'Barrios: San José, La Esperanza, Villa Sur', 50, 88, 1, '2024-10-15'),
('Antena Este', 'Sector Este - Plaza Mayor', 'active', '2024-02-15', 'Barrios: El Mirador, Las Flores, Zona Este', 50, 92, 1, '2024-11-10'),
('Antena Oeste', 'Sector Oeste - Terminal', 'maintenance', '2024-03-01', 'Barrios: El Bosque, La Colina, Sector Oeste', 50, 75, 1, '2024-12-01');

INSERT INTO clients (name, phone, email, address, antenna_id, monthly_fee, payment_day, status) VALUES
('Juan Pérez', '+57 300 123 4567', 'juan.perez@email.com', 'Calle 10 #15-20, Barrio El Prado', 1, 45000.00, 5, 'active'),
('María González', '+57 301 234 5678', 'maria.gonzalez@email.com', 'Carrera 8 #25-30, Barrio San José', 2, 45000.00, 10, 'active'),
('Carlos Rodríguez', '+57 302 345 6789', 'carlos.rodriguez@email.com', 'Calle 15 #8-12, Barrio El Mirador', 3, 50000.00, 15, 'active'),
('Ana Martínez', '+57 303 456 7890', 'ana.martinez@email.com', 'Avenida 5 #20-25, Barrio El Bosque', 4, 45000.00, 20, 'suspended'),
('Luis Hernández', '+57 304 567 8901', 'luis.hernandez@email.com', 'Calle 12 #18-22, Barrio Los Alamos', 1, 45000.00, 25, 'active');

INSERT INTO payments (client_id, amount, payment_date, due_date, payment_method, status) VALUES
(1, 45000.00, '2024-12-05', '2024-12-05', 'cash', 'paid'),
(2, 45000.00, NULL, '2024-12-10', NULL, 'pending'),
(3, 50000.00, NULL, '2024-12-15', NULL, 'overdue'),
(4, 45000.00, NULL, '2024-12-20', NULL, 'pending'),
(5, 45000.00, NULL, '2024-12-25', NULL, 'pending');

INSERT INTO invoices (invoice_number, client_id, amount, issue_date, due_date, status, description) VALUES
('FAC-2024-001', 1, 45000.00, '2024-12-01', '2024-12-05', 'paid', 'Servicio de Internet - Diciembre 2024'),
('FAC-2024-002', 2, 45000.00, '2024-12-01', '2024-12-10', 'pending', 'Servicio de Internet - Diciembre 2024'),
('FAC-2024-003', 3, 50000.00, '2024-12-01', '2024-12-15', 'overdue', 'Servicio de Internet Premium - Diciembre 2024');
