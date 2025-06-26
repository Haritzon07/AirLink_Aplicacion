// Variables globales
let currentSection = "dashboard"
let clients = []
let installations = []
let accessPoints = []
let payments = []
let invoices = []
let lastAddedClientId = null
let editingInstallationId = null

// Puntos de acceso predefinidos
const ACCESS_POINTS = [
  { id: 1, codigo: "AP-NORTE", ubicacion: "Punto Norte", nombre: "Punto Norte" },
  { id: 2, codigo: "AP-SUR", ubicacion: "Punto Sur", nombre: "Punto Sur" },
  { id: 3, codigo: "AP-ESTE", ubicacion: "Punto Este", nombre: "Punto Este" },
  { id: 4, codigo: "AP-OESTE", ubicacion: "Punto Oeste", nombre: "Punto Oeste" },
]

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
  setupEventListeners()
  loadDashboardData()
})

// Configurar event listeners
function setupEventListeners() {
  // Sidebar navigation
  document.querySelectorAll(".menu-item").forEach((item) => {
    item.addEventListener("click", function () {
      const section = this.dataset.section
      showSection(section)
    })
  })

  // Mobile menu toggle
  document.getElementById("menuToggle").addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("active")
  })

  document.getElementById("sidebarClose").addEventListener("click", () => {
    document.getElementById("sidebar").classList.remove("active")
  })

  // Forms
  document.getElementById("clientForm").addEventListener("submit", handleClientSubmit)
  document.getElementById("installationForm").addEventListener("submit", handleInstallationSubmit)
  document.getElementById("accessPointForm").addEventListener("submit", handleAccessPointSubmit)

  // Search
  document.getElementById("clientSearch").addEventListener("input", function () {
    filterClients(this.value)
  })

  // Filters
  document.getElementById("installationFilter").addEventListener("change", function () {
    filterInstallations(this.value)
  })

  // Close modals when clicking outside
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === this) {
        closeModal(this.id)
      }
    })
  })
}

// Inicializar aplicación
function initializeApp() {
  loadClients()
  loadInstallations()
  loadAccessPoints()
  loadPayments()
  loadInvoices()
}

// Mostrar sección
function showSection(section) {
  // Ocultar todas las secciones
  document.querySelectorAll(".content-section").forEach((sec) => {
    sec.classList.remove("active")
  })

  // Mostrar sección seleccionada
  document.getElementById(`${section}-section`).classList.add("active")

  // Actualizar navegación
  document.querySelectorAll(".menu-item").forEach((item) => {
    item.classList.remove("active")
  })
  document.querySelector(`[data-section="${section}"]`).classList.add("active")

  // Actualizar título
  const titles = {
    dashboard: "Dashboard",
    clients: "Gestión de Clientes",
    installations: "Gestión de Instalaciones",
    payments: "Gestión de Pagos",
    invoices: "Gestión de Facturas",
    "access-points": "PUNTOS DE ACCESO",
  }
  document.getElementById("pageTitle").textContent = titles[section]

  currentSection = section

  // Cargar datos específicos de la sección
  switch (section) {
    case "dashboard":
      loadDashboardData()
      break
    case "clients":
      loadClients()
      break
    case "installations":
      loadInstallations()
      break
    case "access-points":
      loadAccessPoints()
      break
  }

  // Cerrar sidebar en móvil
  if (window.innerWidth <= 768) {
    document.getElementById("sidebar").classList.remove("active")
  }
}

// ==================== API CALLS ====================

// Función genérica para hacer llamadas a la API
async function apiCall(endpoint, action = "list", data = null, method = "GET") {
  try {
    showLoading(true)

    const url = `api.php?endpoint=${endpoint}&action=${action}`
    const options = {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    }

    if (data) {
      if (data instanceof FormData) {
        options.body = data
        delete options.headers["Content-Type"] // Let browser set it for FormData
      } else {
        options.body = JSON.stringify(data)
      }
      if (method === "GET") {
        options.method = "POST"
      }
    }

    const response = await fetch(url, options)
    const result = await response.json()

    if (!result.success) {
      throw new Error(result.message || "Error en la operación")
    }

    return result
  } catch (error) {
    console.error("API Error:", error)
    showToast("Error: " + error.message, "error")
    throw error
  } finally {
    showLoading(false)
  }
}

// ==================== CLIENTES ====================

