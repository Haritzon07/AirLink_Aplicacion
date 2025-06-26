"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  FileText,
  Plus,
  Download,
  Eye,
  Printer,
  Calendar,
  DollarSign,
  User,
  Zap,
  CheckSquare,
  MessageCircle,
} from "lucide-react"

// Tasa BCV simulada
const BCV_RATE = 36.5

const mockInvoices = [
  {
    id: 1,
    invoiceNumber: "FAC-2024-001",
    clientId: 1,
    clientName: "Juan Pérez",
    clientPhone: "+58 414 123 4567",
    clientAddress: "Calle 10 #15-20, Barrio El Prado",
    amount: 25, // USD
    issueDate: "2024-12-01",
    dueDate: "2024-12-06",
    status: "paid",
    description: "Servicio de Internet - Período: 05/11/2024 al 04/12/2024",
    paymentMethod: "cash",
    billingPeriodStart: "2024-11-05",
    billingPeriodEnd: "2024-12-04",
    paymentDay: 5,
  },
  {
    id: 2,
    invoiceNumber: "FAC-2024-002",
    clientId: 2,
    clientName: "María González",
    clientPhone: "+58 424 234 5678",
    clientAddress: "Carrera 8 #25-30, Barrio San José",
    amount: 25, // USD
    issueDate: "2024-12-01",
    dueDate: "2024-12-11",
    status: "pending",
    description: "Servicio de Internet - Período: 10/11/2024 al 09/12/2024",
    paymentMethod: null,
    billingPeriodStart: "2024-11-10",
    billingPeriodEnd: "2024-12-09",
    paymentDay: 10,
  },
  {
    id: 3,
    invoiceNumber: "FAC-2024-003",
    clientId: 3,
    clientName: "Carlos Rodríguez",
    clientPhone: "+58 412 345 6789",
    clientAddress: "Calle 15 #8-12, Centro",
    amount: 30, // USD
    issueDate: "2024-11-01",
    dueDate: "2024-11-16",
    status: "overdue",
    description: "Servicio de Internet - Período: 15/10/2024 al 14/11/2024",
    paymentMethod: null,
    billingPeriodStart: "2024-10-15",
    billingPeriodEnd: "2024-11-14",
    paymentDay: 15,
  },
]

const mockClients = [
  {
    id: 1,
    name: "Juan Pérez",
    phone: "+58 414 123 4567",
    address: "Calle 10 #15-20",
    monthlyFee: 25, // USD
    paymentDay: 5,
    lastInvoiceDate: "2024-12-01",
  },
  {
    id: 2,
    name: "María González",
    phone: "+58 424 234 5678",
    address: "Carrera 8 #25-30",
    monthlyFee: 25, // USD
    paymentDay: 10,
    lastInvoiceDate: "2024-12-01",
  },
  {
    id: 3,
    name: "Carlos Rodríguez",
    phone: "+58 412 345 6789",
    address: "Calle 15 #8-12",
    monthlyFee: 30, // USD
    paymentDay: 15,
    lastInvoiceDate: "2024-10-01", // Necesita factura
  },
  {
    id: 4,
    name: "Ana Martínez",
    phone: "+58 426 456 7890",
    address: "Avenida 5 #20-25",
    monthlyFee: 25, // USD
    paymentDay: 20,
    lastInvoiceDate: "2024-11-01", // Necesita factura
  },
  {
    id: 5,
    name: "Luis Hernández",
    phone: "+58 416 567 8901",
    address: "Calle 12 #18-22",
    monthlyFee: 25, // USD
    paymentDay: 25,
    lastInvoiceDate: null, // Nunca facturado
  },
]

