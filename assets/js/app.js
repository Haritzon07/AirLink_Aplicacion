// Global variables
let currentSection = "dashboard"
let clients = []
let payments = []
let invoices = []
let antennas = []
let installations = []

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
  setupEventListeners()
  loadInitialData()
})

function initializeApp() {
  // Setup sidebar navigation
  const menuItems = document.querySelectorAll(".menu-item")
  menuItems.forEach((item) => {
    item.addEventListener("click", function () {
      const section = this.dataset.section
      showSection(section)
    })
  })

  // Setup mobile menu
  const menuToggle = document.getElementById("menuToggle")
  const sidebar = document.getElementById("sidebar")
  const sidebarClose = document.getElementById("sidebarClose")

  menuToggle.addEventListener("click", () => {
    sidebar.classList.add("open")
    document.querySelector(".main-content").classList.add("sidebar-open")
  })

  sidebarClose.addEventListener("click", () => {
    sidebar.classList.remove("open")
    document.querySelector(".main-content").classList.remove("sidebar-open")
  })

  // Close sidebar when clicking outside on mobile
  document.addEventListener("click", (e) => {
    if (window.innerWidth < 1024) {
      if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
        sidebar.classList.remove("open")
        document.querySelector(".main-content").classList.remove("sidebar-open")
      }
    }
  })
}

function setupEventListeners() {
  // Client form
  const clientForm = document.getElementById("clientForm")
  if (clientForm) {
    clientForm.addEventListener("submit", handleClientSubmit)
  }

  // Payment form
  const paymentForm = document.getElementById("paymentForm")
  if (paymentForm) {
    paymentForm.addEventListener("submit", handlePaymentSubmit)
  }

  // Invoice form
  const invoiceForm = document.getElementById("invoiceForm")
  if (invoiceForm) {
    invoiceForm.addEventListener("submit", handleInvoiceSubmit)
  }

  // Search functionality
  const clientSearch = document.getElementById("clientSearch")
  if (clientSearch) {
    clientSearch.addEventListener("input", function () {
      filterClients(this.value)
    })
  }

  // Filter functionality
  const paymentFilter = document.getElementById("paymentFilter")
  if (paymentFilter) {
    paymentFilter.addEventListener("change", function () {
      filterPayments(this.value)
    })
  }

  const invoiceFilter = document.getElementById("invoiceFilter")
  if (invoiceFilter) {
    invoiceFilter.addEventListener("change", function () {
      filterInvoices(this.value)
    })
  }

  // Payment status change
  const paymentStatus = document.getElementById("paymentStatus")
  if (paymentStatus) {
    paymentStatus.addEventListener("change", function () {
      const methodGroup = document.getElementById("paymentMethodGroup")
      if (this.value === "paid") {
        methodGroup.style.display = "block"
        document.getElementById("paymentMethod").required = true
      } else {
        methodGroup.style.display = "none"
        document.getElementById("paymentMethod").required = false
      }
    })
  }
}

function showSection(sectionName) {
  // Update active menu item
  document.querySelectorAll(".menu-item").forEach((item) => {
    item.classList.remove("active")
  })
  document.querySelector(`[data-section="${sectionName}"]`).classList.add("active")

  // Update page title
  const titles = {
    dashboard: "Dashboard",
    clients: "Clientes",
    installations: "Instalaciones",
    payments: "Pagos",
    "payment-days": "Días de Pago",
    invoices: "Facturas",
    antennas: "Antenas",
  }
  document.getElementById("pageTitle").textContent = titles[sectionName] || "Dashboard"

  // Show/hide sections
  document.querySelectorAll(".content-section").forEach((section) => {
    section.classList.remove("active")
  })
  document.getElementById(`${sectionName}-section`).classList.add("active")

  // Load section data
  currentSection = sectionName
  loadSectionData(sectionName)

  // Close mobile sidebar
  if (window.innerWidth < 1024) {
    document.getElementById("sidebar").classList.remove("open")
    document.querySelector(".main-content").classList.remove("sidebar-open")
  }
}

async function loadInitialData() {
  showLoading()
  try {
    await Promise.all([loadClients(), loadPayments(), loadInvoices(), loadAntennas(), loadInstallations()])
    updateDashboardStats()
    loadSectionData(currentSection)
  } catch (error) {
    showToast("Error al cargar los datos", "error")
    console.error("Error loading initial data:", error)
  } finally {
    hideLoading()
  }
}

async function loadSectionData(section) {
  switch (section) {
    case "dashboard":
      renderDashboard()
      break
    case "clients":
      renderClients()
      break
    case "payments":
      renderPayments()
      break
    case "payment-days":
      renderPaymentDays()
      break
    case "invoices":
      renderInvoices()
      break
    case "antennas":
      renderAntennas()
      break
    case "installations":
      renderInstallations()
      break
  }
}

