"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Phone, DollarSign, MessageCircle, AlertTriangle, TrendingUp, FileText, Clock } from "lucide-react"

// Tasa BCV simulada (en un sistema real vendría de una API)
const BCV_RATE = 36.5 // 1 USD = 36.50 VES

const mockClients = [
  {
    id: 1,
    name: "Juan Pérez",
    phone: "+58 414 123 4567",
    monthlyFee: 25, // USD
    paymentDay: 5,
    status: "active",
    lastPayment: "2024-11-05",
  },
  {
    id: 2,
    name: "María González",
    phone: "+58 424 234 5678",
    monthlyFee: 25, // USD
    paymentDay: 10,
    status: "active",
    lastPayment: "2024-11-10",
  },
  {
    id: 3,
    name: "Carlos Rodríguez",
    phone: "+58 412 345 6789",
    monthlyFee: 30, // USD
    paymentDay: 15,
    status: "active",
    lastPayment: "2024-10-15",
  },
  {
    id: 4,
    name: "Ana Martínez",
    phone: "+58 426 456 7890",
    monthlyFee: 25, // USD
    paymentDay: 20,
    status: "active",
    lastPayment: "2024-11-20",
  },
  {
    id: 5,
    name: "Luis Hernández",
    phone: "+58 416 567 8901",
    monthlyFee: 25, // USD
    paymentDay: 25,
    status: "active",
    lastPayment: "2024-11-25",
  },
]

// Facturas emitidas con más detalles
const mockInvoices = [
  {
    id: 1,
    clientId: 1,
    invoiceNumber: "INV-2024-001",
    amount: 25, // USD
    issueDate: "2024-12-01",
    dueDate: "2024-12-06",
    status: "paid",
    period: "Diciembre 2024",
    description: "Servicio de Internet - Plan Básico",
    reference: "Pago en efectivo",
  },
  {
    id: 2,
    clientId: 2,
    invoiceNumber: "INV-2024-002",
    amount: 25, // USD
    issueDate: "2024-12-01",
    dueDate: "2024-12-11",
    status: "pending",
    period: "Diciembre 2024",
    description: "Servicio de Internet - Plan Básico",
    reference: "Pendiente de pago",
  },
  {
    id: 3,
    clientId: 3,
    invoiceNumber: "INV-2024-003",
    amount: 30, // USD
    issueDate: "2024-11-01",
    dueDate: "2024-11-16",
    status: "overdue",
    period: "Noviembre 2024",
    description: "Servicio de Internet - Plan Premium",
    reference: "Factura vencida",
  },
  {
    id: 4,
    clientId: 4,
    invoiceNumber: "INV-2024-004",
    amount: 25, // USD
    issueDate: "2024-12-01",
    dueDate: "2024-12-21",
    status: "pending",
    period: "Diciembre 2024",
    description: "Servicio de Internet - Plan Básico",
    reference: "Pendiente de pago",
  },
  {
    id: 5,
    clientId: 5,
    invoiceNumber: "INV-2024-005",
    amount: 25, // USD
    issueDate: "2024-11-01",
    dueDate: "2024-11-26",
    status: "overdue",
    period: "Noviembre 2024",
    description: "Servicio de Internet - Plan Básico",
    reference: "Factura vencida",
  },
  // Facturas adicionales para mostrar más variedad
  {
    id: 6,
    clientId: 1,
    invoiceNumber: "INV-2024-006",
    amount: 25, // USD
    issueDate: "2024-11-01",
    dueDate: "2024-11-06",
    status: "paid",
    period: "Noviembre 2024",
    description: "Servicio de Internet - Plan Básico",
    reference: "Pago transferencia",
  },
  {
    id: 7,
    clientId: 2,
    invoiceNumber: "INV-2024-007",
    amount: 25, // USD
    issueDate: "2024-10-01",
    dueDate: "2024-10-11",
    status: "overdue",
    period: "Octubre 2024",
    description: "Servicio de Internet - Plan Básico",
    reference: "Factura vencida",
  },
]

