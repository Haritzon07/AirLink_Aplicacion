CREATE DATABASE IF NOT EXISTS internet_management;
USE internet_management;

-- Tabla de antenas Starlink
CREATE TABLE starlink_antennas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    location TEXT NOT NULL,
    status ENUM('active', 'maintenance', 'inactive') DEFAULT 'active',
    installation_date DATE NOT NULL,
    coverage_area TEXT,
    max_capacity INT DEFAULT 50,
    connected_clients INT DEFAULT 0,
    signal_strength INT DEFAULT 90,
    last_maintenance DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de clientes
CREATE TABLE clients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    address TEXT NOT NULL,
    cedula VARCHAR(20) NOT NULL,
    antenna_id INT,
    monthly_fee DECIMAL(10,2) NOT NULL,
    payment_day INT NOT NULL CHECK (payment_day BETWEEN 1 AND 31),
    status ENUM('active', 'suspended', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (antenna_id) REFERENCES starlink_antennas(id)
);

-- Tabla de instalaciones
CREATE TABLE installations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT NOT NULL,
    antenna_id INT NOT NULL,
    plan VARCHAR(50) NOT NULL,
    pppoe_user VARCHAR(50) NOT NULL,
    installation_date DATE NOT NULL,
    technician_name VARCHAR(100) NOT NULL,
    equipment_details TEXT,
    installation_cost DECIMAL(10,2) NOT NULL,
    monthly_fee DECIMAL(10,2) NOT NULL,
    payment_day INT NOT NULL,
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
    notes TEXT,
    hotspot_enabled BOOLEAN DEFAULT FALSE,
    hotspot_user VARCHAR(50),
    hotspot_password VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (antenna_id) REFERENCES starlink_antennas(id)
);

-- Tabla de pagos
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    amount_ves DECIMAL(15,2),
    currency ENUM('USD', 'VES') DEFAULT 'USD',
    payment_date DATE,
    due_date DATE NOT NULL,
    payment_method ENUM('cash', 'transfer', 'mobile_payment', 'dollars') DEFAULT 'cash',
    bank VARCHAR(50),
    reference VARCHAR(100),
    status ENUM('pending', 'paid', 'overdue', 'rejected') DEFAULT 'pending',
    notes TEXT,
    bcv_rate DECIMAL(8,2),
    photo_path VARCHAR(255),
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Tabla de facturas
CREATE TABLE invoices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    client_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,
    description TEXT,
    status ENUM('pending', 'paid', 'overdue', 'cancelled') DEFAULT 'pending',
    payment_method ENUM('cash', 'transfer', 'mobile_payment', 'dollars'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Tabla de configuración del sistema
CREATE TABLE system_config (
    id INT PRIMARY KEY AUTO_INCREMENT,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de bancos
CREATE TABLE banks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de métodos de pago
CREATE TABLE payment_methods (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    type ENUM('cash', 'transfer', 'mobile', 'digital') NOT NULL,
    currency ENUM('USD', 'VES') NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