// API calls
async function loadClients() {
  try {
    const response = await fetch("api/clients.php")
    const data = await response.json()
    if (data.success) {
      clients = data.data
      populateClientSelects()
    }
  } catch (error) {
    console.error("Error loading clients:", error)
  }
}

async function loadPayments() {
  try {
    const response = await fetch("api/payments.php")
    const data = await response.json()
    if (data.success) {
      payments = data.data
    }
  } catch (error) {
    console.error("Error loading payments:", error)
  }
}

async function loadInvoices() {
  try {
    const response = await fetch("api/invoices.php")
    const data = await response.json()
    if (data.success) {
      invoices = data.data
    }
  } catch (error) {
    console.error("Error loading invoices:", error)
  }
}

async function loadAntennas() {
  try {
    const response = await fetch("api/antennas.php")
    const data = await response.json()
    if (data.success) {
      antennas = data.data
      populateAntennaSelects()
    }
  } catch (error) {
    console.error("Error loading antennas:", error)
  }
}

async function loadInstallations() {
  try {
    const response = await fetch("api/installations.php")
    const data = await response.json()
    if (data.success) {
      installations = data.data
    }
  } catch (error) {
    console.error("Error loading installations:", error)
  }
}

// Form handlers
async function handleClientSubmit(e) {
  e.preventDefault()
  showLoading()

  const formData = new FormData(e.target)

  try {
    const response = await fetch("api/clients.php", {
      method: "POST",
      body: formData,
    })

    const data = await response.json()

    if (data.success) {
      showToast("Cliente agregado exitosamente", "success")
      closeModal("clientModal")
      e.target.reset()
      await loadClients()
      renderClients()

      // Show client actions modal
      showClientActionsModal(data.client)
    } else {
      showToast(data.message || "Error al agregar cliente", "error")
    }
  } catch (error) {
    showToast("Error de conexión", "error")
    console.error("Error:", error)
  } finally {
    hideLoading()
  }
}

async function handlePaymentSubmit(e) {
  e.preventDefault()
  showLoading()

  const formData = new FormData(e.target)

  try {
    const response = await fetch("api/payments.php", {
      method: "POST",
      body: formData,
    })

    const data = await response.json()

    if (data.success) {
      showToast("Pago registrado exitosamente", "success")
      closeModal("paymentModal")
      e.target.reset()
      await loadPayments()
      renderPayments()
      updateDashboardStats()
    } else {
      showToast(data.message || "Error al registrar pago", "error")
    }
  } catch (error) {
    showToast("Error de conexión", "error")
    console.error("Error:", error)
  } finally {
    hideLoading()
  }
}

async function handleInvoiceSubmit(e) {
  e.preventDefault()
  showLoading()

  const formData = new FormData(e.target)

  try {
    const response = await fetch("api/invoices.php", {
      method: "POST",
      body: formData,
    })

    const data = await response.json()

    if (data.success) {
      showToast("Factura creada exitosamente", "success")
      closeModal("invoiceModal")
      e.target.reset()
      await loadInvoices()
      renderInvoices()
    } else {
      showToast(data.message || "Error al crear factura", "error")
    }
  } catch (error) {
    showToast("Error de conexión", "error")
    console.error("Error:", error)
  } finally {
    hideLoading()
  }
}

// Render functions
function renderDashboard() {
  updateDashboardStats()
  renderRecentActivity()
}

function updateDashboardStats() {
  // Total clients
  document.getElementById("totalClients").textContent = clients.length

  // Active antennas
  const activeAntennas = antennas.filter((a) => a.status === "active").length
  document.getElementById("activeAntennas").textContent = activeAntennas

  // Monthly revenue
  const monthlyRevenue = clients.reduce((sum, client) => sum + Number.parseFloat(client.monthly_fee), 0)
  document.getElementById("monthlyRevenue").textContent = formatCurrency(monthlyRevenue)

  // Pending payments
  const pendingPayments = payments.filter((p) => p.status === "pending" || p.status === "overdue").length
  document.getElementById("pendingPayments").textContent = pendingPayments
}

function renderRecentActivity() {
  const container = document.getElementById("recentActivity")
  const recentPayments = payments.slice(0, 5)

  container.innerHTML = recentPayments
    .map(
      (payment) => `
        <div class="activity-item">
            <div class="activity-info">
                <i class="fas ${getPaymentIcon(payment.status)} activity-icon ${getPaymentIconClass(payment.status)}"></i>
                <div class="activity-details">
                    <h4>${payment.client_name}</h4>
                    <p>Vence: ${formatDate(payment.due_date)}</p>
                </div>
            </div>
            <div class="activity-amount">
                <div class="amount">${formatCurrency(payment.amount)}</div>
                <span class="badge badge-${getPaymentBadgeClass(payment.status)}">
                    ${getPaymentStatusText(payment.status)}
                </span>
            </div>
        </div>
    `,
    )
    .join("")
}