// Pagos realizados con más detalles
const mockPayments = [
  {
    id: 1,
    clientId: 1,
    invoiceId: 1,
    amount: 25, // USD
    currency: "USD",
    paymentDate: "2024-12-05",
    status: "paid",
    method: "Efectivo",
    reference: "Pago completo diciembre",
    notes: "Pago recibido en oficina",
  },
  {
    id: 2,
    clientId: 1,
    invoiceId: 6,
    amount: 25, // USD
    currency: "USD",
    paymentDate: "2024-11-05",
    status: "paid",
    method: "Transferencia",
    reference: "TRF-001234",
    notes: "Transferencia Banesco",
  },
  {
    id: 3,
    clientId: 2,
    invoiceId: 2,
    amount: 15, // USD (pago parcial)
    currency: "USD",
    paymentDate: "2024-12-10",
    status: "paid",
    method: "Pago Móvil",
    reference: "PM-567890",
    notes: "Pago parcial - pendiente $10",
  },
]

export default function AccountsReceivableManager() {
  const [selectedFilter, setSelectedFilter] = useState("all")

  // Calcular saldo por cliente
  const getClientBalance = (clientId: number) => {
    const clientInvoices = mockInvoices.filter((inv) => inv.clientId === clientId)
    const clientPayments = mockPayments.filter((pay) => pay.clientId === clientId && pay.status === "paid")

    const totalInvoiced = clientInvoices.reduce((sum, inv) => sum + inv.amount, 0)
    const totalPaid = clientPayments.reduce((sum, pay) => sum + pay.amount, 0)

    const overdueInvoices = clientInvoices.filter((inv) => inv.status === "overdue")
    const pendingInvoices = clientInvoices.filter((inv) => inv.status === "pending")
    const paidInvoices = clientInvoices.filter((inv) => inv.status === "paid")

    return {
      invoiced: totalInvoiced,
      paid: totalPaid,
      balance: totalInvoiced - totalPaid,
      overdue: overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0),
      pending: pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0),
      overdueInvoices,
      pendingInvoices,
      paidInvoices,
    }
  }

  // Obtener estado del cliente
  const getClientStatus = (clientId: number) => {
    const balance = getClientBalance(clientId)

    if (balance.overdue > 0) {
      return {
        status: "overdue",
        label: "Vencido",
        color: "bg-red-500",
        textColor: "text-red-700",
        bgColor: "bg-red-50",
      }
    } else if (balance.pending > 0) {
      return {
        status: "pending",
        label: "Pendiente",
        color: "bg-yellow-500",
        textColor: "text-yellow-700",
        bgColor: "bg-yellow-50",
      }
    } else if (balance.balance <= 0) {
      return {
        status: "current",
        label: "Al día",
        color: "bg-green-500",
        textColor: "text-green-700",
        bgColor: "bg-green-50",
      }
    } else {
      return {
        status: "upcoming",
        label: "Por vencer",
        color: "bg-blue-500",
        textColor: "text-blue-700",
        bgColor: "bg-blue-50",
      }
    }
  }

  // Formatear moneda
  const formatCurrency = (amount: number, currency: "USD" | "VES" = "USD") => {
    if (currency === "USD") {
      return `$${amount.toFixed(2)} USD`
    } else {
      return `Bs. ${(amount * BCV_RATE).toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
  }

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-VE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Generar PDF de movimientos financieros
  const generateFinancialMovementsPDF = (client: any) => {
    const balance = getClientBalance(client.id)
    const clientInvoices = mockInvoices.filter((inv) => inv.clientId === client.id)
    const clientPayments = mockPayments.filter((pay) => pay.clientId === client.id)

    // Combinar facturas y pagos para crear un historial cronológico
    const movements = [
      ...clientInvoices.map((inv) => ({
        date: inv.issueDate,
        type: "Factura",
        description: `${inv.invoiceNumber} - ${inv.description}`,
        amount: inv.amount,
        status: inv.status,
        reference: inv.reference,
        dueDate: inv.dueDate,
      })),
      ...clientPayments.map((pay) => ({
        date: pay.paymentDate,
        type: "Pago",
        description: `Pago ${pay.method}`,
        amount: -pay.amount, // Negativo para pagos
        status: pay.status,
        reference: pay.reference,
        notes: pay.notes,
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const pdfContent = `
REPORTE DE MOVIMIENTOS FINANCIEROS
Cliente: ${client.name}
Teléfono: ${client.phone}
Día de pago: ${client.paymentDay} de cada mes
Fecha del reporte: ${new Date().toLocaleDateString("es-VE")}
Tasa BCV: Bs. ${BCV_RATE.toFixed(2)} por USD

RESUMEN FINANCIERO:
• Total facturado: ${formatCurrency(balance.invoiced)}
• Total pagado: ${formatCurrency(balance.paid)}
• Saldo pendiente: ${formatCurrency(balance.balance)}
• Facturas vencidas: ${formatCurrency(balance.overdue)}
• Facturas pendientes: ${formatCurrency(balance.pending)}

HISTORIAL DE MOVIMIENTOS:
${movements
  .map(
    (mov, index) => `
${index + 1}. ${mov.type.toUpperCase()}
   Fecha: ${formatDate(mov.date)}
   Descripción: ${mov.description}
   Monto: ${formatCurrency(Math.abs(mov.amount))} ${mov.amount < 0 ? "(Pago)" : "(Factura)"}
   Estado: ${mov.status === "paid" ? "Pagado" : mov.status === "pending" ? "Pendiente" : "Vencido"}
   Referencia: ${mov.reference}
   ${mov.dueDate ? `Vencimiento: ${formatDate(mov.dueDate)}` : ""}
   ${mov.notes ? `Notas: ${mov.notes}` : ""}
`,
  )
  .join("")}

FACTURAS VENCIDAS (${balance.overdueInvoices.length}):
${balance.overdueInvoices
  .map(
    (inv) => `
• ${inv.invoiceNumber} - ${formatCurrency(inv.amount)}
  Vencida: ${formatDate(inv.dueDate)}
  Descripción: ${inv.description}
`,
  )
  .join("")}

FACTURAS PENDIENTES (${balance.pendingInvoices.length}):
${balance.pendingInvoices
  .map(
    (inv) => `
• ${inv.invoiceNumber} - ${formatCurrency(inv.amount)}
  Vence: ${formatDate(inv.dueDate)}
  Descripción: ${inv.description}
`,
  )
  .join("")}

ÚLTIMOS PAGOS (${balance.paidInvoices.length}):
${balance.paidInvoices
  .map(
    (inv) => `
• ${inv.invoiceNumber} - ${formatCurrency(inv.amount)}
  Período: ${inv.period}
  Estado: Pagado
`,
  )
  .join("")}

FORMAS DE PAGO DISPONIBLES:
• Dólares en efectivo
• Transferencia en Bolívares: ${formatCurrency(balance.balance, "VES")}
• Pago móvil en Bolívares

NOTA IMPORTANTE:
Para pagos en Bolívares, usar la tasa BCV del día del pago.
${balance.overdue > 0 ? "ADVERTENCIA: Su servicio puede ser suspendido por facturas vencidas." : ""}

Reporte generado automáticamente por el Sistema de Gestión de Internet
    `

    const blob = new Blob([pdfContent], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Movimientos_Financieros_${client.name.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const sendAccountStatement = (client: any) => {
    const balance = getClientBalance(client.id)
    const clientStatus = getClientStatus(client.id)

    let message = `📋 *ESTADO DE CUENTA*
👤 Cliente: *${client.name}*
📞 Teléfono: ${client.phone}
📅 Fecha: ${new Date().toLocaleDateString("es-VE")}

💰 *RESUMEN FINANCIERO:*
• Total facturado: ${formatCurrency(balance.invoiced)}
• Total pagado: ${formatCurrency(balance.paid)}
• *Saldo pendiente: ${formatCurrency(balance.balance)}*

`

    // Facturas vencidas
    if (balance.overdueInvoices.length > 0) {
      message += `🚨 *FACTURAS VENCIDAS (${balance.overdueInvoices.length}):*\n`
      balance.overdueInvoices.forEach((invoice) => {
        message += `• ${invoice.invoiceNumber} - ${formatCurrency(invoice.amount)} - Vencida: ${formatDate(invoice.dueDate)}\n`
      })
      message += `*Total vencido: ${formatCurrency(balance.overdue)}*\n\n`
    }

    // Facturas pendientes
    if (balance.pendingInvoices.length > 0) {
      message += `⏰ *FACTURAS PENDIENTES (${balance.pendingInvoices.length}):*\n`
      balance.pendingInvoices.forEach((invoice) => {
        message += `• ${invoice.invoiceNumber} - ${formatCurrency(invoice.amount)} - Vence: ${formatDate(invoice.dueDate)}\n`
      })
      message += `*Total pendiente: ${formatCurrency(balance.pending)}*\n\n`
    }

    // Facturas pagadas (últimas 3)
    if (balance.paidInvoices.length > 0) {
      const recentPaid = balance.paidInvoices.slice(-3)
      message += `✅ *ÚLTIMOS PAGOS (${recentPaid.length}):*\n`
      recentPaid.forEach((invoice) => {
        message += `• ${invoice.invoiceNumber} - ${formatCurrency(invoice.amount)} - ${invoice.period}\n`
      })
      message += `\n`
    }

    message += `💱 *TASA BCV HOY:* 1 USD = Bs. ${BCV_RATE.toFixed(2)}

🏦 *FORMAS DE PAGO:*
• Dólares en efectivo
• Transferencia en Bolívares: ${formatCurrency(balance.balance, "VES")}
• Pago móvil en Bolívares

`

    if (balance.overdue > 0) {
      message += `⚠️ *IMPORTANTE:* Su servicio puede ser suspendido por facturas vencidas.

`
    }

    message += `Para consultas: contacto@internetservice.com
¡Gracias por confiar en nuestro servicio! 🌐`

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${client.phone.replace(/\D/g, "")}?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
  }

  // Filtrar clientes
  const filteredClients = mockClients.filter((client) => {
    if (selectedFilter === "all") return true
    const status = getClientStatus(client.id)
    return status.status === selectedFilter
  })

  // Calcular totales generales
  const totalOverdue = mockClients.reduce((sum, client) => sum + getClientBalance(client.id).overdue, 0)
  const totalPending = mockClients.reduce((sum, client) => sum + getClientBalance(client.id).pending, 0)
  const totalBalance = mockClients.reduce((sum, client) => sum + getClientBalance(client.id).balance, 0)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl">Cuentas por Cobrar</CardTitle>
              <CardDescription>
                Gestión de saldos y estados de cuenta - Tasa BCV: Bs. {BCV_RATE.toFixed(2)} por USD
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-red-50 border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-800 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Monto Vencido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">{formatCurrency(totalOverdue)}</div>
            <p className="text-xs text-red-600">{formatCurrency(totalOverdue, "VES")}</p>
            <p className="text-xs text-red-500 mt-1">
              {mockClients.filter((c) => getClientStatus(c.id).status === "overdue").length} clientes
            </p>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800 flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Monto Por Vencer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">{formatCurrency(totalPending)}</div>
            <p className="text-xs text-yellow-600">{formatCurrency(totalPending, "VES")}</p>
            <p className="text-xs text-yellow-500 mt-1">
              {mockClients.filter((c) => getClientStatus(c.id).status === "pending").length} clientes
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800 flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Total por Cobrar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{formatCurrency(totalBalance)}</div>
            <p className="text-xs text-blue-600">{formatCurrency(totalBalance, "VES")}</p>
            <p className="text-xs text-blue-500 mt-1">Saldo total pendiente</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Clientes al Día
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {mockClients.filter((c) => getClientStatus(c.id).status === "current").length}
            </div>
            <p className="text-xs text-green-600">de {mockClients.length} clientes</p>
            <p className="text-xs text-green-500 mt-1">
              {(
                (mockClients.filter((c) => getClientStatus(c.id).status === "current").length / mockClients.length) *
                100
              ).toFixed(1)}
              % al día
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedFilter === "all" ? "default" : "outline"}
          onClick={() => setSelectedFilter("all")}
          size="sm"
        >
          Todos ({mockClients.length})
        </Button>
        <Button
          variant={selectedFilter === "overdue" ? "destructive" : "outline"}
          onClick={() => setSelectedFilter("overdue")}
          size="sm"
        >
          Vencidos ({mockClients.filter((c) => getClientStatus(c.id).status === "overdue").length})
        </Button>
        <Button
          variant={selectedFilter === "pending" ? "default" : "outline"}
          onClick={() => setSelectedFilter("pending")}
          size="sm"
          className={selectedFilter === "pending" ? "bg-yellow-600 hover:bg-yellow-700" : ""}
        >
          Pendientes ({mockClients.filter((c) => getClientStatus(c.id).status === "pending").length})
        </Button>
        <Button
          variant={selectedFilter === "current" ? "default" : "outline"}
          onClick={() => setSelectedFilter("current")}
          size="sm"
          className={selectedFilter === "current" ? "bg-green-600 hover:bg-green-700" : ""}
        >
          Al día ({mockClients.filter((c) => getClientStatus(c.id).status === "current").length})
        </Button>
      </div>

      {/* Clients List */}
      <div className="space-y-4">
        {filteredClients.map((client) => {
          const balance = getClientBalance(client.id)
          const status = getClientStatus(client.id)

          return (
            <Card
              key={client.id}
              className={`hover:shadow-md transition-shadow ${status.bgColor} border-l-4 ${status.color.replace("bg-", "border-")}`}
            >
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${status.bgColor}`}>
                      <DollarSign className={`h-6 w-6 ${status.textColor}`} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-lg">{client.name}</h3>
                        <Badge className={`${status.color} text-white`}>{status.label}</Badge>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4" />
                          <span>{client.phone}</span>
                        </div>
                        <div>
                          <span className="font-medium">Día de pago:</span> {client.paymentDay} de cada mes
                        </div>
                        <div>
                          <span className="font-medium">Tarifa mensual:</span> {formatCurrency(client.monthlyFee)}
                        </div>
                      </div>

                      {/* Detalles de facturas */}
                      <div className="mt-3 space-y-1 text-xs">
                        {balance.overdueInvoices.length > 0 && (
                          <div className="text-red-600">
                            <span className="font-medium">Vencidas:</span> {balance.overdueInvoices.length} facturas por{" "}
                            {formatCurrency(balance.overdue)}
                          </div>
                        )}
                        {balance.pendingInvoices.length > 0 && (
                          <div className="text-yellow-600">
                            <span className="font-medium">Pendientes:</span> {balance.pendingInvoices.length} facturas
                            por {formatCurrency(balance.pending)}
                          </div>
                        )}
                        {balance.paidInvoices.length > 0 && (
                          <div className="text-green-600">
                            <span className="font-medium">Pagadas:</span> {balance.paidInvoices.length} facturas
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Saldo Total</p>
                      <p className="font-bold text-xl">{formatCurrency(balance.balance)}</p>
                      <p className="text-sm text-gray-500">{formatCurrency(balance.balance, "VES")}</p>

                      {balance.overdue > 0 && (
                        <div className="mt-2 text-right">
                          <p className="text-xs text-red-600 font-medium">Vencido: {formatCurrency(balance.overdue)}</p>
                        </div>
                      )}

                      {balance.pending > 0 && (
                        <div className="mt-1 text-right">
                          <p className="text-xs text-yellow-600 font-medium">
                            Por vencer: {formatCurrency(balance.pending)}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        onClick={() => sendAccountStatement(client)}
                        className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Estado de Cuenta
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => generateFinancialMovementsPDF(client)}
                        className="flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        Reporte PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredClients.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">No hay clientes que coincidan con el filtro seleccionado.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
