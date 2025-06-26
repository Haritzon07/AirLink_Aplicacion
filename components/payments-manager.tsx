"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, MessageCircle, CheckCircle, Clock, X, AlertTriangle, DollarSign } from "lucide-react"

// Tasa BCV simulada
const BCV_RATE = 36.5 // 1 USD = 36.50 VES

const mockPayments = [
  {
    id: 1,
    clientId: 1,
    clientName: "Juan Pérez",
    clientPhone: "+58 414 123 4567",
    amount: 25, // USD
    amountVES: 912.5, // Equivalente en Bolívares
    currency: "USD",
    paymentDate: "2024-12-05",
    status: "paid",
    method: "cash",
    reference: "REF001",
    paymentMethod: "transfer",
    bank: "bancolombia",
    bcvRate: 36.5,
  },
  {
    id: 2,
    clientId: 2,
    clientName: "María González",
    clientPhone: "+58 424 234 5678",
    amount: 15, // USD
    amountVES: 547.5, // Equivalente en Bolívares
    currency: "VES",
    originalAmountVES: 547.5,
    paymentDate: "2024-12-10",
    status: "pending",
    method: null,
    bcvRate: 36.5,
  },
  {
    id: 3,
    clientId: 3,
    clientName: "Carlos Rodríguez",
    clientPhone: "+58 412 345 6789",
    amount: 30, // USD
    amountVES: 1095.0, // Equivalente en Bolívares
    currency: "USD",
    paymentDate: "2024-12-15",
    status: "rejected",
    method: null,
    reference: "REF003",
    rejectionReason: "Fondos insuficientes",
    bcvRate: 36.5,
  },
]

const mockClients = [
  { id: 1, name: "Juan Pérez", phone: "+58 414 123 4567", monthlyFee: 25, paymentDay: 5 },
  { id: 2, name: "María González", phone: "+58 424 234 5678", monthlyFee: 25, paymentDay: 10 },
  { id: 3, name: "Carlos Rodríguez", phone: "+58 412 345 6789", monthlyFee: 30, paymentDay: 15 },
]

const mockInvoices = [
  { id: 1, clientId: 1, amount: 25, issueDate: "2024-12-01", dueDate: "2024-12-06", status: "paid" },
  { id: 2, clientId: 2, amount: 25, issueDate: "2024-12-01", dueDate: "2024-12-06", status: "pending" },
]