function renderClients() {
  const container = document.getElementById("clientsGrid")

  container.innerHTML = clients
    .map(
      (client) => `
        <div class="client-card">
            <div class="client-header">
                <div>
                    <h3 class="client-name">${client.name}</h3>
                    <span class="badge badge-${client.status === "active" ? "success" : "danger"}">
                        ${client.status === "active" ? "Activo" : "Suspendido"}
                    </span>
                </div>
                <div class="client-actions">
                    <button class="btn btn-sm btn-outline" onclick="editClient(${client.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="deleteClient(${client.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="client-info">
                <div class="client-info-item">
                    <i class="fas fa-phone"></i>
                    <span>${client.phone}</span>
                </div>
                <div class="client-info-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${client.address}</span>
                </div>
            </div>
            <div class="client-details">
                <div class="client-detail-row">
                    <span class="client-detail-label">Antena:</span>
                    <span class="client-detail-value">${client.antenna_name || "N/A"}</span>
                </div>
                <div class="client-detail-row">
                    <span class="client-detail-label">Tarifa:</span>
                    <span class="client-detail-value">${formatCurrency(client.monthly_fee)}</span>
                </div>
                <div class="client-detail-row">
                    <span class="client-detail-label">Día de cobro:</span>
                    <span class="client-detail-value">${client.payment_day}</span>
                </div>
                <button class="btn btn-success w-full mt-4" onclick="sendWhatsApp('${client.phone}', '${client.name}')">
                    <i class="fas fa-comment"></i>
                    WhatsApp
                </button>
            </div>
        </div>
    `,
    )
    .join("")
}