export default function InvoicesManager() {
  const [invoices, setInvoices] = useState(mockInvoices)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedClients, setSelectedClients] = useState<number[]>([])

  const [newInvoice, setNewInvoice] = useState({
    clientId: "",
    amount: "",
    billingPeriodStart: "",
    billingPeriodEnd: "",
    description: "",
  })

  const filteredInvoices = invoices.filter((invoice) => {
    if (filterStatus === "all") return true
    return invoice.status === filterStatus
  })

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

  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear()
    const nextNumber = invoices.length + 1
    return `FAC-${year}-${nextNumber.toString().padStart(3, "0")}`
  }

  const calculateDueDate = (issueDate: string) => {
    const issue = new Date(issueDate)
    issue.setDate(issue.getDate() + 5)
    return issue.toISOString().split("T")[0]
  }

  // Enviar factura por WhatsApp
  const sendInvoiceByWhatsApp = (invoice: any) => {
    const message = `🧾 *FACTURA DE SERVICIO DE INTERNET*

📋 *DATOS DE LA FACTURA:*
• Número: *${invoice.invoiceNumber}*
• Cliente: *${invoice.clientName}*
• Dirección: ${invoice.clientAddress}
• Teléfono: ${invoice.clientPhone}

📅 *FECHAS IMPORTANTES:*
• Fecha de emisión: ${formatDate(invoice.issueDate)}
• Fecha de vencimiento: *${formatDate(invoice.dueDate)}*
• Su día de pago: *${invoice.paymentDay} de cada mes*

📦 *SERVICIO:*
${invoice.description}
Período: ${formatDate(invoice.billingPeriodStart)} al ${formatDate(invoice.billingPeriodEnd)}

💰 *MONTO A PAGAR:*
*${formatCurrency(invoice.amount)}*
Equivalente: ${formatCurrency(invoice.amount, "VES")}

💱 *Tasa BCV:* Bs. ${BCV_RATE.toFixed(2)} por USD

🏦 *FORMAS DE PAGO:*
• Dólares en efectivo
• Transferencia en Bolívares
• Pago móvil en Bolívares

⚠️ *IMPORTANTE:*
El servicio será suspendido automáticamente después de la fecha de vencimiento (${formatDate(invoice.dueDate)}) si no se realiza el pago correspondiente.

Para pagos en Bolívares, usar la tasa BCV del día del pago.

¡Gracias por confiar en nuestro servicio! 🌐

Para consultas: contacto@internetservice.com`

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${invoice.clientPhone.replace(/\D/g, "")}?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
  }

  // Obtener clientes que necesitan facturación
  const getClientsPendingInvoicing = () => {
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()

    return mockClients.filter((client) => {
      // Verificar si el cliente ya tiene una factura para el mes actual
      const hasCurrentMonthInvoice = invoices.some((invoice) => {
        const invoiceDate = new Date(invoice.issueDate)
        return (
          invoice.clientId === client.id &&
          invoiceDate.getMonth() === currentMonth &&
          invoiceDate.getFullYear() === currentYear
        )
      })

      // Si ya tiene factura del mes actual, no incluirlo
      if (hasCurrentMonthInvoice) return false

      // Si nunca ha sido facturado, incluirlo
      if (!client.lastInvoiceDate) return true

      // Si la última factura es de un mes anterior, incluirlo
      const lastInvoice = new Date(client.lastInvoiceDate)
      const lastInvoiceMonth = lastInvoice.getMonth()
      const lastInvoiceYear = lastInvoice.getFullYear()

      if (lastInvoiceYear < currentYear) return true
      if (lastInvoiceYear === currentYear && lastInvoiceMonth < currentMonth) return true

      return false
    })
  }

  const clientsPendingInvoicing = getClientsPendingInvoicing()

  const handleCreateInvoice = () => {
    const client = mockClients.find((c) => c.id === Number.parseInt(newInvoice.clientId))
    if (!client) return

    const issueDate = new Date().toISOString().split("T")[0]
    const dueDate = calculateDueDate(issueDate)

    const invoice = {
      id: Date.now(),
      invoiceNumber: generateInvoiceNumber(),
      clientId: Number.parseInt(newInvoice.clientId),
      clientName: client.name,
      clientPhone: client.phone,
      clientAddress: client.address,
      amount: Number.parseFloat(newInvoice.amount),
      issueDate,
      dueDate,
      status: "pending",
      description:
        newInvoice.description ||
        `Servicio de Internet - Período: ${newInvoice.billingPeriodStart} al ${newInvoice.billingPeriodEnd}`,
      paymentMethod: null,
      billingPeriodStart: newInvoice.billingPeriodStart,
      billingPeriodEnd: newInvoice.billingPeriodEnd,
      paymentDay: client.paymentDay,
    }

    setInvoices([...invoices, invoice])
    setNewInvoice({
      clientId: "",
      amount: "",
      billingPeriodStart: "",
      billingPeriodEnd: "",
      description: "",
    })
    setIsCreateDialogOpen(false)
  }

  const handleBulkInvoiceGeneration = () => {
    if (selectedClients.length === 0) {
      alert("Selecciona al menos un cliente para facturar")
      return
    }

    const issueDate = new Date().toISOString().split("T")[0]
    const dueDate = calculateDueDate(issueDate)

    const newInvoices = selectedClients
      .map((clientId) => {
        const client = mockClients.find((c) => c.id === clientId)
        if (!client) return null

        // Calcular período de facturación
        const today = new Date()
        const periodStart = new Date(today.getFullYear(), today.getMonth(), client.paymentDay)
        const periodEnd = new Date(periodStart)
        periodEnd.setMonth(periodEnd.getMonth() + 1)
        periodEnd.setDate(periodEnd.getDate() - 1)

        return {
          id: Date.now() + clientId,
          invoiceNumber: `FAC-${new Date().getFullYear()}-${(invoices.length + clientId).toString().padStart(3, "0")}`,
          clientId: client.id,
          clientName: client.name,
          clientPhone: client.phone,
          clientAddress: client.address,
          amount: client.monthlyFee,
          issueDate,
          dueDate,
          status: "pending",
          description: `Servicio de Internet - Período: ${periodStart.toISOString().split("T")[0]} al ${periodEnd.toISOString().split("T")[0]}`,
          paymentMethod: null,
          billingPeriodStart: periodStart.toISOString().split("T")[0],
          billingPeriodEnd: periodEnd.toISOString().split("T")[0],
          paymentDay: client.paymentDay,
        }
      })
      .filter(Boolean)

    setInvoices([...invoices, ...newInvoices])
    setSelectedClients([])
    setIsBulkDialogOpen(false)

    alert(`Se generaron ${newInvoices.length} facturas automáticamente`)
  }

  const toggleClientSelection = (clientId: number) => {
    setSelectedClients((prev) => (prev.includes(clientId) ? prev.filter((id) => id !== clientId) : [...prev, clientId]))
  }

  const selectAllClients = () => {
    if (selectedClients.length === clientsPendingInvoicing.length) {
      setSelectedClients([])
    } else {
      setSelectedClients(clientsPendingInvoicing.map((c) => c.id))
    }
  }

  const markInvoiceAsPaid = (invoiceId: number, method: string) => {
    setInvoices(
      invoices.map((invoice) =>
        invoice.id === invoiceId ? { ...invoice, status: "paid", paymentMethod: method } : invoice,
      ),
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="default" className="bg-green-600">
            Pagada
          </Badge>
        )
      case "overdue":
        return <Badge variant="destructive">Vencida</Badge>
      default:
        return <Badge variant="secondary">Pendiente</Badge>
    }
  }

  const downloadInvoice = (invoice: any) => {
    const invoiceContent = `
FACTURA: ${invoice.invoiceNumber}
Cliente: ${invoice.clientName}
Dirección: ${invoice.clientAddress}
Teléfono: ${invoice.clientPhone}

Descripción: ${invoice.description}
Período de facturación: ${invoice.billingPeriodStart} al ${invoice.billingPeriodEnd}
Monto: ${formatCurrency(invoice.amount)} (${formatCurrency(invoice.amount, "VES")})
Fecha de emisión: ${invoice.issueDate}
Fecha de vencimiento: ${invoice.dueDate}
Día de pago del cliente: ${invoice.paymentDay} de cada mes
Estado: ${invoice.status === "paid" ? "Pagada" : invoice.status === "overdue" ? "Vencida" : "Pendiente"}
${invoice.paymentMethod ? `Método de pago: ${invoice.paymentMethod}` : ""}

IMPORTANTE: El servicio será suspendido después del vencimiento si no se realiza el pago.

Tasa BCV: Bs. ${BCV_RATE.toFixed(2)} por USD
    `

    const blob = new Blob([invoiceContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${invoice.invoiceNumber}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const printInvoice = (invoice: any) => {
    const printContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px;">
          <h1 style="color: #333; margin: 0;">FACTURA</h1>
          <h2 style="color: #666; margin: 5px 0;">${invoice.invoiceNumber}</h2>
        </div>
        
        <div style="margin-bottom: 30px;">
          <h3 style="color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Datos del Cliente</h3>
          <p><strong>Nombre:</strong> ${invoice.clientName}</p>
          <p><strong>Dirección:</strong> ${invoice.clientAddress}</p>
          <p><strong>Teléfono:</strong> ${invoice.clientPhone}</p>
          <p><strong>Día de pago:</strong> ${invoice.paymentDay} de cada mes</p>
        </div>
        
        <div style="margin-bottom: 30px;">
          <h3 style="color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Detalles de la Factura</h3>
          <p><strong>Descripción:</strong> ${invoice.description}</p>
          <p><strong>Período de facturación:</strong> ${formatDate(invoice.billingPeriodStart)} al ${formatDate(invoice.billingPeriodEnd)}</p>
          <p><strong>Fecha de emisión:</strong> ${formatDate(invoice.issueDate)}</p>
          <p><strong>Fecha de vencimiento:</strong> ${formatDate(invoice.dueDate)}</p>
          <p><strong>Tasa BCV:</strong> Bs. ${BCV_RATE.toFixed(2)} por USD</p>
        </div>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; text-align: center;">
          <h2 style="color: #333; margin: 0;">TOTAL A PAGAR</h2>
          <h1 style="color: #2563eb; margin: 10px 0; font-size: 2.5em;">${formatCurrency(invoice.amount)}</h1>
          <p style="color: #666; font-size: 1.2em;">${formatCurrency(invoice.amount, "VES")}</p>
        </div>
        
        <div style="background-color: #fee2e2; border: 1px solid #fecaca; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <p style="color: #dc2626; font-weight: bold; margin: 0; text-align: center;">
            ⚠️ IMPORTANTE: El servicio será suspendido automáticamente después del ${formatDate(invoice.dueDate)} si no se realiza el pago.
          </p>
        </div>
        
        <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
          <p>Gracias por confiar en nuestro servicio de internet</p>
          <p>Para consultas: contacto@internetservice.com</p>
          <p>Facturas emitidas en USD - Pagos aceptados en USD y Bolívares</p>
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl">Gestión de Facturas</CardTitle>
              <CardDescription>Facturas en USD - Tasa BCV: Bs. {BCV_RATE.toFixed(2)} por USD</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="paid">Pagadas</SelectItem>
                  <SelectItem value="overdue">Vencidas</SelectItem>
                </SelectContent>
              </Select>

              <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Zap className="h-4 w-4 mr-2" />
                    Facturación Automática
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Facturación Automática por Lote</DialogTitle>
                    <DialogDescription>
                      Selecciona los clientes que necesitan facturación para el período actual
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {clientsPendingInvoicing.length === 0 ? (
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <h3 className="font-semibold text-green-800 mb-2">¡Todos al día!</h3>
                        <p className="text-green-600">No hay clientes pendientes por facturar</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">
                            Clientes Pendientes por Facturar ({clientsPendingInvoicing.length})
                          </h3>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={selectAllClients}
                            className="flex items-center gap-2"
                          >
                            <CheckSquare className="h-4 w-4" />
                            {selectedClients.length === clientsPendingInvoicing.length
                              ? "Deseleccionar Todos"
                              : "Seleccionar Todos"}
                          </Button>
                        </div>

                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {clientsPendingInvoicing.map((client) => (
                            <Card key={client.id} className="hover:shadow-sm transition-shadow">
                              <CardContent className="p-3">
                                <div className="flex items-center space-x-3">
                                  <Checkbox
                                    checked={selectedClients.includes(client.id)}
                                    onCheckedChange={() => toggleClientSelection(client.id)}
                                  />
                                  <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h4 className="font-medium">{client.name}</h4>
                                        <p className="text-sm text-gray-500">
                                          Día de pago: {client.paymentDay} | Tarifa: {formatCurrency(client.monthlyFee)}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                          {client.lastInvoiceDate
                                            ? `Última factura: ${client.lastInvoiceDate}`
                                            : "Nunca facturado"}
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <p className="font-bold text-blue-600">{formatCurrency(client.monthlyFee)}</p>
                                        <p className="text-xs text-gray-500">
                                          {formatCurrency(client.monthlyFee, "VES")}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>

                        {selectedClients.length > 0 && (
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <h4 className="font-semibold text-blue-800">Resumen de Facturación</h4>
                            <p className="text-blue-600">
                              {selectedClients.length} facturas por{" "}
                              {formatCurrency(
                                selectedClients.reduce((sum, id) => {
                                  const client = clientsPendingInvoicing.find((c) => c.id === id)
                                  return sum + (client?.monthlyFee || 0)
                                }, 0),
                              )}
                            </p>
                            <p className="text-sm text-blue-500">
                              Equivalente:{" "}
                              {formatCurrency(
                                selectedClients.reduce((sum, id) => {
                                  const client = clientsPendingInvoicing.find((c) => c.id === id)
                                  return sum + (client?.monthlyFee || 0)
                                }, 0),
                                "VES",
                              )}
                            </p>
                          </div>
                        )}

                        <Button
                          onClick={handleBulkInvoiceGeneration}
                          className="w-full"
                          disabled={selectedClients.length === 0}
                        >
                          Generar {selectedClients.length} Facturas Seleccionadas
                        </Button>
                      </>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Factura
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crear Nueva Factura Manual</DialogTitle>
                    <DialogDescription>Genera una factura individual para un cliente</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="client">Cliente</Label>
                      <Select
                        value={newInvoice.clientId}
                        onValueChange={(value) => {
                          const client = mockClients.find((c) => c.id === Number.parseInt(value))
                          if (client) {
                            const today = new Date()
                            const periodStart = new Date(today.getFullYear(), today.getMonth(), client.paymentDay)
                            const periodEnd = new Date(periodStart)
                            periodEnd.setMonth(periodEnd.getMonth() + 1)
                            periodEnd.setDate(periodEnd.getDate() - 1)

                            setNewInvoice({
                              ...newInvoice,
                              clientId: value,
                              amount: client.monthlyFee.toString(),
                              billingPeriodStart: periodStart.toISOString().split("T")[0],
                              billingPeriodEnd: periodEnd.toISOString().split("T")[0],
                            })
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockClients.map((client) => (
                            <SelectItem key={client.id} value={client.id.toString()}>
                              {client.name} (Día {client.paymentDay}) - {formatCurrency(client.monthlyFee)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="amount">Monto (USD)</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={newInvoice.amount}
                        onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                        placeholder="25.00"
                      />
                      {newInvoice.amount && (
                        <p className="text-sm text-gray-500 mt-1">
                          Equivalente: {formatCurrency(Number.parseFloat(newInvoice.amount), "VES")}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="billingPeriodStart">Inicio del Período de Facturación</Label>
                      <Input
                        id="billingPeriodStart"
                        type="date"
                        value={newInvoice.billingPeriodStart}
                        onChange={(e) => setNewInvoice({ ...newInvoice, billingPeriodStart: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="billingPeriodEnd">Fin del Período de Facturación</Label>
                      <Input
                        id="billingPeriodEnd"
                        type="date"
                        value={newInvoice.billingPeriodEnd}
                        onChange={(e) => setNewInvoice({ ...newInvoice, billingPeriodEnd: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Descripción (Opcional)</Label>
                      <Textarea
                        id="description"
                        value={newInvoice.description}
                        onChange={(e) => setNewInvoice({ ...newInvoice, description: e.target.value })}
                        placeholder="Se generará automáticamente basado en el período"
                      />
                    </div>
                    <Button onClick={handleCreateInvoice} className="w-full">
                      Crear Factura
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredInvoices.map((invoice) => (
              <Card key={invoice.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{invoice.invoiceNumber}</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>{invoice.clientName}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              Día de pago: {invoice.paymentDay} | Vence: {formatDate(invoice.dueDate)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4" />
                            <span>{formatCurrency(invoice.amount)}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{invoice.description}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Período: {formatDate(invoice.billingPeriodStart)} al {formatDate(invoice.billingPeriodEnd)}
                        </p>
                        <p className="text-xs text-gray-400">Emisión: {formatDate(invoice.issueDate)}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="font-bold text-xl">{formatCurrency(invoice.amount)}</p>
                        <p className="text-sm text-gray-500">{formatCurrency(invoice.amount, "VES")}</p>
                        {getStatusBadge(invoice.status)}
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedInvoice(invoice)
                              setIsViewDialogOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => downloadInvoice(invoice)}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => printInvoice(invoice)}>
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => sendInvoiceByWhatsApp(invoice)}
                            className="bg-green-50 hover:bg-green-100 border-green-200"
                          >
                            <MessageCircle className="h-4 w-4 text-green-600" />
                          </Button>
                        </div>
                        {invoice.status !== "paid" && (
                          <Button
                            size="sm"
                            onClick={() => markInvoiceAsPaid(invoice.id, "cash")}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Marcar Pagada
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Total Facturas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{invoices.length}</div>
            <p className="text-xs text-blue-600">Facturas generadas</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Facturas Pagadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {formatCurrency(invoices.filter((i) => i.status === "paid").reduce((sum, i) => sum + i.amount, 0))}
            </div>
            <p className="text-xs text-green-600">{invoices.filter((i) => i.status === "paid").length} facturas</p>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">
              {formatCurrency(invoices.filter((i) => i.status === "pending").reduce((sum, i) => sum + i.amount, 0))}
            </div>
            <p className="text-xs text-yellow-600">{invoices.filter((i) => i.status === "pending").length} facturas</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Por Facturar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{clientsPendingInvoicing.length}</div>
            <p className="text-xs text-orange-600">Clientes pendientes</p>
          </CardContent>
        </Card>
      </div>

      {/* View Invoice Dialog */}
      {selectedInvoice && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Factura {selectedInvoice.invoiceNumber}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Información del Cliente</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium">Nombre:</span> {selectedInvoice.clientName}
                  </div>
                  <div>
                    <span className="font-medium">Teléfono:</span> {selectedInvoice.clientPhone}
                  </div>
                  <div>
                    <span className="font-medium">Día de pago:</span> {selectedInvoice.paymentDay} de cada mes
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium">Dirección:</span> {selectedInvoice.clientAddress}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Detalles de la Factura</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Descripción:</span> {selectedInvoice.description}
                  </div>
                  <div>
                    <span className="font-medium">Período de facturación:</span>{" "}
                    {formatDate(selectedInvoice.billingPeriodStart)} al {formatDate(selectedInvoice.billingPeriodEnd)}
                  </div>
                  <div>
                    <span className="font-medium">Fecha de emisión:</span> {formatDate(selectedInvoice.issueDate)}
                  </div>
                  <div>
                    <span className="font-medium">Fecha de vencimiento:</span> {formatDate(selectedInvoice.dueDate)}
                  </div>
                  <div>
                    <span className="font-medium">Estado:</span> {getStatusBadge(selectedInvoice.status)}
                  </div>
                  <div>
                    <span className="font-medium">Tasa BCV:</span> Bs. {BCV_RATE.toFixed(2)} por USD
                  </div>
                  {selectedInvoice.paymentMethod && (
                    <div>
                      <span className="font-medium">Método de pago:</span> {selectedInvoice.paymentMethod}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <h3 className="font-semibold text-lg mb-2">Total a Pagar</h3>
                <p className="text-3xl font-bold text-blue-600">{formatCurrency(selectedInvoice.amount)}</p>
                <p className="text-lg text-blue-500 mt-1">{formatCurrency(selectedInvoice.amount, "VES")}</p>
              </div>

              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <p className="text-red-800 font-medium text-center">
                  ⚠️ IMPORTANTE: El servicio será suspendido automáticamente después del{" "}
                  {formatDate(selectedInvoice.dueDate)} si no se realiza el pago correspondiente.
                </p>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => downloadInvoice(selectedInvoice)} className="flex-1" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar
                </Button>
                <Button onClick={() => printInvoice(selectedInvoice)} className="flex-1" variant="outline">
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir
                </Button>
                <Button
                  onClick={() => sendInvoiceByWhatsApp(selectedInvoice)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Enviar por WhatsApp
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