export default function PaymentsManager() {
  const [payments, setPayments] = useState(mockPayments)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingPayment, setEditingPayment] = useState(null)
  const [filterStatus, setFilterStatus] = useState("all")

  const [newPayment, setNewPayment] = useState({
    clientId: "",
    amount: "",
    currency: "USD",
    amountVES: "",
    paymentDate: "",
    method: "cash",
    status: "pending",
    reference: "",
    paymentMethod: "",
    bank: "",
    photo: null,
    rejectionReason: "",
    bcvRate: BCV_RATE,
  })

  const filteredPayments = payments.filter((payment) => {
    if (filterStatus === "all") return true
    return payment.status === filterStatus
  })

  const getClientBalance = (clientId) => {
    const clientPayments = payments.filter((p) => p.clientId === Number.parseInt(clientId) && p.status === "paid")
    const clientInvoices = mockInvoices.filter((i) => i.clientId === Number.parseInt(clientId))

    const totalPayments = clientPayments.reduce((sum, p) => sum + p.amount, 0)
    const totalInvoices = clientInvoices.reduce((sum, i) => sum + i.amount, 0)

    return totalPayments - totalInvoices
  }

  // Formatear moneda
  const formatCurrency = (amount: number, currency: "USD" | "VES" = "USD") => {
    if (currency === "USD") {
      return `$${amount.toFixed(2)} USD`
    } else {
      return `Bs. ${amount.toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
  }

  // Calcular equivalencia
  const calculateEquivalent = (amount: string, fromCurrency: "USD" | "VES") => {
    const numAmount = Number.parseFloat(amount) || 0
    if (fromCurrency === "USD") {
      return (numAmount * BCV_RATE).toFixed(2)
    } else {
      return (numAmount / BCV_RATE).toFixed(2)
    }
  }

  const handleAddPayment = () => {
    const client = mockClients.find((c) => c.id === Number.parseInt(newPayment.clientId))
    if (!client) return

    let finalAmount = Number.parseFloat(newPayment.amount)
    let finalAmountVES = Number.parseFloat(newPayment.amountVES)

    // Si el pago es en VES, convertir a USD
    if (newPayment.currency === "VES") {
      finalAmount = Number.parseFloat(newPayment.amountVES) / BCV_RATE
      finalAmountVES = Number.parseFloat(newPayment.amountVES)
    } else {
      finalAmountVES = Number.parseFloat(newPayment.amount) * BCV_RATE
    }

    const payment = {
      id: Date.now(),
      clientId: Number.parseInt(newPayment.clientId),
      clientName: client.name,
      clientPhone: client.phone,
      amount: finalAmount,
      amountVES: finalAmountVES,
      currency: newPayment.currency,
      originalAmountVES: newPayment.currency === "VES" ? finalAmountVES : null,
      paymentDate: newPayment.paymentDate,
      status: newPayment.status,
      method: newPayment.status === "paid" ? newPayment.method : null,
      reference: newPayment.reference,
      paymentMethod: newPayment.paymentMethod,
      bank: newPayment.bank,
      photo: newPayment.photo,
      rejectionReason: newPayment.status === "rejected" ? newPayment.rejectionReason : null,
      bcvRate: BCV_RATE,
    }

    setPayments([...payments, payment])
    setNewPayment({
      clientId: "",
      amount: "",
      currency: "USD",
      amountVES: "",
      paymentDate: "",
      method: "cash",
      status: "pending",
      reference: "",
      paymentMethod: "",
      bank: "",
      photo: null,
      rejectionReason: "",
      bcvRate: BCV_RATE,
    })
    setIsAddDialogOpen(false)
  }

  const quickStatusChange = (paymentId: number, newStatus: string) => {
    setPayments(
      payments.map((payment) =>
        payment.id === paymentId
          ? {
              ...payment,
              status: newStatus,
              method: newStatus === "paid" ? "cash" : null,
              rejectionReason: newStatus === "rejected" ? "Motivo no especificado" : null,
            }
          : payment,
      ),
    )
  }

  const sendPaymentConfirmation = (payment) => {
    const paymentMethodText = {
      cash: "Efectivo",
      transfer: "Transferencia",
      dollars: "Dólares",
      card: "Tarjeta",
    }

    const bankText = payment.bank ? ` - ${payment.bank}` : ""

    let amountText = ""
    if (payment.currency === "VES") {
      amountText = `${formatCurrency(payment.amountVES, "VES")} (${formatCurrency(payment.amount, "USD")})`
    } else {
      amountText = `${formatCurrency(payment.amount, "USD")} (${formatCurrency(payment.amountVES, "VES")})`
    }

    const message = `✅ PAGO RECIBIDO CONFIRMADO

👤 Cliente: ${payment.clientName}
💰 Monto: ${amountText}
💳 Forma de pago: ${paymentMethodText[payment.paymentMethod] || payment.paymentMethod}${bankText}
🔢 Referencia: ${payment.reference || "Sin referencia"}
📆 Fecha de pago: ${payment.paymentDate}
💱 Tasa BCV aplicada: Bs. ${payment.bcvRate.toFixed(2)}

¡Gracias por tu pago puntual! Tu servicio de internet continúa activo.

Para cualquier consulta, no dudes en contactarnos.`

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${payment.clientPhone.replace(/\D/g, "")}?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "rejected":
        return <X className="h-5 w-5 text-red-500" />
      case "overdue":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="default" className="bg-green-600">
            Pagado
          </Badge>
        )
      case "rejected":
        return <Badge variant="destructive">Rechazado</Badge>
      case "overdue":
        return <Badge variant="destructive">Vencido</Badge>
      default:
        return <Badge variant="secondary">Pendiente</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl">Gestión de Pagos</CardTitle>
              <CardDescription>
                Control de pagos en USD y Bolívares - Tasa BCV: Bs. {BCV_RATE.toFixed(2)} por USD
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="paid">Pagados</SelectItem>
                  <SelectItem value="rejected">Rechazados</SelectItem>
                  <SelectItem value="overdue">Vencidos</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Pago
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Registrar Nuevo Pago</DialogTitle>
                    <DialogDescription>
                      Agrega un nuevo pago al sistema - Tasa BCV: Bs. {BCV_RATE.toFixed(2)}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="client">Cliente</Label>
                      <Select
                        value={newPayment.clientId}
                        onValueChange={(value) => {
                          const client = mockClients.find((c) => c.id === Number.parseInt(value))
                          setNewPayment({
                            ...newPayment,
                            clientId: value,
                            amount: client ? client.monthlyFee.toString() : "",
                            amountVES: client ? (client.monthlyFee * BCV_RATE).toFixed(2) : "",
                          })
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockClients.map((client) => (
                            <SelectItem key={client.id} value={client.id.toString()}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {newPayment.clientId && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <h4 className="font-semibold text-blue-800">Saldo del Cliente</h4>
                        <p className="text-blue-600">
                          Saldo actual:{" "}
                          <span className="font-bold">{formatCurrency(getClientBalance(newPayment.clientId))}</span>
                        </p>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="currency">Moneda del Pago</Label>
                      <Select
                        value={newPayment.currency}
                        onValueChange={(value) => {
                          setNewPayment({ ...newPayment, currency: value })
                          // Recalcular equivalencia
                          if (value === "USD" && newPayment.amount) {
                            setNewPayment((prev) => ({
                              ...prev,
                              currency: value,
                              amountVES: calculateEquivalent(prev.amount, "USD"),
                            }))
                          } else if (value === "VES" && newPayment.amountVES) {
                            setNewPayment((prev) => ({
                              ...prev,
                              currency: value,
                              amount: calculateEquivalent(prev.amountVES, "VES"),
                            }))
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">Dólares (USD)</SelectItem>
                          <SelectItem value="VES">Bolívares (VES)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {newPayment.currency === "USD" ? (
                      <div>
                        <Label htmlFor="amount">Monto en USD</Label>
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          value={newPayment.amount}
                          onChange={(e) => {
                            const usdAmount = e.target.value
                            setNewPayment({
                              ...newPayment,
                              amount: usdAmount,
                              amountVES: calculateEquivalent(usdAmount, "USD"),
                            })
                          }}
                          placeholder="25.00"
                        />
                        {newPayment.amount && (
                          <p className="text-sm text-gray-500 mt-1">
                            Equivalente: {formatCurrency(Number.parseFloat(newPayment.amountVES), "VES")}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div>
                        <Label htmlFor="amountVES">Monto en Bolívares</Label>
                        <Input
                          id="amountVES"
                          type="number"
                          step="0.01"
                          value={newPayment.amountVES}
                          onChange={(e) => {
                            const vesAmount = e.target.value
                            setNewPayment({
                              ...newPayment,
                              amountVES: vesAmount,
                              amount: calculateEquivalent(vesAmount, "VES"),
                            })
                          }}
                          placeholder="912.50"
                        />
                        {newPayment.amountVES && (
                          <p className="text-sm text-gray-500 mt-1">
                            Equivalente: {formatCurrency(Number.parseFloat(newPayment.amount), "USD")}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">
                          Tasa BCV aplicada: Bs. {BCV_RATE.toFixed(2)} por USD
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="paymentDate">Fecha de Pago</Label>
                      <Input
                        id="paymentDate"
                        type="date"
                        value={newPayment.paymentDate}
                        onChange={(e) => setNewPayment({ ...newPayment, paymentDate: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="paymentReference">Referencia del Pago</Label>
                      <Input
                        id="paymentReference"
                        value={newPayment.reference}
                        onChange={(e) => setNewPayment({ ...newPayment, reference: e.target.value })}
                        placeholder="Ej: 123456789, Ref001, etc."
                      />
                    </div>

                    <div>
                      <Label htmlFor="paymentMethod">Forma de Pago</Label>
                      <Select
                        value={newPayment.paymentMethod}
                        onValueChange={(value) => setNewPayment({ ...newPayment, paymentMethod: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar forma de pago" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Efectivo</SelectItem>
                          <SelectItem value="transfer">Transferencia</SelectItem>
                          <SelectItem value="mobile_payment">Pago Móvil</SelectItem>
                          <SelectItem value="dollars">Dólares en Efectivo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {(newPayment.paymentMethod === "transfer" || newPayment.paymentMethod === "mobile_payment") && (
                      <div>
                        <Label htmlFor="bank">Banco</Label>
                        <Select
                          value={newPayment.bank}
                          onValueChange={(value) => setNewPayment({ ...newPayment, bank: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar banco" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="banesco">Banesco</SelectItem>
                            <SelectItem value="mercantil">Mercantil</SelectItem>
                            <SelectItem value="venezuela">Banco de Venezuela</SelectItem>
                            <SelectItem value="provincial">Provincial</SelectItem>
                            <SelectItem value="bicentenario">Bicentenario</SelectItem>
                            <SelectItem value="exterior">Exterior</SelectItem>
                            <SelectItem value="otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="paymentPhoto">Comprobante de Pago (Foto)</Label>
                      <Input
                        id="paymentPhoto"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setNewPayment({ ...newPayment, photo: e.target.files?.[0] || null })}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-gray-500 mt-1">Sube una foto del comprobante de pago (opcional)</p>
                    </div>

                    <div>
                      <Label htmlFor="status">Estado</Label>
                      <Select
                        value={newPayment.status}
                        onValueChange={(value) => setNewPayment({ ...newPayment, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pendiente</SelectItem>
                          <SelectItem value="paid">Pagado</SelectItem>
                          <SelectItem value="rejected">Rechazado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {newPayment.status === "rejected" && (
                      <div>
                        <Label htmlFor="rejectionReason">Motivo del Rechazo</Label>
                        <Input
                          id="rejectionReason"
                          value={newPayment.rejectionReason}
                          onChange={(e) => setNewPayment({ ...newPayment, rejectionReason: e.target.value })}
                          placeholder="Ej: Fondos insuficientes, datos incorrectos, etc."
                        />
                      </div>
                    )}

                    <Button onClick={handleAddPayment} className="w-full">
                      Registrar Pago
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <Card key={payment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(payment.status)}
                      <div>
                        <h3 className="font-semibold">{payment.clientName}</h3>
                        <p className="text-sm text-gray-500">
                          Fecha: {payment.paymentDate}
                          {payment.reference && ` | Ref: ${payment.reference}`}
                        </p>
                        <div className="text-xs text-gray-400 space-y-1">
                          <div>
                            Moneda: {payment.currency} | Tasa BCV: Bs. {payment.bcvRate.toFixed(2)}
                          </div>
                          {payment.currency === "VES" ? (
                            <div>
                              Pagado: {formatCurrency(payment.amountVES, "VES")} (
                              {formatCurrency(payment.amount, "USD")})
                            </div>
                          ) : (
                            <div>
                              Pagado: {formatCurrency(payment.amount, "USD")} (
                              {formatCurrency(payment.amountVES, "VES")})
                            </div>
                          )}
                        </div>
                        {payment.rejectionReason && (
                          <p className="text-xs text-red-500">Motivo: {payment.rejectionReason}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="font-bold text-lg">{formatCurrency(payment.amount, "USD")}</p>
                        <p className="text-sm text-gray-500">{formatCurrency(payment.amountVES, "VES")}</p>
                        {getStatusBadge(payment.status)}
                      </div>

                      <div className="flex flex-col gap-2">
                        {/* Botones rápidos de cambio de estado */}
                        <div className="flex gap-1">
                          {payment.status !== "paid" && (
                            <Button
                              size="sm"
                              onClick={() => quickStatusChange(payment.id, "paid")}
                              className="bg-green-600 hover:bg-green-700"
                              title="Marcar como pagado"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          {payment.status !== "rejected" && (
                            <Button
                              size="sm"
                              onClick={() => quickStatusChange(payment.id, "rejected")}
                              className="bg-red-600 hover:bg-red-700"
                              title="Marcar como rechazado"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                          {payment.status !== "pending" && (
                            <Button
                              size="sm"
                              onClick={() => quickStatusChange(payment.id, "pending")}
                              className="bg-yellow-600 hover:bg-yellow-700"
                              title="Marcar como pendiente"
                            >
                              <Clock className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <div className="flex gap-1">
                          {payment.status === "paid" && (
                            <Button
                              size="sm"
                              onClick={() => sendPaymentConfirmation(payment)}
                              className="bg-green-600 hover:bg-green-700"
                              title="Enviar confirmación de pago"
                            >
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
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
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Pagos Recibidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {formatCurrency(payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0))}
            </div>
            <p className="text-xs text-green-600">
              {payments.filter((p) => p.status === "paid").length} pagos completados
            </p>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800">Pagos Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">
              {formatCurrency(payments.filter((p) => p.status === "pending").reduce((sum, p) => sum + p.amount, 0))}
            </div>
            <p className="text-xs text-yellow-600">
              {payments.filter((p) => p.status === "pending").length} pagos por cobrar
            </p>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-800">Pagos Rechazados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">
              {formatCurrency(payments.filter((p) => p.status === "rejected").reduce((sum, p) => sum + p.amount, 0))}
            </div>
            <p className="text-xs text-red-600">
              {payments.filter((p) => p.status === "rejected").length} pagos rechazados
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Tasa BCV</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">Bs. {BCV_RATE.toFixed(2)}</div>
            <p className="text-xs text-blue-600">por 1 USD</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