function renderPayments() {
  const container = document.getElementById("paymentsContainer")
  const filteredPayments = getFilteredPayments()

  container.innerHTML = filteredPayments
    .map(
      (payment) => `
        <div class="payment-card">
            <div class="payment-header">
                <div class="payment-info">
                    <i class="fas ${getPaymentIcon(payment.status)} activity-icon ${getPaymentIconClass(payment.status)}"></i>
                    <div class="payment-details">
                        <h4>${payment.client_name}</h4>
                        <p>Vence: ${formatDate(payment.due_date)}${payment.payment_date ? ` | Pagado: ${formatDate(payment.payment_date)}` : ""}</p>
                        ${payment.payment_method ? `<p class="text-xs">Método: ${getPaymentMethodText(payment.payment_method)}</p>` : ""}
                    </div>
                </div>
                <div class="payment-actions-container">
                    <div class="payment-amount">
                        <div class="amount">${formatCurrency(payment.amount)}</div>
                        <span class="badge badge-${getPaymentBadgeClass(payment.status)}">
                            ${getPaymentStatusText(payment.status)}
                        </span>
                    </div>
                    <div class="payment-controls">
                        ${
                          payment.status !== "paid"
                            ? `
                            <button class="btn btn-sm btn-success" onclick="markPaymentAsPaid(${payment.id})">
                                <i class="fas fa-dollar-sign"></i>
                                Marcar Pagado
                            </button>
                            <div class="payment-buttons">
                                <button class="btn btn-sm btn-primary" onclick="sendPaymentReminder(${payment.id}, 'reminder')" title="Recordatorio">
                                    <i class="fas fa-comment"></i>
                                </button>
                                <button class="btn btn-sm btn-warning" onclick="sendPaymentReminder(${payment.id}, 'due_today')" title="Vence hoy">
                                    <i class="fas fa-exclamation-triangle"></i>
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="sendPaymentReminder(${payment.id}, 'final_warning')" title="Última advertencia">
                                    <i class="fas fa-exclamation-triangle"></i>
                                </button>
                            </div>
                        `
                            : ""
                        }
                    </div>
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

function renderPaymentDays() {
  updatePaymentDaysSummary()
  renderPaymentDaysCalendar()
}

function updatePaymentDaysSummary() {
  document.getElementById("totalClientsPayment").textContent = clients.length

  const expectedRevenue = clients.reduce((sum, client) => sum + Number.parseFloat(client.monthly_fee), 0)
  document.getElementById("expectedRevenue").textContent = formatCurrency(expectedRevenue)

  const today = new Date().getDate()
  const dueToday = clients.filter((client) => client.payment_day == today).length
  document.getElementById("dueToday").textContent = dueToday

  const overdue = clients.filter((client) => {
    const payment = payments.find((p) => p.client_id == client.id && p.status === "overdue")
    return payment
  }).length
  document.getElementById("overdue").textContent = overdue
}

function renderPaymentDaysCalendar() {
  const container = document.getElementById("paymentDaysCalendar")

  // Group clients by payment day
  const clientsByDay = {}
  clients.forEach((client) => {
    const day = client.payment_day
    if (!clientsByDay[day]) {
      clientsByDay[day] = []
    }
    clientsByDay[day].push(client)
  })

  // Sort days
  const sortedDays = Object.keys(clientsByDay).sort((a, b) => Number.parseInt(a) - Number.parseInt(b))

  container.innerHTML = sortedDays
    .map((day) => {
      const dayClients = clientsByDay[day]
      const totalAmount = dayClients.reduce((sum, client) => sum + Number.parseFloat(client.monthly_fee), 0)

      return `
            <div class="payment-day-card">
                <div class="payment-day-header">
                    <div class="payment-day-info">
                        <div class="payment-day-number">${day}</div>
                        <div>
                            <h3 class="payment-day-title">Día ${day} del mes</h3>
                            <p class="payment-day-subtitle">
                                ${dayClients.length} cliente${dayClients.length !== 1 ? "s" : ""} - ${formatCurrency(totalAmount)} total
                            </p>
                        </div>
                    </div>
                    <button class="btn btn-success" onclick="sendBulkRemindersForDay(${day})">
                        <i class="fas fa-comment"></i>
                        Enviar a Todos
                    </button>
                </div>
                <div class="payment-day-clients">
                    ${dayClients
                      .map((client) => {
                        const paymentStatus = getClientPaymentStatus(client)
                        return `
                            <div class="payment-client-card">
                                <div class="payment-client-header">
                                    <div class="payment-client-name">
                                        <i class="fas fa-user"></i>
                                        ${client.name}
                                    </div>
                                    <span class="badge badge-${paymentStatus.class}">${paymentStatus.label}</span>
                                </div>
                                <div class="payment-client-info">
                                    <div><i class="fas fa-phone"></i> ${client.phone}</div>
                                    <div><i class="fas fa-dollar-sign"></i> ${formatCurrency(client.monthly_fee)}</div>
                                </div>
                                <div class="payment-client-actions">
                                    <button class="btn btn-sm btn-outline" onclick="sendPaymentReminderToClient(${client.id}, 'reminder')">
                                        Recordatorio
                                    </button>
                                    <button class="btn btn-sm btn-outline" onclick="sendPaymentReminderToClient(${client.id}, '${paymentStatus.status === "overdue" ? "final_warning" : "due_today"}')">
                                        ${paymentStatus.status === "overdue" ? "Urgente" : "Vence Hoy"}
                                    </button>
                                </div>
                            </div>
                        `
                      })
                      .join("")}
                </div>
            </div>
        `
    })
    .join("")
}

function renderInvoices() {
  const container = document.getElementById("invoicesContainer")
  const filteredInvoices = getFilteredInvoices()

  container.innerHTML = filteredInvoices
    .map(
      (invoice) => `
        <div class="invoice-card">
            <div class="invoice-header">
                <div class="invoice-info">
                    <div class="invoice-icon">
                        <i class="fas fa-file-invoice"></i>
                    </div>
                    <div class="invoice-details">
                        <h4>${invoice.invoice_number}</h4>
                        <div class="invoice-meta">
                            <div><i class="fas fa-user"></i> ${invoice.client_name}</div>
                            <div><i class="fas fa-calendar"></i> Vence: ${formatDate(invoice.due_date)}</div>
                            <div><i class="fas fa-dollar-sign"></i> ${formatCurrency(invoice.amount)}</div>
                        </div>
                        <p class="invoice-description">${invoice.description}</p>
                    </div>
                </div>
                <div class="invoice-actions-container">
                    <div class="invoice-amount">
                        <div class="amount">${formatCurrency(invoice.amount)}</div>
                        <span class="badge badge-${getPaymentBadgeClass(invoice.status)}">
                            ${getInvoiceStatusText(invoice.status)}
                        </span>
                    </div>
                    <div class="invoice-controls">
                        <div class="invoice-buttons">
                            <button class="btn btn-sm btn-outline" onclick="viewInvoice(${invoice.id})" title="Ver">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-outline" onclick="downloadInvoice(${invoice.id})" title="Descargar">
                                <i class="fas fa-download"></i>
                            </button>
                            <button class="btn btn-sm btn-outline" onclick="printInvoice(${invoice.id})" title="Imprimir">
                                <i class="fas fa-print"></i>
                            </button>
                        </div>
                        ${
                          invoice.status !== "paid"
                            ? `
                            <button class="btn btn-sm btn-success" onclick="markInvoiceAsPaid(${invoice.id})">
                                Marcar Pagada
                            </button>
                        `
                            : ""
                        }
                    </div>
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

function renderAntennas() {
  const container = document.getElementById("antennasGrid")

  container.innerHTML = antennas
    .map(
      (antenna) => `
        <div class="antenna-card">
            <div class="antenna-header">
                <div class="antenna-info">
                    <i class="fas fa-satellite-dish antenna-icon"></i>
                    <div>
                        <h3 class="antenna-name">${antenna.name}</h3>
                        <p class="antenna-date">Instalada: ${formatDate(antenna.installation_date)}</p>
                    </div>
                </div>
                <span class="badge badge-${getAntennaStatusClass(antenna.status)}">
                    ${getAntennaStatusText(antenna.status)}
                </span>
            </div>
            <div class="antenna-location">
                <i class="fas fa-map-marker-alt"></i>
                <span>${antenna.location}</span>
            </div>
            <div class="antenna-metrics">
                <div class="antenna-metric">
                    <div class="metric-header">
                        <span class="metric-label">Clientes Conectados</span>
                        <span class="metric-value ${getCapacityClass(antenna.connected_clients, antenna.max_capacity)}">
                            ${antenna.connected_clients}/${antenna.max_capacity}
                        </span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill ${getCapacityClass(antenna.connected_clients, antenna.max_capacity)}" 
                             style="width: ${(antenna.connected_clients / antenna.max_capacity) * 100}%"></div>
                    </div>
                </div>
                <div class="antenna-metric">
                    <div class="metric-header">
                        <span class="metric-label">Fuerza de Señal</span>
                        <span class="metric-value ${getSignalClass(antenna.signal_strength)}">${antenna.signal_strength}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill ${getSignalClass(antenna.signal_strength)}" 
                             style="width: ${antenna.signal_strength}%"></div>
                    </div>
                </div>
            </div>
            <div class="antenna-coverage">
                <p class="coverage-label">Área de Cobertura:</p>
                <p class="coverage-text">${antenna.coverage_area}</p>
            </div>
            <div class="antenna-maintenance">
                <span class="maintenance-label">Último Mantenimiento:</span>
                <span class="maintenance-date">${formatDate(antenna.last_maintenance)}</span>
            </div>
            <div class="antenna-actions">
                <button class="btn btn-sm btn-outline" onclick="editAntenna(${antenna.id})">
                    <i class="fas fa-cog"></i>
                    Configurar
                </button>
                ${
                  antenna.status === "active"
                    ? `
                    <button class="btn btn-sm btn-warning" onclick="setAntennaStatus(${antenna.id}, 'maintenance')">
                        <i class="fas fa-exclamation-triangle"></i>
                        Mantenimiento
                    </button>
                `
                    : `
                    <button class="btn btn-sm btn-success" onclick="setAntennaStatus(${antenna.id}, 'active')">
                        <i class="fas fa-check-circle"></i>
                        Activar
                    </button>
                `
                }
            </div>
        </div>
    `,
    )
    .join("")
}

function renderInstallations() {
  const container = document.getElementById("installationsContainer")

  container.innerHTML = installations
    .map(
      (installation) => `
        <div class="installation-card">
            <div class="installation-header">
                <div>
                    <h3 class="installation-client">${installation.client_name}</h3>
                    <p class="installation-phone">${installation.client_phone}</p>
                </div>
                <span class="badge badge-${getInstallationStatusClass(installation.status)}">
                    ${getInstallationStatusText(installation.status)}
                </span>
            </div>
            <div class="installation-details">
                <div class="installation-detail">
                    <i class="fas fa-satellite-dish"></i>
                    <span>${installation.antenna_name}</span>
                </div>
                <div class="installation-detail">
                    <i class="fas fa-calendar"></i>
                    <span>${formatDate(installation.installation_date)}</span>
                </div>
                <div class="installation-detail">
                    <i class="fas fa-user"></i>
                    <span>${installation.technician_name}</span>
                </div>
                <div class="installation-detail">
                    <i class="fas fa-dollar-sign"></i>
                    <span>${formatCurrency(installation.installation_cost)}</span>
                </div>
            </div>
            <div class="installation-equipment">
                <p class="equipment-label">Equipo:</p>
                <p class="equipment-text">${installation.equipment_details}</p>
                ${
                  installation.notes
                    ? `
                    <div class="installation-notes">
                        <p class="notes-label">Notas:</p>
                        <p class="notes-text">${installation.notes}</p>
                    </div>
                `
                    : ""
                }
            </div>
            ${
              installation.status === "pending"
                ? `
                <div class="installation-actions">
                    <button class="btn btn-sm btn-success" onclick="setInstallationStatus(${installation.id}, 'completed')">
                        Marcar Completada
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="setInstallationStatus(${installation.id}, 'cancelled')">
                        Cancelar
                    </button>
                </div>
            `
                : ""
            }
        </div>
    `,
    )
    .join("")
}

// Utility functions
function formatCurrency(amount) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateString) {
  if (!dateString) return "N/A"
  return new Date(dateString).toLocaleDateString("es-CO")
}

function getPaymentIcon(status) {
  switch (status) {
    case "paid":
      return "fa-check-circle"
    case "overdue":
      return "fa-exclamation-triangle"
    default:
      return "fa-clock"
  }
}

function getPaymentIconClass(status) {
  switch (status) {
    case "paid":
      return "success"
    case "overdue":
      return "danger"
    default:
      return "warning"
  }
}

function getPaymentBadgeClass(status) {
  switch (status) {
    case "paid":
      return "success"
    case "overdue":
      return "danger"
    default:
      return "secondary"
  }
}

function getPaymentStatusText(status) {
  switch (status) {
    case "paid":
      return "Pagado"
    case "overdue":
      return "Vencido"
    default:
      return "Pendiente"
  }
}

function getPaymentMethodText(method) {
  switch (method) {
    case "cash":
      return "Efectivo"
    case "transfer":
      return "Transferencia"
    case "card":
      return "Tarjeta"
    default:
      return "N/A"
  }
}

function getInvoiceStatusText(status) {
  switch (status) {
    case "paid":
      return "Pagada"
    case "overdue":
      return "Vencida"
    default:
      return "Pendiente"
  }
}

function getAntennaStatusClass(status) {
  switch (status) {
    case "active":
      return "success"
    case "maintenance":
      return "warning"
    default:
      return "danger"
  }
}

function getAntennaStatusText(status) {
  switch (status) {
    case "active":
      return "Activa"
    case "maintenance":
      return "Mantenimiento"
    default:
      return "Inactiva"
  }
}

function getInstallationStatusClass(status) {
  switch (status) {
    case "completed":
      return "success"
    case "cancelled":
      return "danger"
    default:
      return "secondary"
  }
}

function getInstallationStatusText(status) {
  switch (status) {
    case "completed":
      return "Completada"
    case "cancelled":
      return "Cancelada"
    default:
      return "Pendiente"
  }
}

function getCapacityClass(current, max) {
  const percentage = (current / max) * 100
  if (percentage < 70) return "success"
  if (percentage < 90) return "warning"
  return "danger"
}

function getSignalClass(strength) {
  if (strength >= 90) return "success"
  if (strength >= 75) return "warning"
  return "danger"
}

function getClientPaymentStatus(client) {
  const today = new Date().getDate()
  const paymentDay = Number.parseInt(client.payment_day)

  if (today === paymentDay) {
    return { status: "due_today", label: "Vence Hoy", class: "warning" }
  } else if (today > paymentDay) {
    return { status: "overdue", label: "Vencido", class: "danger" }
  } else if (today >= paymentDay - 3) {
    return { status: "upcoming", label: "Próximo", class: "secondary" }
  } else {
    return { status: "current", label: "Al día", class: "success" }
  }
}

function getFilteredPayments() {
  const filter = document.getElementById("paymentFilter")?.value || "all"
  if (filter === "all") return payments
  return payments.filter((payment) => payment.status === filter)
}

function getFilteredInvoices() {
  const filter = document.getElementById("invoiceFilter")?.value || "all"
  if (filter === "all") return invoices
  return invoices.filter((invoice) => invoice.status === filter)
}

function filterClients(searchTerm) {
  const cards = document.querySelectorAll(".client-card")
  cards.forEach((card) => {
    const text = card.textContent.toLowerCase()
    if (text.includes(searchTerm.toLowerCase())) {
      card.style.display = "block"
    } else {
      card.style.display = "none"
    }
  })
}

function filterPayments(status) {
  renderPayments()
}

function filterInvoices(status) {
  renderInvoices()
}

function populateClientSelects() {
  const selects = ["paymentClient", "invoiceClient"]
  selects.forEach((selectId) => {
    const select = document.getElementById(selectId)
    if (select) {
      select.innerHTML =
        '<option value="">Seleccionar cliente</option>' +
        clients.map((client) => `<option value="${client.id}">${client.name}</option>`).join("")
    }
  })
}

function populateAntennaSelects() {
  const select = document.getElementById("clientAntenna")
  if (select) {
    select.innerHTML =
      '<option value="">Seleccionar antena</option>' +
      antennas.map((antenna) => `<option value="${antenna.id}">${antenna.name}</option>`).join("")
  }
}

// Modal functions
function openModal(modalId) {
  document.getElementById(modalId).classList.add("show")

  // Auto-populate client fee when client is selected
  if (modalId === "paymentModal" || modalId === "invoiceModal") {
    const clientSelect = document.getElementById(modalId === "paymentModal" ? "paymentClient" : "invoiceClient")
    const amountInput = document.getElementById(modalId === "paymentModal" ? "paymentAmount" : "invoiceAmount")

    clientSelect.addEventListener("change", function () {
      const client = clients.find((c) => c.id == this.value)
      if (client) {
        amountInput.value = client.monthly_fee
      }
    })
  }
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("show")
}

function showLoading() {
  document.getElementById("loadingSpinner").classList.add("show")
}

function hideLoading() {
  document.getElementById("loadingSpinner").classList.remove("show")
}

function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer")
  const toast = document.createElement("div")
  toast.className = `toast toast-${type}`
  toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${getToastIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `

  container.appendChild(toast)

  setTimeout(() => {
    toast.remove()
  }, 5000)
}

function getToastIcon(type) {
  switch (type) {
    case "success":
      return "fa-check-circle"
    case "error":
      return "fa-exclamation-circle"
    case "warning":
      return "fa-exclamation-triangle"
    default:
      return "fa-info-circle"
  }
}

function showClientActionsModal(client) {
  // Create and show client actions modal
  const modal = document.createElement("div")
  modal.className = "modal show"
  modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Cliente Creado Exitosamente</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 0.5rem; padding: 1rem; margin-bottom: 1rem;">
                    <h4 style="color: #166534; font-weight: 600;">✅ Cliente: ${client.name}</h4>
                    <p style="color: #059669; font-size: 0.875rem;">Teléfono: ${client.phone}</p>
                    <p style="color: #059669; font-size: 0.875rem;">Tarifa: ${formatCurrency(client.monthly_fee)}</p>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem;">
                    <button class="btn btn-primary" onclick="addPaymentForClient(${client.id}); this.closest('.modal').remove();">
                        <i class="fas fa-dollar-sign"></i>
                        Agregar Pago
                    </button>
                    <button class="btn btn-success" onclick="addInstallationForClient(${client.id}); this.closest('.modal').remove();">
                        <i class="fas fa-map-marker-alt"></i>
                        Programar Instalación
                    </button>
                </div>
                <button class="btn btn-outline w-full" onclick="this.closest('.modal').remove()">
                    Continuar Más Tarde
                </button>
            </div>
        </div>
    `

  document.body.appendChild(modal)
}

// Action functions
function addPaymentForClient(clientId) {
  const client = clients.find((c) => c.id == clientId)
  if (client) {
    openModal("paymentModal")
    document.getElementById("paymentClient").value = clientId
    document.getElementById("paymentAmount").value = client.monthly_fee

    // Set due date to client's payment day of current month
    const today = new Date()
    const dueDate = new Date(today.getFullYear(), today.getMonth(), client.payment_day)
    document.getElementById("paymentDueDate").value = dueDate.toISOString().split("T")[0]
  }
}

function addInstallationForClient(clientId) {
  showSection("installations")
  // Here you would open the installation modal with the client pre-selected
  // For now, just navigate to installations section
}

async function markPaymentAsPaid(paymentId) {
  showLoading()
  try {
    const response = await fetch("api/payments.php", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: paymentId,
        status: "paid",
        payment_method: "cash",
        payment_date: new Date().toISOString().split("T")[0],
      }),
    })

    const data = await response.json()
    if (data.success) {
      showToast("Pago marcado como pagado", "success")
      await loadPayments()
      renderPayments()
      updateDashboardStats()
    } else {
      showToast("Error al actualizar pago", "error")
    }
  } catch (error) {
    showToast("Error de conexión", "error")
  } finally {
    hideLoading()
  }
}

