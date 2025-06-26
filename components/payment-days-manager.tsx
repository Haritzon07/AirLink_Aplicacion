"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Phone, DollarSign, User, MessageCircle, AlertTriangle } from "lucide-react"

const mockClients = [
  {
    id: 1,
    name: "Juan Pérez",
    phone: "+57 300 123 4567",
    monthlyFee: 45000,
    paymentDay: 5,
    status: "active",
    lastPayment: "2024-11-05",
    nextPayment: "2024-12-05",
  },
  {
    id: 2,
    name: "María González",
    phone: "+57 301 234 5678",
    monthlyFee: 45000,
    paymentDay: 10,
    status: "active",
    lastPayment: "2024-11-10",
    nextPayment: "2024-12-10",
  },
  {
    id: 3,
    name: "Carlos Rodríguez",
    phone: "+57 302 345 6789",
    monthlyFee: 50000,
    paymentDay: 15,
    status: "active",
    lastPayment: "2024-10-15",
    nextPayment: "2024-12-15",
  },
  {
    id: 4,
    name: "Ana Martínez",
    phone: "+57 303 456 7890",
    monthlyFee: 45000,
    paymentDay: 20,
    status: "active",
    lastPayment: "2024-11-20",
    nextPayment: "2024-12-20",
  },
  {
    id: 5,
    name: "Luis Hernández",
    phone: "+57 304 567 8901",
    monthlyFee: 45000,
    paymentDay: 25,
    status: "active",
    lastPayment: "2024-11-25",
    nextPayment: "2024-12-25",
  },
]

export default function PaymentDaysManager() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  // Agrupar clientes por día de pago
  const clientsByDay = mockClients.reduce(
    (acc, client) => {
      const day = client.paymentDay
      if (!acc[day]) {
        acc[day] = []
      }
      acc[day].push(client)
      return acc
    },
    {} as Record<number, typeof mockClients>,
  )

  // Obtener días ordenados
  const sortedDays = Object.keys(clientsByDay)
    .map(Number)
    .sort((a, b) => a - b)

  const sendPaymentReminder = (client: any, type: "reminder" | "due_today" | "final_warning") => {
    let message = ""

    switch (type) {
      case "reminder":
        message = `Hola ${client.name}, te recordamos que tu pago mensual de $${client.monthlyFee.toLocaleString()} vence el día ${client.paymentDay}. ¡Gracias por confiar en nuestro servicio!`
        break
      case "due_today":
        message = `${client.name}, tu pago de $${client.monthlyFee.toLocaleString()} vence HOY (${client.paymentDay}). Por favor realiza el pago para mantener tu servicio activo.`
        break
      case "final_warning":
        message = `ÚLTIMA ADVERTENCIA: ${client.name}, tu pago de $${client.monthlyFee.toLocaleString()} está VENCIDO desde el día ${client.paymentDay}. Realiza el pago inmediatamente para evitar la suspensión del servicio.`
        break
    }

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${client.phone.replace(/\D/g, "")}?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
  }

  const sendBulkReminders = (clients: any[], type: "reminder" | "due_today" | "final_warning") => {
    clients.forEach((client) => {
      setTimeout(() => {
        sendPaymentReminder(client, type)
      }, 500) // Pequeño delay entre mensajes
    })
  }

  const getPaymentStatus = (client: any) => {
    const today = new Date()
    const currentDay = today.getDate()
    const paymentDay = client.paymentDay

    if (currentDay === paymentDay) {
      return { status: "due_today", label: "Vence Hoy", color: "bg-yellow-500" }
    } else if (currentDay > paymentDay) {
      return { status: "overdue", label: "Vencido", color: "bg-red-500" }
    } else if (currentDay >= paymentDay - 3) {
      return { status: "upcoming", label: "Próximo", color: "bg-orange-500" }
    } else {
      return { status: "current", label: "Al día", color: "bg-green-500" }
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Calendario de Días de Pago</CardTitle>
          <CardDescription>
            Control de fechas de cobro y recordatorios automáticos para todos los clientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Resumen del mes */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Total Clientes</p>
                    <p className="text-2xl font-bold text-blue-900">{mockClients.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Ingresos Esperados</p>
                    <p className="text-2xl font-bold text-green-900">
                      ${mockClients.reduce((sum, c) => sum + c.monthlyFee, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Vencen Hoy</p>
                    <p className="text-2xl font-bold text-yellow-900">
                      {mockClients.filter((c) => getPaymentStatus(c).status === "due_today").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Vencidos</p>
                    <p className="text-2xl font-bold text-red-900">
                      {mockClients.filter((c) => getPaymentStatus(c).status === "overdue").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Acciones rápidas */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Button
              onClick={() =>
                sendBulkReminders(
                  mockClients.filter((c) => getPaymentStatus(c).status === "upcoming"),
                  "reminder",
                )
              }
              className="bg-blue-600 hover:bg-blue-700"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Recordatorios Próximos
            </Button>
            <Button
              onClick={() =>
                sendBulkReminders(
                  mockClients.filter((c) => getPaymentStatus(c).status === "due_today"),
                  "due_today",
                )
              }
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Avisos Vencen Hoy
            </Button>
            <Button
              onClick={() =>
                sendBulkReminders(
                  mockClients.filter((c) => getPaymentStatus(c).status === "overdue"),
                  "final_warning",
                )
              }
              className="bg-red-600 hover:bg-red-700"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Últimas Advertencias
            </Button>
          </div>

          {/* Calendario por días */}
          <div className="space-y-4">
            {sortedDays.map((day) => (
              <Card key={day} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 text-blue-800 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                        {day}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Día {day} del mes</h3>
                        <p className="text-sm text-gray-500">
                          {clientsByDay[day].length} cliente{clientsByDay[day].length !== 1 ? "s" : ""} - $
                          {clientsByDay[day].reduce((sum, c) => sum + c.monthlyFee, 0).toLocaleString()} total
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => sendBulkReminders(clientsByDay[day], "reminder")}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Enviar a Todos
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {clientsByDay[day].map((client) => {
                      const paymentStatus = getPaymentStatus(client)
                      return (
                        <div key={client.id} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">{client.name}</span>
                            </div>
                            <Badge className={`${paymentStatus.color} text-white`}>{paymentStatus.label}</Badge>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Phone className="h-3 w-3" />
                              <span>{client.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-3 w-3" />
                              <span>${client.monthlyFee.toLocaleString()}</span>
                            </div>
                            <div className="text-xs text-gray-500">Último pago: {client.lastPayment}</div>
                          </div>
                          <div className="flex gap-1 mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => sendPaymentReminder(client, "reminder")}
                              className="flex-1 text-xs"
                            >
                              Recordatorio
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                sendPaymentReminder(
                                  client,
                                  paymentStatus.status === "overdue" ? "final_warning" : "due_today",
                                )
                              }
                              className="flex-1 text-xs"
                            >
                              {paymentStatus.status === "overdue" ? "Urgente" : "Vence Hoy"}
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
