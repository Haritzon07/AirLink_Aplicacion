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
import { Textarea } from "@/components/ui/textarea"
import {
  Plus,
  Phone,
  MapPin,
  Edit,
  Trash2,
  MessageCircle,
  DollarSign,
  Eye,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react"

const mockClients = [
  {
    id: 1,
    name: "Juan Pérez",
    phone: "+58 414 123 4567",
    email: "juan.perez@email.com",
    address: "Calle 10 #15-20, Barrio El Prado",
    cedula: "12345678",
    status: "active",
  },
  {
    id: 2,
    name: "María González",
    phone: "+58 424 234 5678",
    email: "maria.gonzalez@email.com",
    address: "Carrera 8 #25-30, Barrio San José",
    cedula: "87654321",
    status: "active",
  },
  {
    id: 3,
    name: "Carlos Rodríguez",
    phone: "+58 412 345 6789",
    email: "carlos.rodriguez@email.com",
    address: "Calle 15 #8-12, Barrio El Mirador",
    cedula: "45678912",
    status: "active",
  },
]

// Mock data para transacciones
const mockTransactions = [
  {
    id: 1,
    type: "payment",
    clientId: 1,
    amount: 25,
    date: "2024-12-05",
    reference: "REF001",
    description: "Pago recibido - Transferencia Bancolombia",
    status: "paid",
  },
  {
    id: 2,
    type: "invoice",
    clientId: 1,
    amount: -25,
    date: "2024-12-01",
    reference: "FAC-2024-001",
    description: "Factura emitida - Período: 05/11/2024 al 04/12/2024",
    status: "paid",
  },
  {
    id: 3,
    type: "payment",
    clientId: 2,
    amount: 25,
    date: "2024-12-10",
    reference: "REF002",
    description: "Pago recibido - Efectivo",
    status: "paid",
  },
  {
    id: 4,
    type: "invoice",
    clientId: 2,
    amount: -25,
    date: "2024-12-01",
    reference: "FAC-2024-002",
    description: "Factura emitida - Período: 10/11/2024 al 09/12/2024",
    status: "pending",
  },
  {
    id: 5,
    type: "invoice",
    clientId: 3,
    amount: -30,
    date: "2024-12-01",
    reference: "FAC-2024-003",
    description: "Factura emitida - Período: 15/11/2024 al 14/12/2024",
    status: "overdue",
  },
]

export default function ClientsManager() {
  const [clients, setClients] = useState(mockClients)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showClientActions, setShowClientActions] = useState(false)
  const [newlyCreatedClient, setNewlyCreatedClient] = useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<any>(null)

  const [newClient, setNewClient] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    cedula: "",
    status: "active",
  })

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm) ||
      client.address.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getClientTransactions = (clientId: number) => {
    return mockTransactions.filter((t) => t.clientId === clientId)
  }

  const getClientBalance = (clientId: number) => {
    const clientTransactions = getClientTransactions(clientId)
    return clientTransactions.reduce((sum, t) => sum + t.amount, 0)
  }

  const handleAddClient = () => {
    const client = {
      id: Date.now(),
      ...newClient,
    }
    setClients([...clients, client])
    setNewlyCreatedClient(client)
    setNewClient({
      name: "",
      phone: "",
      email: "",
      address: "",
      cedula: "",
      status: "active",
    })
    setIsAddDialogOpen(false)
    setShowClientActions(true)
  }

  const handleEditClient = (client: any) => {
    setEditingClient(client)
    setNewClient({
      name: client.name,
      phone: client.phone,
      email: client.email,
      address: client.address,
      cedula: client.cedula,
      status: client.status,
    })
  }

  const handleUpdateClient = () => {
    const updatedClients = clients.map((client) =>
      client.id === editingClient.id
        ? {
            ...client,
            ...newClient,
          }
        : client,
    )
    setClients(updatedClients)
    setEditingClient(null)
    setNewClient({
      name: "",
      phone: "",
      email: "",
      address: "",
      cedula: "",
      status: "active",
    })
  }

  const handleDeleteClient = (id: number) => {
    setClients(clients.filter((client) => client.id !== id))
  }

  const sendWhatsApp = (phone: string, name: string) => {
    const message = `Hola ${name}, esperamos que estés disfrutando de nuestro servicio de internet. ¿Hay algo en lo que podamos ayudarte?`
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
  }

  const openClientView = (client: any) => {
    setSelectedClient(client)
    setIsViewDialogOpen(true)
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "payment":
        return <ArrowUpCircle className="h-4 w-4 text-green-500" />
      case "invoice":
        return <ArrowDownCircle className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string, type: string) => {
    if (type === "payment") {
      return (
        <Badge variant="default" className="bg-green-600 text-xs">
          Recibido
        </Badge>
      )
    }

    switch (status) {
      case "paid":
        return (
          <Badge variant="default" className="bg-green-600 text-xs">
            Pagada
          </Badge>
        )
      case "overdue":
        return (
          <Badge variant="destructive" className="text-xs">
            Vencida
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className="text-xs">
            Pendiente
          </Badge>
        )
    }
  }

  const formatCurrency = (amount: number) => {
    return `$${Math.abs(amount).toFixed(2)} USD`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl">Gestión de Clientes</CardTitle>
              <CardDescription>Administra todos los clientes y sus datos de contacto</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Cliente
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
                  <DialogDescription>Completa la información del cliente</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nombre Completo</Label>
                    <Input
                      id="name"
                      value={newClient.name}
                      onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                      placeholder="Ej: Juan Pérez"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={newClient.phone}
                      onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                      placeholder="Ej: +58 414 123 4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cedula">Cédula o Tarjeta de Identidad</Label>
                    <Input
                      id="cedula"
                      value={newClient.cedula}
                      onChange={(e) => setNewClient({ ...newClient, cedula: e.target.value })}
                      placeholder="Ej: 12345678"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email (Opcional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newClient.email}
                      onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                      placeholder="Ej: juan@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Dirección</Label>
                    <Textarea
                      id="address"
                      value={newClient.address}
                      onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                      placeholder="Dirección completa del cliente"
                    />
                  </div>
                  <Button onClick={handleAddClient} className="w-full">
                    Agregar Cliente
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Buscar clientes por nombre, teléfono o dirección..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClients.map((client) => (
              <Card key={client.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{client.name}</CardTitle>
                      <Badge variant={client.status === "active" ? "default" : "destructive"} className="mt-1">
                        {client.status === "active" ? "Activo" : "Suspendido"}
                      </Badge>
                    </div>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline" onClick={() => openClientView(client)}>
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEditClient(client)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteClient(client.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{client.phone}</span>
                  </div>
                  <div className="flex items-start space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <span className="text-gray-600">{client.address}</span>
                  </div>
                  <div className="flex items-start space-x-2 text-sm">
                    <DollarSign className="h-4 w-4 text-gray-500 mt-0.5" />
                    <span className="text-gray-600">Cédula: {client.cedula}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span
                      className={`font-semibold ${getClientBalance(client.id) >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      Saldo: {formatCurrency(getClientBalance(client.id))}
                      {getClientBalance(client.id) < 0 ? " (Debe)" : ""}
                    </span>
                  </div>
                  <div className="pt-2 border-t">
                    <Button
                      size="sm"
                      onClick={() => sendWhatsApp(client.phone, client.name)}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editingClient && (
        <Dialog open={!!editingClient} onOpenChange={() => setEditingClient(null)}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Cliente</DialogTitle>
              <DialogDescription>Modifica la información del cliente</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Nombre Completo</Label>
                <Input
                  id="edit-name"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">Teléfono</Label>
                <Input
                  id="edit-phone"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-cedula">Cédula</Label>
                <Input
                  id="edit-cedula"
                  value={newClient.cedula}
                  onChange={(e) => setNewClient({ ...newClient, cedula: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-address">Dirección</Label>
                <Textarea
                  id="edit-address"
                  value={newClient.address}
                  onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-status">Estado</Label>
                <Select
                  value={newClient.status}
                  onValueChange={(value) => setNewClient({ ...newClient, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="suspended">Suspendido</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleUpdateClient} className="w-full">
                Actualizar Cliente
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Client Actions Dialog */}
      {showClientActions && newlyCreatedClient && (
        <Dialog open={showClientActions} onOpenChange={() => setShowClientActions(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cliente Creado Exitosamente</DialogTitle>
              <DialogDescription>
                {newlyCreatedClient.name} ha sido agregado al sistema. ¿Qué deseas hacer ahora?
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800">✅ Cliente: {newlyCreatedClient.name}</h3>
                <p className="text-sm text-green-600">Teléfono: {newlyCreatedClient.phone}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                <Button
                  onClick={() => {
                    setShowClientActions(false)
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Programar Instalación
                </Button>
              </div>

              <Button onClick={() => setShowClientActions(false)} variant="outline" className="w-full">
                Continuar Más Tarde
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Client View Dialog */}
      {selectedClient && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalles del Cliente: {selectedClient.name}</DialogTitle>
              <DialogDescription>Información completa y transacciones del cliente</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Client Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Información del Cliente</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium">Nombre:</span> {selectedClient.name}
                  </div>
                  <div>
                    <span className="font-medium">Teléfono:</span> {selectedClient.phone}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span> {selectedClient.email || "No especificado"}
                  </div>
                  <div>
                    <span className="font-medium">Cédula:</span> {selectedClient.cedula}
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium">Dirección:</span> {selectedClient.address}
                  </div>
                  <div>
                    <span className="font-medium">Estado:</span>
                    <Badge variant={selectedClient.status === "active" ? "default" : "destructive"} className="ml-2">
                      {selectedClient.status === "active" ? "Activo" : "Suspendido"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Balance */}
              <div
                className={`p-4 rounded-lg ${getClientBalance(selectedClient.id) >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"} border`}
              >
                <h3
                  className={`font-semibold mb-2 ${getClientBalance(selectedClient.id) >= 0 ? "text-green-800" : "text-red-800"}`}
                >
                  Saldo del Cliente
                </h3>
                <p
                  className={`text-2xl font-bold ${getClientBalance(selectedClient.id) >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {formatCurrency(getClientBalance(selectedClient.id))}
                  {getClientBalance(selectedClient.id) < 0 ? " (Debe)" : " (A favor)"}
                </p>
              </div>

              {/* Transactions */}
              <div>
                <h3 className="font-semibold mb-3">Historial de Transacciones</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {getClientTransactions(selectedClient.id).length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No hay transacciones registradas</p>
                  ) : (
                    getClientTransactions(selectedClient.id).map((transaction) => (
                      <Card key={transaction.id} className="hover:shadow-sm transition-shadow">
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center space-x-3">
                              {getTransactionIcon(transaction.type)}
                              <div>
                                <p className="font-medium text-sm">{transaction.description}</p>
                                <p className="text-xs text-gray-500">
                                  {transaction.date} | Ref: {transaction.reference}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`font-bold ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                                {transaction.amount > 0 ? "+" : ""}
                                {formatCurrency(transaction.amount)}
                              </p>
                              {getStatusBadge(transaction.status, transaction.type)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={() => sendWhatsApp(selectedClient.phone, selectedClient.name)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Enviar WhatsApp
                </Button>
                <Button onClick={() => handleEditClient(selectedClient)} variant="outline" className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Cliente
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