async function markInvoiceAsPaid(invoiceId) {
  showLoading()
  try {
    const response = await fetch("api/invoices.php", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: invoiceId,
        status: "paid",
        payment_method: "cash",
      }),
    })

    const data = await response.json()
    if (data.success) {
      showToast("Factura marcada como pagada", "success")
      await loadInvoices()
      renderInvoices()
    } else {
      showToast("Error al actualizar factura", "error")
    }
  } catch (error) {
    showToast("Error de conexión", "error")
  } finally {
    hideLoading()
  }
}

function sendWhatsApp(phone, name) {
  const message = `Hola ${name}, esperamos que estés disfrutando de nuestro servicio de internet. ¿Hay algo en lo que podamos ayudarte?`
  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodedMessage}`
  window.open(whatsappUrl, "_blank")
}

function sendPaymentReminder(paymentId, type) {
  const payment = payments.find((p) => p.id == paymentId)
  if (!payment) return

  let message = ""
  switch (type) {
    case "reminder":
      message = `Hola ${payment.client_name}, te recordamos que tu pago mensual de ${formatCurrency(payment.amount)} vence el ${formatDate(payment.due_date)}. ¡Gracias por confiar en nuestro servicio!`
      break
    case "due_today":
      message = `${payment.client_name}, tu pago de ${formatCurrency(payment.amount)} vence HOY (${formatDate(payment.due_date)}). Por favor realiza el pago para mantener tu servicio activo.`
      break
    case "final_warning":
      message = `ÚLTIMA ADVERTENCIA: ${payment.client_name}, tu pago de ${formatCurrency(payment.amount)} está VENCIDO desde el ${formatDate(payment.due_date)}. Realiza el pago inmediatamente para evitar la suspensión del servicio.`
      break
  }

  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = `https://wa.me/${payment.client_phone.replace(/\D/g, "")}?text=${encodedMessage}`
  window.open(whatsappUrl, "_blank")
}