// Cargar clientes
async function loadClients() {
  try {
    const result = await apiCall("clients", "list")
    clients = result.data
    renderClients()
    updateClientSelects()
  } catch (error) {
    console.error("Error loading clients:", error)
  }
}

// Renderizar clientes
function renderClients() {
  const container = document.getElementById("clientsGrid")

  if (clients.length === 0) {
    container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users"></i>
                <h3>No hay clientes registrados</h3>
                <p>Comienza agregando tu primer cliente</p>
                <button class="btn btn-primary" onclick="openModal('clientModal')">
                    <i class="fas fa-plus"></i>
                    Agregar Cliente
                </button>
            </div>
        `
    return
  }

  container.innerHTML = clients
    .map(
      (client) => `
        <div class="client-card">
            <div class="client-header">
                <div>
                    <div class="client-name">${client.nombre}</div>
                    <div class="client-phone">${client.telefono}</div>
                </div>
                <span class="client-status status-${client.status}">
                    ${client.status === "active" ? "Activo" : "Inactivo"}
                </span>
            </div>
            <div class="client-info">
                <div class="client-info-item">
                    <i class="fas fa-calendar"></i>
                    <span>Registrado: ${formatDate(client.created_at)}</span>
                </div>
            </div>
            <div class="client-actions">
                <button class="btn btn-sm btn-primary" onclick="editClient(${client.id})">
                    <i class="fas fa-edit"></i>
                    Editar
                </button>
                <button class="btn btn-sm btn-success" onclick="addInstallationForSpecificClient(${client.id})">
                    <i class="fas fa-tools"></i>
                    Instalación
                </button>
                <button class="btn btn-sm btn-danger" onclick="confirmDeleteClient(${client.id})">
                    <i class="fas fa-trash"></i>
                    Eliminar
                </button>
            </div>
        </div>
    `,
    )
    .join("")
}

// Manejar envío del formulario de cliente
async function handleClientSubmit(e) {
  e.preventDefault()

  try {
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())

    const result = await apiCall("clients", "create", data)

    lastAddedClientId = result.data.id

    showToast("Cliente agregado exitosamente", "success")
    closeModal("clientModal")

    // Mostrar modal de éxito con opciones
    document.getElementById("addedClientName").textContent = data.nombre
    openModal("clientSuccessModal")

    // Recargar datos
    loadClients()
    loadDashboardData()

    // Limpiar formulario
    e.target.reset()
  } catch (error) {
    console.error("Error creating client:", error)
  }
}

// Filtrar clientes
function filterClients(searchTerm) {
  const filteredClients = clients.filter(
    (client) => client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || client.telefono.includes(searchTerm),
  )

  const container = document.getElementById("clientsGrid")
  container.innerHTML = filteredClients
    .map(
      (client) => `
        <div class="client-card">
            <div class="client-header">
                <div>
                    <div class="client-name">${client.nombre}</div>
                    <div class="client-phone">${client.telefono}</div>
                </div>
                <span class="client-status status-${client.status}">
                    ${client.status === "active" ? "Activo" : "Inactivo"}
                </span>
            </div>
            <div class="client-info">
                <div class="client-info-item">
                    <i class="fas fa-calendar"></i>
                    <span>Registrado: ${formatDate(client.created_at)}</span>
                </div>
            </div>
            <div class="client-actions">
                <button class="btn btn-sm btn-primary" onclick="editClient(${client.id})">
                    <i class="fas fa-edit"></i>
                    Editar
                </button>
                <button class="btn btn-sm btn-success" onclick="addInstallationForSpecificClient(${client.id})">
                    <i class="fas fa-tools"></i>
                    Instalación
                </button>
                <button class="btn btn-sm btn-danger" onclick="confirmDeleteClient(${client.id})">
                    <i class="fas fa-trash"></i>
                    Eliminar
                </button>
            </div>
        </div>
    `,
    )
    .join("")
}

// Actualizar selects de clientes
function updateClientSelects() {
  const selects = document.querySelectorAll("#installationClient")
  selects.forEach((select) => {
    select.innerHTML =
      '<option value="">Seleccionar cliente</option>' +
      clients.map((client) => `<option value="${client.id}">${client.nombre} - ${client.telefono}</option>`).join("")
  })
}

// ==================== INSTALACIONES ====================

// Cargar instalaciones
async function loadInstallations() {
  try {
    const result = await apiCall("installations", "list")
    installations = result.data
    renderInstallationsByAccessPoint()
  } catch (error) {
    console.error("Error loading installations:", error)
  }
}

// Renderizar instalaciones por punto de acceso
function renderInstallationsByAccessPoint() {
  const container = document.getElementById("installationsByAccessPoint")

  if (installations.length === 0) {
    container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-tools"></i>
                <h3>No hay instalaciones registradas</h3>
                <p>Comienza programando tu primera instalación</p>
                <button class="btn btn-primary" onclick="openModal('installationModal')">
                    <i class="fas fa-plus"></i>
                    Nueva Instalación
                </button>
            </div>
        `
    return
  }

  // Agrupar instalaciones por punto de acceso
  const installationsByAP = {}
  ACCESS_POINTS.forEach((ap) => {
    installationsByAP[ap.id] = {
      accessPoint: ap,
      installations: installations.filter((inst) => inst.access_point_id == ap.id),
    }
  })

  // Instalaciones sin punto de acceso asignado
  const unassignedInstallations = installations.filter((inst) => !inst.access_point_id)
  if (unassignedInstallations.length > 0) {
    installationsByAP[0] = {
      accessPoint: { codigo: "SIN-ASIGNAR", ubicacion: "Sin Punto de Acceso Asignado" },
      installations: unassignedInstallations,
    }
  }

  let html = ""

  Object.values(installationsByAP).forEach((group) => {
    if (group.installations.length > 0) {
      html += `
                <div class="access-point-group">
                    <div class="access-point-header">
                        <div class="access-point-info">
                            <h3 class="access-point-title">
                                <i class="fas fa-broadcast-tower"></i>
                                ${group.accessPoint.codigo} - ${group.accessPoint.ubicacion}
                            </h3>
                            <span class="installations-count">${group.installations.length} instalación${group.installations.length !== 1 ? "es" : ""}</span>
                        </div>
                    </div>
                    <div class="installations-grid">
                        ${group.installations
                          .map(
                            (installation) => `
                            <div class="installation-card">
                                <div class="installation-header">
                                    <div>
                                        <div class="installation-client">${installation.client_name || "Cliente no encontrado"}</div>
                                        <div class="installation-plan">Plan: ${installation.plan.replace("_", " ").toUpperCase()} - $${installation.precio_plan}</div>
                                    </div>
                                    <span class="installation-status status-${installation.estado}">
                                        ${getStatusText(installation.estado)}
                                    </span>
                                </div>
                                <div class="installation-details">
                                    <div class="detail-item">
                                        <div class="detail-label">Dirección</div>
                                        <div class="detail-value">${installation.direccion || "No especificada"}</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Día de Pago</div>
                                        <div class="detail-value">${installation.dia_pago}</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Router Cliente</div>
                                        <div class="detail-value">${installation.router_marca || ""} ${installation.router_modelo || ""}</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">MAC Router</div>
                                        <div class="detail-value">${installation.router_mac}</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Usuario PPPOE</div>
                                        <div class="detail-value">${installation.usuario_pppoe}</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">WiFi</div>
                                        <div class="detail-value">${installation.nombre_wifi || "No configurado"}</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Fecha Instalación</div>
                                        <div class="detail-value">${formatDate(installation.fecha_instalacion)}</div>
                                    </div>
                                </div>
                                ${
                                  installation.notas
                                    ? `
                                    <div class="installation-notes">
                                        <strong>Notas:</strong> ${installation.notas}
                                    </div>
                                `
                                    : ""
                                }
                                <div class="client-actions">
                                    <button class="btn btn-sm btn-primary" onclick="editInstallation(${installation.id})">
                                        <i class="fas fa-edit"></i>
                                        Editar
                                    </button>
                                    <button class="btn btn-sm btn-info" onclick="viewInstallationDetails(${installation.id})">
                                        <i class="fas fa-eye"></i>
                                        Ver Detalles
                                    </button>
                                    <button class="btn btn-sm btn-danger" onclick="confirmDeleteInstallation(${installation.id})">
                                        <i class="fas fa-trash"></i>
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        `,
                          )
                          .join("")}
                    </div>
                </div>
            `
    }
  })

  container.innerHTML = html
}

