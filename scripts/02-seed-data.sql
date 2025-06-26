-- Insertar antenas iniciales
INSERT INTO starlink_antennas (name, location, installation_date, coverage_area, max_capacity, connected_clients, signal_strength, last_maintenance) VALUES
('Antena Norte', 'Sector Norte - Calle Principal', '2024-01-15', 'Barrios: El Prado, Los Alamos, Villa Norte', 50, 2, 95, '2024-11-01'),
('Antena Sur', 'Sector Sur - Avenida Central', '2024-02-01', 'Barrios: San José, La Esperanza, Villa Sur', 50, 1, 88, '2024-10-15'),
('Antena Este', 'Sector Este - Plaza Mayor', '2024-02-15', 'Barrios: El Mirador, Las Flores, Zona Este', 50, 1, 92, '2024-11-10'),
('Antena Oeste', 'Sector Oeste - Terminal', '2024-03-01', 'Barrios: El Bosque, La Colina, Sector Oeste', 50, 1, 75, '2024-12-01');

-- Insertar clientes de ejemplo
INSERT INTO clients (name, phone, email, address, cedula, antenna_id, monthly_fee, payment_day) VALUES
('Juan Pérez', '+58 414 123 4567', 'juan.perez@email.com', 'Calle 10 #15-20, Barrio El Prado', '12345678', 1, 25.00, 5),
('María González', '+58 424 234 5678', 'maria.gonzalez@email.com', 'Carrera 8 #25-30, Barrio San José', '87654321', 2, 25.00, 10),
('Carlos Rodríguez', '+58 412 345 6789', 'carlos.rodriguez@email.com', 'Calle 15 #8-12, Barrio El Mirador', '45678912', 3, 30.00, 15),
('Ana Martínez', '+58 426 456 7890', 'ana.martinez@email.com', 'Avenida 5 #20-25, Barrio El Bosque', '78912345', 4, 25.00, 20),
('Luis Hernández', '+58 416 567 8901', 'luis.hernandez@email.com', 'Calle 12 #18-22, Villa Norte', '23456789', 1, 25.00, 25);

-- Insertar configuración del sistema
INSERT INTO system_config (config_key, config_value, description) VALUES
('bcv_rate', '36.50', 'Tasa de cambio BCV (Bolívares por USD)'),
('default_currency', 'USD', 'Moneda por defecto del sistema'),
('invoice_currency', 'USD', 'Moneda para facturas'),
('allow_payment_in_ves', 'true', 'Permitir pagos en Bolívares'),
('auto_update_bcv', 'false', 'Actualización automática de tasa BCV'),
('company_name', 'Internet Service Provider', 'Nombre de la empresa'),
('company_rif', 'J-12345678-9', 'RIF de la empresa'),
('company_address', 'Av. Principal, Caracas, Venezuela', 'Dirección de la empresa'),
('company_phone', '+58 212 123 4567', 'Teléfono de la empresa'),
('company_email', 'contacto@internetservice.com', 'Email de la empresa');

-- Insertar bancos venezolanos
INSERT INTO banks (name, code, active) VALUES
('Banesco', '0134', TRUE),
('Banco de Venezuela', '0102', TRUE),
('Banco Mercantil', '0105', TRUE),
('Banco Provincial', '0108', TRUE),
('Banco Bicentenario', '0175', TRUE),
('Banco del Tesoro', '0163', FALSE),
('Banco Exterior', '0115', TRUE),
('100% Banco', '0156', FALSE);

-- Insertar métodos de pago
INSERT INTO payment_methods (name, type, currency, active) VALUES
('Efectivo USD', 'cash', 'USD', TRUE),
('Efectivo VES', 'cash', 'VES', TRUE),
('Transferencia Bancaria', 'transfer', 'VES', TRUE),
('Pago Móvil', 'mobile', 'VES', TRUE),
('Zelle', 'digital', 'USD', TRUE),
('PayPal', 'digital', 'USD', FALSE);

-- Insertar instalaciones de ejemplo
INSERT INTO installations (client_id, antenna_id, plan, pppoe_user, installation_date, technician_name, equipment_details, installation_cost, monthly_fee, payment_day, status, notes, hotspot_enabled, hotspot_user, hotspot_password) VALUES
(1, 1, 'Plan 5 Megas', 'AN1', '2024-01-20', 'Técnico Roberto', 'Router TP-Link, Cable UTP 50m, Antena receptora', 80000, 25.00, 5, 'completed', 'Instalación exitosa, cliente satisfecho', TRUE, 'hotspot_juan', 'pass123'),
(2, 2, 'Plan 4 Megas', 'AS1', '2024-02-05', 'Técnico Miguel', 'Router TP-Link, Cable UTP 30m, Antena receptora', 75000, 25.00, 10, 'completed', 'Instalación completada sin inconvenientes', FALSE, '', ''),
(3, 3, 'Plan 5 Megas', 'AE1', '2024-02-20', 'Técnico Roberto', 'Router TP-Link Premium, Cable UTP 40m, Antena receptora', 85000, 30.00, 15, 'completed', 'Cliente requirió router premium por mayor cobertura', TRUE, 'hotspot_carlos', 'pass456');

-- Insertar facturas de ejemplo
INSERT INTO invoices (invoice_number, client_id, amount, issue_date, due_date, billing_period_start, billing_period_end, description, status) VALUES
('FAC-2024-001', 1, 25.00, '2024-12-01', '2024-12-06', '2024-11-05', '2024-12-04', 'Servicio de Internet - Período: 05/11/2024 al 04/12/2024', 'paid'),
('FAC-2024-002', 2, 25.00, '2024-12-01', '2024-12-11', '2024-11-10', '2024-12-09', 'Servicio de Internet - Período: 10/11/2024 al 09/12/2024', 'pending'),
('FAC-2024-003', 3, 30.00, '2024-11-01', '2024-11-16', '2024-10-15', '2024-11-14', 'Servicio de Internet - Período: 15/10/2024 al 14/11/2024', 'overdue');

-- Insertar pagos de ejemplo
INSERT INTO payments (client_id, amount, amount_ves, currency, payment_date, due_date, payment_method, reference, status, bcv_rate) VALUES
(1, 25.00, 912.50, 'USD', '2024-12-05', '2024-12-06', 'cash', 'REF001', 'paid', 36.50),
(2, 15.00, 547.50, 'VES', '2024-12-10', '2024-12-11', 'transfer', 'REF002', 'paid', 36.50),
(3, 30.00, 1095.00, 'USD', NULL, '2024-11-16', 'cash', '', 'overdue', 36.50);