function sendPaymentReminderToClient(clientId, type) {
  const client = clients.find((c) => c.id == clientId)
  if (!client) return

  let message = ""
  switch (type) {
    case "reminder":
      message = `Hola ${client.name}, te recordamos que tu pago mensual de ${formatCurrency(client.monthly_fee)} vence el día ${client.payment_day}. ¡Gracias por confiar en nuestro servicio!`
      break
    case "due_today":
      message = `${client.name}, tu pago de ${formatCurrency(client.monthly_fee)} vence HOY (${client.payment_day}). Por favor realiza el pago para mantener tu servicio activo.`
      break
    case "final_warning":
      message = `ÚLTIMA ADVERTENCIA: ${client.name}, tu pago de ${formatCurrency(client.monthly_fee)} está VENCIDO desde el día ${client.payment_day}. Realiza el pago inmediatamente para evitar la suspensión del servicio.`
      break
  }

  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = `https://wa.me/${client.phone.replace(/\D/g, "")}?text=${encodedMessage}`
  window.open(whatsappUrl, "_blank")
}

function sendBulkReminders(type) {
  let targetClients = []

  switch (type) {
    case "reminder":
      targetClients = clients.filter((client) => {
        const payment = payments.find((p) => p.client_id == client.id && p.status === "pending")
        return payment
      })
      break
    case "overdue":
      targetClients = clients.filter((client) => {
        const payment = payments.find((p) => p.client_id == client.id && p.status === "overdue")
        return payment
      })
      break
    case "upcoming":
      const today = new Date().getDate()
      targetClients = clients.filter((client) => {
        const paymentDay = Number.parseInt(client.payment_day)
        return paymentDay >= today && paymentDay <= today + 3
      })
      break
    case "due_today":
      const currentDay = new Date().getDate()
      targetClients = clients.filter((client) => Number.parseInt(client.payment_day) === currentDay)
      break
    case "final_warning":
      targetClients = clients.filter((client) => {
        const payment = payments.find((p) => p.client_id == client.id && p.status === "overdue")
        return payment
      })
      break
  }

  targetClients.forEach((client, index) => {
    setTimeout(() => {
      sendPaymentReminderToClient(client.id, type === "overdue" ? "final_warning" : type)
    }, index * 500) // 500ms delay between messages
  })

  showToast(`Enviando ${targetClients.length} recordatorios...`, "info")
}

