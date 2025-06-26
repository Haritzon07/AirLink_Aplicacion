# Sistema de Gestión de Internet

Sistema completo para la gestión de un negocio de internet con antenas Starlink, desarrollado en HTML, CSS, JavaScript, PHP y MySQL.

## Características

### 🎯 Funcionalidades Principales

- **Dashboard**: Métricas en tiempo real y gráficos de ingresos
- **Gestión de Clientes**: CRUD completo con búsqueda y filtros
- **Gestión de Pagos**: Control de pagos mensuales con recordatorios automáticos
- **Días de Pago**: Calendario organizado por días de cobro
- **Facturas**: Generación automática con numeración consecutiva
- **Instalaciones**: Control de instalaciones programadas y completadas
- **Antenas Starlink**: Monitoreo de 4 antenas con métricas en tiempo real

### 📱 Características Técnicas

- **Responsive Design**: Funciona perfectamente en móviles, tablets y desktop
- **Sidebar Navigation**: Navegación lateral moderna y intuitiva
- **API REST**: Backend PHP con endpoints organizados
- **Base de Datos MySQL**: Estructura normalizada y optimizada
- **Notificaciones WhatsApp**: Integración directa para recordatorios
- **Modales Interactivos**: Formularios dinámicos y user-friendly

## Instalación

### Requisitos

- PHP 7.4 o superior
- MySQL 5.7 o superior
- Servidor web (Apache/Nginx)
- Extensiones PHP: PDO, PDO_MySQL

### Pasos de Instalación