// Manejar envío del formulario de instalación
async function handleInstallationSubmit(e) {
  e.preventDefault()

  try {
    const formData = new FormData(e.target)
    const installationId = formData.get("id")

    let result
    if (installationId && editingInstallationId) {
      // Actualizar instalación existente
      result = await apiCall("installations", "update", formData, "POST")
      showToast("Instalación actualizada exitosamente", "success")
    } else {
      // Crear nueva instalación
      result = await apiCall("installations", "create", formData, "POST")
      showToast("Instalación creada exitosamente", "success")
    }

    closeModal("installationModal")

    // Recargar datos
    loadInstallations()
    loadDashboardData()

    // Limpiar formulario y variables
    e.target.reset()
    editingInstallationId = null
  } catch (error) {
    console.error("Error saving installation:", error)
  }
}

// Editar instalación
async function editInstallation(id) {
  try {
    const result = await apiCall("installations", "get", { id: id })
    const installation = result.data

    if (!installation) {
      showToast("Instalación no encontrada", "error")
      return
    }

    editingInstallationId = id

    // Llenar el formulario con los datos existentes
    document.getElementById("installationId").value = installation.id
    document.getElementById("installationClient").value = installation.client_id
    document.getElementById("installationAccessPoint").value = installation.access_point_id
    document.getElementById("installationDireccion").value = installation.direccion || ""
    document.getElementById("installationCoordenadas").value = installation.coordenadas || ""
    document.getElementById("installationPlan").value = installation.plan
    document.getElementById("installationPrecioPlan").value = installation.precio_plan
    document.getElementById("installationDiaPago").value = installation.dia_pago
    document.getElementById("installationRouterMarca").value = installation.router_marca || ""
    document.getElementById("installationRouterModelo").value = installation.router_modelo || ""
    document.getElementById("installationRouterMac").value = installation.router_mac
    document.getElementById("installationRouterIpLocal").value = installation.router_ip_local || ""
    document.getElementById("installationRouterUsuario").value = installation.router_usuario || ""
    document.getElementById("installationRouterPassword").value = installation.router_password || ""
    document.getElementById("installationUsuarioPPPOE").value = installation.usuario_pppoe
    document.getElementById("installationClavePPPOE").value = installation.clave_pppoe
    document.getElementById("installationNombreWifi").value = installation.nombre_wifi || ""
    document.getElementById("installationClaveWifi").value = installation.clave_wifi
    document.getElementById("installationIpPublica").value = installation.ip_publica || ""
    document.getElementById("installationFechaInstalacion").value = installation.fecha_instalacion
    document.getElementById("installationEstado").value = installation.estado
    document.getElementById("installationNotas").value = installation.notas || ""

    // Cambiar título del modal
    document.getElementById("installationModalTitle").textContent = "Editar Instalación"
    document.getElementById("installationSubmitText").textContent = "Actualizar Instalación"

    // Abrir modal
    openModal("installationModal")
  } catch (error) {
    console.error("Error loading installation for edit:", error)
    showToast("Error al cargar los datos de la instalación", "error")
  }
}