function sendBulkRemindersForDay(day) {
  const dayClients = clients.filter((client) => Number.parseInt(client.payment_day) === Number.parseInt(day))

  dayClients.forEach((client, index) => {
    setTimeout(() => {
      sendPaymentReminderToClient(client.id, "reminder")
    }, index * 500)
  })

  showToast(`Enviando recordatorios a ${dayClients.length} clientes del día ${day}...`, "info")
}

function downloadInvoice(invoiceId) {
  const invoice = invoices.find((i) => i.id == invoiceId)
  if (!invoice) return

  // Create invoice content
  const invoiceContent = `
FACTURA: ${invoice.invoice_number}
Cliente: ${invoice.client_name}
Teléfono: ${invoice.client_phone}
Dirección: ${invoice.client_address}

Descripción: ${invoice.description}
Monto: ${formatCurrency(invoice.amount)}
Fecha de emisión: ${formatDate(invoice.issue_date)}
Fecha de vencimiento: ${formatDate(invoice.due_date)}
Estado: ${getInvoiceStatusText(invoice.status)}
${invoice.payment_method ? `Método de pago: ${getPaymentMethodText(invoice.payment_method)}` : ""}
    `

  const blob = new Blob([invoiceContent], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${invoice.invoice_number}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function printInvoice(invoiceId) {
  const invoice = invoices.find((i) => i.id == invoiceId)
  if (!invoice) return

  const printContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px;">
                <h1 style="color: #333; margin: 0;">FACTURA</h1>
                <h2 style="color: #666; margin: 5px 0;">${invoice.invoice_number}</h2>
            </div>
            
            <div style="margin-bottom: 30px;">
                <h3 style="color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Datos del Cliente</h3>
                <p><strong>Nombre:</strong> ${invoice.client_name}</p>
                <p><strong>Teléfono:</strong> ${invoice.client_phone}</p>
                <p><strong>Dirección:</strong> ${invoice.client_address}</p>
            </div>
            
            <div style="margin-bottom: 30px;">
                <h3 style="color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Detalles de la Factura</h3>
                <p><strong>Descripción:</strong> ${invoice.description}</p>
                <p><strong>Fecha de emisión:</strong> ${formatDate(invoice.issue_date)}</p>
                <p><strong>Fecha de vencimiento:</strong> ${formatDate(invoice.due_date)}</p>
            </div>
            
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; text-align: center;">
                <h2 style="color: #333; margin: 0;">TOTAL A PAGAR</h2>
                <h1 style="color: #2563eb; margin: 10px 0; font-size: 2.5em;">${formatCurrency(invoice.amount)}</h1>
            </div>
            
            <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
                <p>Gracias por confiar en nuestro servicio de internet</p>
                <p>Para consultas: contacto@internetservice.com</p>
            </div>
        </div>
    `

  const printWindow = window.open("", "_blank")
  if (printWindow) {
    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.print()
  }
}

// Close modals when clicking outside
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) {
    e.target.classList.remove("show")
  }
})

// Close modals with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal.show").forEach((modal) => {
      modal.classList.remove("show")
    })
  }
})