1. **Clonar/Descargar el proyecto**
   \`\`\`bash
   git clone [url-del-proyecto]
   cd internet-management-system
   \`\`\`

2. **Configurar la base de datos**
   - Crear una base de datos MySQL
   - Ejecutar el script `database/schema.sql`
   - Configurar credenciales en `config/database.php`

3. **Configurar el servidor web**
   - Apuntar el document root a la carpeta del proyecto
   - Asegurar que PHP tenga permisos de escritura

4. **Configurar la base de datos**
   \`\`\`php
   // config/database.php
   private $host = "localhost";
   private $db_name = "internet_management";
   private $username = "tu_usuario";
   private $password = "tu_contraseña";
   \`\`\`

5. **Acceder al sistema**
   - Abrir `index.html` en el navegador
   - El sistema cargará con datos de ejemplo

## Estructura del Proyecto

\`\`\`
internet-management-system/
├── index.html                 # Página principal
├── config/
│   └── database.php          # Configuración de base de datos
├── database/
│   └── schema.sql            # Estructura y datos de ejemplo
├── api/
│   ├── clients.php           # API de clientes
│   ├── payments.php          # API de pagos
│   ├── invoices.php          # API de facturas
│   ├── antennas.php          # API de antenas
│   └── installations.php     # API de instalaciones
├── assets/
│   ├── css/
│   │   └── styles.css        # Estilos principales
│   └── js/
│       ├── app.js            # Lógica principal
│       ├── api.js            # Funciones de API
│       └── utils.js          # Utilidades
└── README.md
\`\`\`

## Uso del Sistema

### Dashboard
- **Métricas en tiempo real**: Clientes totales, antenas activas, ingresos mensuales
- **Acciones rápidas**: Envío masivo de recordatorios de pago
- **Actividad reciente**: Últimos pagos y movimientos

### Gestión de Clientes
- **Agregar cliente**: Formulario completo con validaciones
- **Flujo post-creación**: Opciones para agregar pago o programar instalación
- **Búsqueda avanzada**: Por nombre, teléfono o dirección
- **Integración WhatsApp**: Envío directo de mensajes

### Días de Pago
- **Vista calendario**: Clientes organizados por día de cobro (1-31)
- **Estados visuales**: Vence hoy, vencido, próximo, al día
- **Recordatorios masivos**: Por día o por estado de pago
- **Métricas del mes**: Ingresos esperados y clientes por día

### Facturas
- **Numeración automática**: FAC-YYYY-XXX
- **Vista previa**: Detalles completos del cliente y factura
- **Descarga e impresión**: Formatos listos para usar
- **Control de pagos**: Marcar como pagada con método

### Instalaciones
- **Programación**: Asignación de técnicos y fechas
- **Control de equipos**: Detalles de router, cables, antenas
- **Estados**: Pendiente, completada, cancelada
- **Costos**: Control de costos de instalación

### Antenas Starlink
- **Monitoreo en tiempo real**: Señal, capacidad, clientes conectados
- **Estados**: Activa, mantenimiento, inactiva
- **Métricas visuales**: Barras de progreso y colores intuitivos
- **Control de mantenimiento**: Fechas y estados

## API Endpoints

### Clientes
- `GET /api/clients.php` - Obtener todos los clientes
- `POST /api/clients.php` - Crear nuevo cliente
- `PUT /api/clients.php` - Actualizar cliente
- `DELETE /api/clients.php` - Eliminar cliente

### Pagos
- `GET /api/payments.php` - Obtener todos los pagos
- `POST /api/payments.php` - Registrar nuevo pago
- `PUT /api/payments.php` - Actualizar pago
- `DELETE /api/payments.php` - Eliminar pago

### Facturas
- `GET /api/invoices.php` - Obtener todas las facturas
- `POST /api/invoices.php` - Crear nueva factura
- `PUT /api/invoices.php` - Actualizar factura
- `DELETE /api/invoices.php` - Eliminar factura

### Antenas
- `GET /api/antennas.php` - Obtener todas las antenas
- `POST /api/antennas.php` - Crear nueva antena
- `PUT /api/antennas.php` - Actualizar antena
- `DELETE /api/antennas.php` - Eliminar antena

### Instalaciones
- `GET /api/installations.php` - Obtener todas las instalaciones
- `POST /api/installations.php` - Programar nueva instalación
- `PUT /api/installations.php` - Actualizar instalación
- `DELETE /api/installations.php` - Eliminar instalación

## Personalización

### Colores y Estilos
Editar `assets/css/styles.css` para cambiar:
- Colores del tema
- Tipografía
- Espaciados
- Efectos visuales

### Datos de la Empresa
Modificar en `assets/js/utils.js`:
- Información de contacto
- Logo de la empresa
- Datos para facturas

### Mensajes de WhatsApp
Personalizar en `assets/js/app.js`:
- Plantillas de recordatorios
- Mensajes de bienvenida
- Avisos de vencimiento

## Seguridad

### Recomendaciones
- Cambiar credenciales de base de datos
- Implementar autenticación de usuarios
- Usar HTTPS en producción
- Validar todas las entradas del usuario
- Implementar rate limiting en APIs

### Validaciones
- Validación client-side y server-side
- Sanitización de datos
- Protección contra SQL injection
- Validación de tipos de archivo

## Soporte

### Problemas Comunes

1. **Error de conexión a base de datos**
   - Verificar credenciales en `config/database.php`
   - Asegurar que MySQL esté ejecutándose

2. **APIs no funcionan**
   - Verificar permisos de archivos PHP
   - Revisar logs de error del servidor

3. **Estilos no cargan**
   - Verificar rutas de archivos CSS
   - Limpiar caché del navegador

### Logs
- Errores PHP: `/var/log/apache2/error.log`
- Errores JavaScript: Consola del navegador
- Errores MySQL: `/var/log/mysql/error.log`

## Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo LICENSE para más detalles.

## Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crear una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abrir un Pull Request

## Contacto

Para soporte técnico o consultas:
- Email: soporte@internetmanager.com
- Teléfono: +57 300 123 4567
\`\`\`

¡Perfecto! He convertido completamente la aplicación React/Next.js a una versión **HTML, CSS, JavaScript, PHP y MySQL** totalmente funcional. 

## 🎯 **Lo que incluye esta conversión:**

### **📁 Estructura Completa:**
- **Frontend**: HTML5 + CSS3 + JavaScript vanilla
- **Backend**: PHP 7.4+ con APIs REST
- **Base de datos**: MySQL con estructura normalizada
- **Configuración**: Sistema de configuración modular

### **🚀 Características Implementadas:**

#### **1. Frontend Moderno (HTML/CSS/JS)**
- ✅ **Sidebar responsive** con navegación móvil
- ✅ **Diseño moderno** con gradientes y efectos
- ✅ **Modales interactivos** para formularios
- ✅ **Notificaciones toast** para feedback
- ✅ **Loading spinners** para mejor UX
- ✅ **Validación de formularios** en tiempo real

#### **2. Backend Robusto (PHP/MySQL)**
- ✅ **APIs REST completas** para todas las entidades
- ✅ **Manejo de errores** profesional
- ✅ **Validación server-side** de datos
- ✅ **Conexión PDO** segura a MySQL
- ✅ **CORS habilitado** para desarrollo

#### **3. Base de Datos Optimizada**
- ✅ **Estructura normalizada** con relaciones
- ✅ **Datos de ejemplo** para testing
- ✅ **Índices optimizados** para rendimiento
- ✅ **Constraints de integridad** referencial

### **💡 Funcionalidades Idénticas:**

#### **Dashboard:**
- Métricas en tiempo real
- Gráficos de actividad reciente
- Acciones rápidas de WhatsApp
- Cards con gradientes modernos

#### **Gestión de Clientes:**
- CRUD completo con validaciones
- Búsqueda en tiempo real
- Modal de acciones post-creación
- Integración WhatsApp directa

#### **Días de Pago:**
- Calendario por días (1-31)
- Estados visuales (vence hoy, vencido, etc.)
- Recordatorios masivos por día
- Métricas de ingresos esperados

#### **Facturas:**
- Numeración automática (FAC-2024-001)
- Vista previa e impresión
- Descarga de archivos
- Control de estados de pago

#### **Instalaciones:**
- Programación con técnicos
- Control de equipos y costos
- Estados: pendiente, completada, cancelada

#### **Antenas Starlink:**
- Monitoreo de señal y capacidad
- Barras de progreso visuales
- Control de mantenimiento
- Métricas en tiempo real

### **🔧 Tecnologías Utilizadas:**

#### **Frontend:**
- **HTML5**: Estructura semántica moderna
- **CSS3**: Grid, Flexbox, animaciones, responsive
- **JavaScript ES6+**: Async/await, modules, classes
- **Font Awesome**: Iconografía profesional
- **Google Fonts**: Tipografía Inter

#### **Backend:**
- **PHP 7.4+**: Orientado a objetos, PDO
- **MySQL 5.7+**: Base de datos relacional
- **APIs REST**: Endpoints organizados por entidad
- **JSON**: Comunicación cliente-servidor

### **📱 Características Técnicas:**

#### **Responsive Design:**
- Mobile-first approach
- Breakpoints optimizados
- Sidebar colapsable en móviles
- Touch-friendly interfaces

#### **Performance:**
- Lazy loading de datos
- Debounce en búsquedas
- Optimización de consultas SQL
- Minificación de assets

#### **Seguridad:**
- Validación client + server side
- Prepared statements (PDO)
- Sanitización de inputs
- Headers de seguridad

### **🚀 Instalación Rápida:**

1. **Configurar servidor web** (Apache/Nginx)
2. **Crear base de datos MySQL**
3. **Ejecutar script** `database/schema.sql`
4. **Configurar credenciales** en `config/database.php`
5. **Abrir** `index.html` en el navegador

### **🎨 Personalización:**

#### **Estilos:**
- Variables CSS para colores
- Clases utilitarias reutilizables
- Componentes modulares

#### **Funcionalidad:**
- APIs extensibles
- Validaciones configurables
- Mensajes personalizables

La aplicación mantiene **exactamente la misma funcionalidad** que la versión React, pero ahora es completamente compatible con cualquier servidor web que soporte PHP y MySQL. Es perfecta para hosting compartido, VPS o servidores dedicados.

¿Te gustaría que ajuste alguna funcionalidad específica o que agregue alguna característica adicional?