// Filtrar instalaciones
function filterInstallations(status) {
  let filteredInstallations = installations

  if (status !== "all") {
    filteredInstallations = installations.filter((installation) => installation.estado === status)
  }

  // Temporalmente actualizar la variable global para el filtro
  const originalInstallations = installations
  installations = filteredInstallations
  renderInstallationsByAccessPoint()
  installations = originalInstallations
}

// ==================== PUNTOS DE ACCESO ====================

// Cargar puntos de acceso
async function loadAccessPoints() {
  try {
    const result = await apiCall("access_points", "list")
    accessPoints = result.data
    renderAccessPoints()
    updateAccessPointSelects()
  } catch (error) {
    console.error("Error loading access points:", error)
  }
}

// Renderizar puntos de acceso
function renderAccessPoints() {
  const container = document.getElementById("accessPointsGrid")

  if (accessPoints.length === 0) {
    container.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-broadcast-tower"></i>
            <h3>No hay PUNTOS DE ACCESO registrados</h3>
            <p>Comienza agregando tu primer PUNTO DE ACCESO</p>
            <button class="btn btn-primary" onclick="openModal('accessPointModal')">
                <i class="fas fa-plus"></i>
                Agregar PUNTO DE ACCESO
            </button>
        </div>
    `
    return
  }

  container.innerHTML = accessPoints
    .map(
      (accessPoint) => `
        <div class="access-point-card">
            <div class="access-point-header">
                <div>
                    <div class="access-point-code">${accessPoint.codigo}</div>
                    <div class="access-point-location">${accessPoint.ubicacion}</div>
                </div>
                <span class="access-point-status status-${accessPoint.estado}">
                    ${getAccessPointStatusText(accessPoint.estado)}
                </span>
            </div>
            <div class="access-point-stats">
                <div class="access-point-stat">
                    <div class="access-point-stat-value">${accessPoint.capacidad_clientes}</div>
                    <div class="access-point-stat-label">Capacidad</div>
                </div>
                <div class="access-point-stat">
                    <div class="access-point-stat-value">${accessPoint.router_marca}</div>
                    <div class="access-point-stat-label">Marca</div>
                </div>
            </div>
            <div class="installation-details">
                <div class="detail-item">
                    <div class="detail-label">Modelo</div>
                    <div class="detail-value">${accessPoint.router_modelo || "No especificado"}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">IP Router</div>
                    <div class="detail-value">${accessPoint.router_ip || "No asignada"}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Usuario</div>
                    <div class="detail-value">${accessPoint.router_usuario || "No configurado"}</div>
                </div>
                ${
                  accessPoint.router_mac
                    ? `
                    <div class="detail-item">
                        <div class="detail-label">MAC</div>
                        <div class="detail-value">${accessPoint.router_mac}</div>
                    </div>
                `
                    : ""
                }
            </div>
            ${
              accessPoint.notas
                ? `
                <div class="installation-notes">
                    <strong>Notas:</strong> ${accessPoint.notas}
                </div>
            `
                : ""
            }
            <div class="client-actions">
                <button class="btn btn-sm btn-primary" onclick="editAccessPoint(${accessPoint.id})">
                    <i class="fas fa-edit"></i>
                    Editar
                </button>
                <button class="btn btn-sm btn-info" onclick="viewAccessPointDetails(${accessPoint.id})">
                    <i class="fas fa-eye"></i>
                    Ver Detalles
                </button>
                <button class="btn btn-sm btn-danger" onclick="confirmDeleteAccessPoint(${accessPoint.id})">
                    <i class="fas fa-trash"></i>
                    Eliminar
                </button>
            </div>
        </div>
    `,
    )
    .join("")
}

// Manejar envío del formulario de punto de acceso
async function handleAccessPointSubmit(e) {
  e.preventDefault()

  try {
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())

    const result = await apiCall("access_points", "create", data)

    showToast("PUNTO DE ACCESO agregado exitosamente", "success")
    closeModal("accessPointModal")

    // Recargar datos
    loadAccessPoints()
    loadDashboardData()

    // Limpiar formulario
    e.target.reset()
  } catch (error) {
    console.error("Error creating access point:", error)
  }
}

// Actualizar selects de puntos de acceso
function updateAccessPointSelects() {
  const selects = document.querySelectorAll("#installationAccessPoint")
  selects.forEach((select) => {
    // Mantener las opciones predefinidas
    const currentValue = select.value
    select.innerHTML = `
            <option value="">Seleccionar PUNTO DE ACCESO</option>
            <option value="1">AP-NORTE - Punto Norte</option>
            <option value="2">AP-SUR - Punto Sur</option>
            <option value="3">AP-ESTE - Punto Este</option>
            <option value="4">AP-OESTE - Punto Oeste</option>
        `
    if (currentValue) {
      select.value = currentValue
    }
  })
}

// ==================== DASHBOARD ====================

// Cargar datos del dashboard
async function loadDashboardData() {
  try {
    const result = await apiCall("dashboard", "stats")
    const stats = result.data

    // Actualizar estadísticas
    document.getElementById("totalClients").textContent = stats.total_clients || 0
    document.getElementById("totalInstallations").textContent = stats.total_installations || 0
    document.getElementById("monthlyRevenue").textContent = `$${stats.monthly_revenue || 0}`

    // Cargar actividad reciente
    loadRecentActivity()
  } catch (error) {
    console.error("Error loading dashboard data:", error)
  }
}

// Cargar actividad reciente
async function loadRecentActivity() {
  try {
    const result = await apiCall("dashboard", "recent_activity")
    const activities = result.data

    const container = document.getElementById("recentActivity")
    let activityHtml = ""

    // Clientes recientes
    if (activities.recent_clients && activities.recent_clients.length > 0) {
      activities.recent_clients.forEach((client) => {
        activityHtml += `
                    <div class="activity-item">
                        <div class="activity-icon">
                            <i class="fas fa-user-plus"></i>
                        </div>
                        <div class="activity-content">
                            <div class="activity-title">Nuevo cliente: ${client.nombre}</div>
                            <div class="activity-time">${formatDateTime(client.created_at)}</div>
                        </div>
                    </div>
                `
      })
    }

    // Instalaciones recientes
    if (activities.recent_installations && activities.recent_installations.length > 0) {
      activities.recent_installations.forEach((installation) => {
        activityHtml += `
                    <div class="activity-item">
                        <div class="activity-icon" style="background-color: var(--success-color);">
                            <i class="fas fa-tools"></i>
                        </div>
                        <div class="activity-content">
                            <div class="activity-title">Nueva instalación: ${installation.client_name}</div>
                            <div class="activity-time">${formatDateTime(installation.created_at)}</div>
                        </div>
                    </div>
                `
      })
    }

    if (activityHtml === "") {
      activityHtml = `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-info-circle"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-title">No hay actividad reciente</div>
                        <div class="activity-time">Comienza agregando clientes e instalaciones</div>
                    </div>
                </div>
            `
    }

    container.innerHTML = activityHtml
  } catch (error) {
    console.error("Error loading recent activity:", error)
  }
}

// ==================== MODAL FUNCTIONS ====================

// Abrir modal
function openModal(modalId) {
  const modal = document.getElementById(modalId)
  modal.classList.add("active")
  document.body.style.overflow = "hidden"

  // Si es el modal de instalación, cargar datos necesarios
  if (modalId === "installationModal") {
    updateClientSelects()
    updateAccessPointSelects()

    // Si no estamos editando, resetear el formulario
    if (!editingInstallationId) {
      document.getElementById("installationModalTitle").textContent = "Nueva Instalación"
      document.getElementById("installationSubmitText").textContent = "Guardar Instalación"
      document.getElementById("installationForm").reset()
      document.getElementById("installationId").value = ""
    }
  }
}

// Cerrar modal
function closeModal(modalId) {
  const modal = document.getElementById(modalId)
  modal.classList.remove("active")
  document.body.style.overflow = "auto"

  // Limpiar variables de edición
  if (modalId === "installationModal") {
    editingInstallationId = null
  }
}

// ==================== CONFIRMATION FUNCTIONS ====================

// Confirmar eliminación de cliente
function confirmDeleteClient(id) {
  const client = clients.find((c) => c.id == id)
  if (!client) return

  document.getElementById("confirmModalTitle").textContent = "Eliminar Cliente"
  document.getElementById("confirmModalMessage").textContent =
    `¿Estás seguro de que quieres eliminar al cliente "${client.nombre}"? Esta acción no se puede deshacer.`

  document.getElementById("confirmModalAction").onclick = () => {
    deleteClient(id)
    closeModal("confirmModal")
  }

  openModal("confirmModal")
}

// Confirmar eliminación de instalación
function confirmDeleteInstallation(id) {
  const installation = installations.find((i) => i.id == id)
  if (!installation) return

  document.getElementById("confirmModalTitle").textContent = "Eliminar Instalación"
  document.getElementById("confirmModalMessage").textContent =
    `¿Estás seguro de que quieres eliminar la instalación de "${installation.client_name}"? Esta acción no se puede deshacer.`

  document.getElementById("confirmModalAction").onclick = () => {
    deleteInstallation(id)
    closeModal("confirmModal")
  }

  openModal("confirmModal")
}

// Confirmar eliminación de punto de acceso
function confirmDeleteAccessPoint(id) {
  const accessPoint = accessPoints.find((ap) => ap.id == id)
  if (!accessPoint) return

  document.getElementById("confirmModalTitle").textContent = "Eliminar PUNTO DE ACCESO"
  document.getElementById("confirmModalMessage").textContent =
    `¿Estás seguro de que quieres eliminar el PUNTO DE ACCESO "${accessPoint.codigo}"? Esta acción no se puede deshacer.`

  document.getElementById("confirmModalAction").onclick = () => {
    deleteAccessPoint(id)
    closeModal("confirmModal")
  }

  openModal("confirmModal")
}

// ==================== DELETE FUNCTIONS ====================

// Eliminar cliente
async function deleteClient(id) {
  try {
    const result = await apiCall("clients", "delete", { id: id })
    showToast("Cliente eliminado exitosamente", "success")
    loadClients()
    loadDashboardData()
  } catch (error) {
    console.error("Error deleting client:", error)
  }
}

// Eliminar instalación
async function deleteInstallation(id) {
  try {
    const result = await apiCall("installations", "delete", { id: id })
    showToast("Instalación eliminada exitosamente", "success")
    loadInstallations()
    loadDashboardData()
  } catch (error) {
    console.error("Error deleting installation:", error)
  }
}

// Eliminar punto de acceso
async function deleteAccessPoint(id) {
  try {
    const result = await apiCall("access_points", "delete", { id: id })
    showToast("PUNTO DE ACCESO eliminado exitosamente", "success")
    loadAccessPoints()
    loadDashboardData()
  } catch (error) {
    console.error("Error deleting access point:", error)
  }
}

// ==================== UTILITY FUNCTIONS ====================

// Actualizar precio del plan
function updatePlanPrice() {
  const planSelect = document.getElementById("installationPlan")
  const priceInput = document.getElementById("installationPrecioPlan")

  const selectedOption = planSelect.options[planSelect.selectedIndex]
  if (selectedOption && selectedOption.dataset.price) {
    priceInput.value = selectedOption.dataset.price
  }
}

// Mostrar/ocultar loading
function showLoading(show) {
  const spinner = document.getElementById("loadingSpinner")
  if (show) {
    spinner.classList.add("active")
  } else {
    spinner.classList.remove("active")
  }
}

// Mostrar toast notification
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer")
  const toast = document.createElement("div")
  toast.className = `toast ${type}`

  const icons = {
    success: "fas fa-check-circle",
    error: "fas fa-exclamation-circle",
    warning: "fas fa-exclamation-triangle",
    info: "fas fa-info-circle",
  }

  toast.innerHTML = `
        <i class="toast-icon ${icons[type]}"></i>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `

  container.appendChild(toast)

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (toast.parentElement) {
      toast.remove()
    }
  }, 5000)
}

// Formatear fecha
function formatDate(dateString) {
  if (!dateString) return ""
  const date = new Date(dateString)
  return date.toLocaleDateString("es-ES")
}

// Formatear fecha y hora
function formatDateTime(dateString) {
  if (!dateString) return ""
  const date = new Date(dateString)
  return date.toLocaleString("es-ES")
}

// Obtener texto del estado
function getStatusText(status) {
  const statusTexts = {
    pendiente: "Pendiente",
    instalado_completo: "Instalado",
    presenta_fallas: "Con Fallas",
    suspendido: "Suspendido",
  }
  return statusTexts[status] || status
}

// Obtener texto del estado de punto de acceso
function getAccessPointStatusText(status) {
  const statusTexts = {
    activo: "Activo",
    mantenimiento: "Mantenimiento",
    inactivo: "Inactivo",
  }
  return statusTexts[status] || status
}

// ==================== SPECIFIC ACTIONS ====================

// Agregar instalación para cliente específico
function addInstallationForSpecificClient(clientId) {
  openModal("installationModal")

  // Preseleccionar el cliente
  setTimeout(() => {
    document.getElementById("installationClient").value = clientId
  }, 100)
}

// Agregar instalación para el último cliente agregado
function addInstallationForClient() {
  closeModal("clientSuccessModal")

  if (lastAddedClientId) {
    addInstallationForSpecificClient(lastAddedClientId)
  } else {
    openModal("installationModal")
  }
}

// Cargar pagos (placeholder)
async function loadPayments() {
  // Implementar cuando sea necesario
  payments = []
}

// Cargar facturas (placeholder)
async function loadInvoices() {
  // Implementar cuando sea necesario
  invoices = []
}

// Funciones de edición (placeholders)
function editClient(id) {
  showToast("Función de edición de cliente en desarrollo", "info")
}

// Funciones de vista de detalles (placeholders)
function viewInstallationDetails(id) {
  showToast("Vista de detalles en desarrollo", "info")
}

function viewAccessPointDetails(id) {
  showToast("Vista de detalles en desarrollo", "info")
}
