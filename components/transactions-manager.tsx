"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowUpCircle, ArrowDownCircle, Receipt } from "lucide-react"

const mockTransactions = [
  {
    id: 1,
    type: "payment",
    clientId: 1,
    clientName: "Juan Pérez",
    amount: 45000,
    date: "2024-12-05",
    reference: "REF001",
    description: "Pago recibido - Transferencia Bancolombia",
    status: "completed",
  },
  {
    id: 2,
    type: "invoice",
    clientId: 1,
    clientName: "Juan Pérez",
    amount: -45000,
    date: "2024-12-01",
    reference: "FAC-2024-001",
    description: "Factura emitida - Período: 01/12/2024 al 31/12/2024",
    status: "paid",
  },
  {
    id: 3,
    type: "payment",
    clientId: 2,
    clientName: "María González",
    amount: 45000,
    date: "2024-12-10",
    reference: "REF002",
    description: "Pago recibido - Efectivo",
    status: "completed",
  },
  {
    id: 4,
    type: "invoice",
    clientId: 2,
    clientName: "María González",
    amount: -45000,
    date: "2024-12-01",
    reference: "FAC-2024-002",
    description: "Factura emitida - Período: 01/12/2024 al 31/12/2024",
    status: "pending",
  },
  {
    id: 5,
    type: "invoice",
    clientId: 3,
    clientName: "Carlos Rodríguez",
    amount: -50000,
    date: "2024-12-01",
    reference: "FAC-2024-003",
    description: "Factura emitida - Período: 01/12/2024 al 31/12/2024",
    status: "overdue",
  },
]

const mockClients = [
  { id: 1, name: "Juan Pérez" },
  { id: 2, name: "María González" },
  { id: 3, name: "Carlos Rodríguez" },
]

export default function TransactionsManager() {
  const [transactions, setTransactions] = useState(mockTransactions)
  const [filterType, setFilterType] = useState("all")
  const [filterClient, setFilterClient] = useState("all")

  const filteredTransactions = transactions.filter((transaction) => {
    if (filterType !== "all" && transaction.type !== filterType) return false
    if (filterClient !== "all" && transaction.clientId !== Number.parseInt(filterClient)) return false
    return true
  })

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "payment":
        return <ArrowUpCircle className="h-5 w-5 text-green-500" />
      case "invoice":
        return <ArrowDownCircle className="h-5 w-5 text-blue-500" />
      default:
        return <Receipt className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string, type: string) => {
    if (type === "payment") {
      return (
        <Badge variant="default" className="bg-green-600">
          Recibido
        </Badge>
      )
    }

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

  const getClientBalance = (clientId: number) => {
    const clientTransactions = transactions.filter((t) => t.clientId === clientId)
    return clientTransactions.reduce((sum, t) => sum + t.amount, 0)
  }

  const totalPayments = transactions.filter((t) => t.type === "payment").reduce((sum, t) => sum + t.amount, 0)

  const totalInvoices = Math.abs(transactions.filter((t) => t.type === "invoice").reduce((sum, t) => sum + t.amount, 0))

  const netBalance = totalPayments - totalInvoices

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl">Tabla de Transacciones</CardTitle>
              <CardDescription>Historial completo de pagos recibidos y facturas emitidas</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="payment">Pagos</SelectItem>
                  <SelectItem value="invoice">Facturas</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterClient} onValueChange={setFilterClient}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los clientes</SelectItem>
                  {mockClients.map((client) => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center space-x-3">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <h3 className="font-semibold">{transaction.clientName}</h3>
                        <p className="text-sm text-gray-600">{transaction.description}</p>
                        <p className="text-xs text-gray-500">
                          {transaction.date} | Ref: {transaction.reference}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p
                          className={`font-bold text-lg ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toLocaleString()}
                        </p>
                        {getStatusBadge(transaction.status, transaction.type)}
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
            <CardTitle className="text-sm font-medium text-green-800">Total Pagos Recibidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">${totalPayments.toLocaleString()}</div>
            <p className="text-xs text-green-600">
              {transactions.filter((t) => t.type === "payment").length} transacciones
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Total Facturas Emitidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">${totalInvoices.toLocaleString()}</div>
            <p className="text-xs text-blue-600">{transactions.filter((t) => t.type === "invoice").length} facturas</p>
          </CardContent>
        </Card>

        <Card className={`${netBalance >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm font-medium ${netBalance >= 0 ? "text-green-800" : "text-red-800"}`}>
              Balance Neto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netBalance >= 0 ? "text-green-900" : "text-red-900"}`}>
              ${Math.abs(netBalance).toLocaleString()}
            </div>
            <p className={`text-xs ${netBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
              {netBalance >= 0 ? "Superávit" : "Déficit"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Clientes con Saldo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {mockClients.filter((client) => getClientBalance(client.id) > 0).length}
            </div>
            <p className="text-xs text-purple-600">Con saldo positivo</p>
          </CardContent>
        </Card>
      </div>

      {/* Client Balances */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Saldos por Cliente</CardTitle>
          <CardDescription>Balance individual de cada cliente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockClients.map((client) => {
              const balance = getClientBalance(client.id)
              return (
                <Card
                  key={client.id}
                  className={`${balance >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{client.name}</h4>
                        <p className="text-xs text-gray-500">Saldo actual</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-lg ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                          ${Math.abs(balance).toLocaleString()}
                        </p>
                        <Badge variant={balance >= 0 ? "default" : "destructive"} className="text-xs">
                          {balance >= 0 ? "A favor" : "Debe"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
