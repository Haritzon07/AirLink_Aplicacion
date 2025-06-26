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
import { Plus, MapPin, User, Calendar, DollarSign, Edit } from "lucide-react"

const plans = [
  { id: 1, name: "Plan 4 Megas", speed: "4 Mbps", price: 25 },
  { id: 2, name: "Plan 5 Megas", speed: "5 Mbps", price: 30 },
]

const antennas = [
  { id: 1, name: "Antena Sur", code: "AS" },
  { id: 2, name: "Antena Norte", code: "AN" },
  { id: 3, name: "Antena Este", code: "AE" },
  { id: 4, name: "Antena Oeste", code: "AO" },
]

const mockInstallations = [
  {
    id: 1,
    clientName: "Juan Pérez",
    clientPhone: "+58 414 123 4567",
    antennaName: "Antena Sur",
    plan: "Plan 5 Megas",
    pppoeUser: "AS1",
    installationDate: "2024-01-20",
    technicianName: "Técnico Roberto",
    equipmentDetails: "Router TP-Link, Cable UTP 50m, Antena receptora",
    installationCost: 80,
    monthlyFee: 30,
    paymentDay: 5,
    status: "completed",
    notes: "Instalación exitosa, cliente satisfecho",
    hotspotEnabled: true,
    hotspotUser: "hotspot_juan",
    hotspotPassword: "pass123",
  },
  {
    id: 2,
    clientName: "María González",
    clientPhone: "+58 424 234 5678",
    antennaName: "Antena Norte",
    plan: "Plan 4 Megas",
    pppoeUser: "AN1",
    installationDate: "2024-02-05",
    technicianName: "Técnico Miguel",
    equipmentDetails: "Router TP-Link, Cable UTP 30m, Antena receptora",
    installationCost: 75,
    monthlyFee: 25,
    paymentDay: 10,
    status: "completed",
    notes: "Instalación completada sin inconvenientes",
    hotspotEnabled: false,
    hotspotUser: "",
    hotspotPassword: "",
  },
  {
    id: 3,
    clientName: "Carlos Rodríguez",
    clientPhone: "+58 412 345 6789",
    antennaName: "Antena Este",
    plan: "Plan 5 Megas",
    pppoeUser: "AE1",
    installationDate: "2024-02-20",
    technicianName: "Técnico Roberto",
    equipmentDetails: "Router TP-Link Premium, Cable UTP 40m, Antena receptora",
    installationCost: 85,
    monthlyFee: 30,
    paymentDay: 15,
    status: "completed",
    notes: "Cliente requirió router premium por mayor cobertura",
    hotspotEnabled: true,
    hotspotUser: "hotspot_carlos",
    hotspotPassword: "pass456",
  },
  {
    id: 4,
    clientName: "Ana Martínez",
    clientPhone: "+58 426 456 7890",
    antennaName: "Antena Oeste",
    plan: "Plan 4 Megas",
    pppoeUser: "AO1",
    installationDate: "2024-03-05",
    technicianName: "Técnico Miguel",
    equipmentDetails: "Router TP-Link, Cable UTP 35m, Antena receptora",
    installationCost: 78,
    monthlyFee: 25,
    paymentDay: 20,
    status: "pending",
    notes: "Pendiente por disponibilidad del cliente",
    hotspotEnabled: false,
    hotspotUser: "",
    hotspotPassword: "",
  },
  {
    id: 5,
    clientName: "Luis Hernández",
    clientPhone: "+58 416 567 8901",
    antennaName: "Antena Norte",
    plan: "Plan 5 Megas",
    pppoeUser: "AN2",
    installationDate: "2024-03-10",
    technicianName: "Técnico Roberto",
    equipmentDetails: "Router TP-Link, Cable UTP 25m, Antena receptora",
    installationCost: 70,
    monthlyFee: 30,
    paymentDay: 25,
    status: "completed",
    notes: "Instalación rápida, ubicación favorable",
    hotspotEnabled: true,
    hotspotUser: "hotspot_luis",
    hotspotPassword: "pass789",
  },
]

const mockClients = [
  { id: 1, name: "Juan Pérez", phone: "+58 414 123 4567" },
  { id: 2, name: "María González", phone: "+58 424 234 5678" },
  { id: 3, name: "Carlos Rodríguez", phone: "+58 412 345 6789" },
  { id: 4, name: "Ana Martínez", phone: "+58 426 456 7890" },
  { id: 5, name: "Luis Hernández", phone: "+58 416 567 8901" },
]

const technicians = [
  { id: 1, name: "Técnico Roberto" },
  { id: 2, name: "Técnico Miguel" },
  { id: 3, name: "Técnico Carlos" },
]

export default function InstallationsManager() {
  const [installations, setInstallations] = useState(mockInstallations)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterAntenna, setFilterAntenna] = useState("all")
  const [selectedPlan, setSelectedPlan] = useState("")
  const [pppoeUser, setPppoeUser] = useState("")

  const [newInstallation, setNewInstallation] = useState({
    clientName: "",
    antennaName: "",
    plan: "",
    pppoeUser: "",
    installationDate: "",
    technicianName: "",
    equipmentDetails: "",
    installationCost: "",
    monthlyFee: "",
    paymentDay: "",
    status: "pending",
    notes: "",
    hotspotEnabled: false,
    hotspotUser: "",
    hotspotPassword: "",
  })

  const [editingInstallation, setEditingInstallation] = useState(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const generatePPPOEUser = (antennaName) => {
    const antenna = antennas.find((a) => a.name === antennaName)
    if (antenna) {
      const existingUsers = installations.filter((i) => i.antennaName === antennaName)
      const nextNumber = existingUsers.length + 1
      return `${antenna.code}${nextNumber}`
    }
    return ""
  }

  const filteredInstallations = installations.filter((installation) => {
    if (filterStatus !== "all" && installation.status !== filterStatus) return false
    if (filterAntenna !== "all" && installation.antennaName !== filterAntenna) return false
    return true
  })

  const installationsByAntenna = {
    "Antena Sur": filteredInstallations.filter((i) => i.antennaName === "Antena Sur"),
    "Antena Norte": filteredInstallations.filter((i) => i.antennaName === "Antena Norte"),
    "Antena Este": filteredInstallations.filter((i) => i.antennaName === "Antena Este"),
    "Antena Oeste": filteredInstallations.filter((i) => i.antennaName === "Antena Oeste"),
  }

  const handleAddInstallation = () => {
    const installation = {
      id: Date.now(),
      ...newInstallation,
      installationCost: Number.parseFloat(newInstallation.installationCost),
      monthlyFee: Number.parseFloat(newInstallation.monthlyFee),
      paymentDay: Number.parseInt(newInstallation.paymentDay),
    }

    setInstallations([...installations, installation])
    setNewInstallation({
      clientName: "",
      antennaName: "",
      plan: "",
      pppoeUser: "",
      installationDate: "",
      technicianName: "",
      equipmentDetails: "",
      installationCost: "",
      monthlyFee: "",
      paymentDay: "",
      status: "pending",
      notes: "",
      hotspotEnabled: false,
      hotspotUser: "",
      hotspotPassword: "",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditInstallation = (installation) => {
    setEditingInstallation({
      id: installation.id,
      clientName: installation.clientName,
      antennaName: installation.antennaName,
      plan: installation.plan,
      pppoeUser: installation.pppoeUser,
      installationDate: installation.installationDate,
      technicianName: installation.technicianName,
      equipmentDetails: installation.equipmentDetails,
      installationCost: installation.installationCost.toString(),
      monthlyFee: installation.monthlyFee.toString(),
      paymentDay: installation.paymentDay.toString(),
      status: installation.status,
      notes: installation.notes,
      hotspotEnabled: installation.hotspotEnabled || false,
      hotspotUser: installation.hotspotUser || "",
      hotspotPassword: installation.hotspotPassword || "",
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateInstallation = () => {
    const updatedInstallations = installations.map((installation) =>
      installation.id === editingInstallation.id
        ? {
            ...installation,
            ...editingInstallation,
            installationCost: Number.parseFloat(editingInstallation.installationCost),
            monthlyFee: Number.parseFloat(editingInstallation.monthlyFee),
            paymentDay: Number.parseInt(editingInstallation.paymentDay),
          }
        : installation,
    )

    setInstallations(updatedInstallations)
    setEditingInstallation(null)
    setIsEditDialogOpen(false)
  }

  const updateInstallationStatus = (id: number, status: string) => {
    setInstallations(
      installations.map((installation) => (installation.id === id ? { ...installation, status } : installation)),
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-600">
            Completada
          </Badge>
        )
      case "pending":
        return <Badge variant="secondary">Pendiente</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelada</Badge>
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  const handleEnableHotspot = (installationId) => {
    const installation = installations.find((i) => i.id === installationId)
    if (installation) {
      const hotspotUser = `hotspot_${installation.clientName.toLowerCase().replace(" ", "_")}`
      const hotspotPassword = `pass${Math.floor(Math.random() * 1000)}`

      setInstallations(
        installations.map((inst) =>
          inst.id === installationId ? { ...inst, hotspotEnabled: true, hotspotUser, hotspotPassword } : inst,
        ),
      )
    }
  }

  const handleDisableHotspot = (installationId) => {
    setInstallations(
      installations.map((inst) =>
        inst.id === installationId ? { ...inst, hotspotEnabled: false, hotspotUser: "", hotspotPassword: "" } : inst,
      ),
    )
  }

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)} USD`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl">Gestión de Instalaciones</CardTitle>
              <CardDescription>Control de instalaciones programadas y completadas</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="completed">Completadas</SelectItem>
                  <SelectItem value="cancelled">Canceladas</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterAntenna} onValueChange={setFilterAntenna}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las Antenas</SelectItem>
                  {antennas.map((antenna) => (
                    <SelectItem key={antenna.id} value={antenna.name}>
                      {antenna.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Instalación
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Programar Nueva Instalación</DialogTitle>
                    <DialogDescription>Registra una nueva instalación en el sistema</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="client">Cliente</Label>
                      <Select
                        value={newInstallation.clientName}
                        onValueChange={(value) => setNewInstallation({ ...newInstallation, clientName: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockClients.map((client) => (
                            <SelectItem key={client.id} value={client.name}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="antenna">Antena</Label>
                      <Select
                        value={newInstallation.antennaName}
                        onValueChange={(value) => {
                          const ppoe = generatePPPOEUser(value)
                          setNewInstallation({ ...newInstallation, antennaName: value, pppoeUser: ppoe })
                          setPppoeUser(ppoe)
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar antena" />
                        </SelectTrigger>
                        <SelectContent>
                          {antennas.map((antenna) => (
                            <SelectItem key={antenna.id} value={antenna.name}>
                              {antenna.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="plan">Plan</Label>
                      <Select
                        value={newInstallation.plan}
                        onValueChange={(value) => {
                          const planSelected = plans.find((plan) => plan.name === value)
                          const monthlyFee = planSelected ? planSelected.price : 0
                          setNewInstallation({ ...newInstallation, plan: value, monthlyFee: monthlyFee.toString() })
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar plan" />
                        </SelectTrigger>
                        <SelectContent>
                          {plans.map((plan) => (
                            <SelectItem key={plan.id} value={plan.name}>
                              {plan.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="pppoeUser">Usuario PPPOE</Label>
                      <Input
                        id="pppoeUser"
                        type="text"
                        value={newInstallation.pppoeUser}
                        onChange={(e) => setNewInstallation({ ...newInstallation, pppoeUser: e.target.value })}
                        placeholder="Ej: AS1, AN2, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="installationDate">Fecha de Instalación</Label>
                      <Input
                        id="installationDate"
                        type="date"
                        value={newInstallation.installationDate}
                        onChange={(e) => setNewInstallation({ ...newInstallation, installationDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="technician">Técnico Asignado</Label>
                      <Select
                        value={newInstallation.technicianName}
                        onValueChange={(value) => setNewInstallation({ ...newInstallation, technicianName: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar técnico" />
                        </SelectTrigger>
                        <SelectContent>
                          {technicians.map((technician) => (
                            <SelectItem key={technician.id} value={technician.name}>
                              {technician.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="equipment">Detalles del Equipo</Label>
                      <Textarea
                        id="equipment"
                        value={newInstallation.equipmentDetails}
                        onChange={(e) => setNewInstallation({ ...newInstallation, equipmentDetails: e.target.value })}
                        placeholder="Router, cables, antenas, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="cost">Costo de Instalación</Label>
                      <Input
                        id="cost"
                        type="number"
                        value={newInstallation.installationCost}
                        onChange={(e) => setNewInstallation({ ...newInstallation, installationCost: e.target.value })}
                        placeholder="75"
                      />
                    </div>
                    <div>
                      <Label htmlFor="monthlyFee">Tarifa Mensual del Cliente</Label>
                      <Input
                        id="monthlyFee"
                        type="number"
                        value={newInstallation.monthlyFee}
                        onChange={(e) => setNewInstallation({ ...newInstallation, monthlyFee: e.target.value })}
                        placeholder="25"
                      />
                    </div>
                    <div>
                      <Label htmlFor="paymentDay">Día de Cobro</Label>
                      <Input
                        id="paymentDay"
                        type="number"
                        min="1"
                        max="31"
                        value={newInstallation.paymentDay}
                        onChange={(e) => setNewInstallation({ ...newInstallation, paymentDay: e.target.value })}
                        placeholder="5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">Notas</Label>
                      <Textarea
                        id="notes"
                        value={newInstallation.notes}
                        onChange={(e) => setNewInstallation({ ...newInstallation, notes: e.target.value })}
                        placeholder="Observaciones adicionales..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="hotspotUser">Usuario Hotspot (Opcional)</Label>
                      <Input
                        id="hotspotUser"
                        type="text"
                        value={newInstallation.hotspotUser}
                        onChange={(e) => setNewInstallation({ ...newInstallation, hotspotUser: e.target.value })}
                        placeholder="usuario_hotspot"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hotspotPassword">Clave Hotspot (Opcional)</Label>
                      <Input
                        id="hotspotPassword"
                        type="text"
                        value={newInstallation.hotspotPassword}
                        onChange={(e) => setNewInstallation({ ...newInstallation, hotspotPassword: e.target.value })}
                        placeholder="clave123"
                      />
                    </div>
                    <Button onClick={handleAddInstallation} className="w-full">
                      Programar Instalación
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Editar Instalación</DialogTitle>
                    <DialogDescription>Modifica los datos de la instalación</DialogDescription>
                  </DialogHeader>
                  {editingInstallation && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="editClient">Cliente</Label>
                        <Select
                          value={editingInstallation.clientName}
                          onValueChange={(value) =>
                            setEditingInstallation({ ...editingInstallation, clientName: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar cliente" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockClients.map((client) => (
                              <SelectItem key={client.id} value={client.name}>
                                {client.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="editAntenna">Antena</Label>
                        <Select
                          value={editingInstallation.antennaName}
                          onValueChange={(value) =>
                            setEditingInstallation({ ...editingInstallation, antennaName: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar antena" />
                          </SelectTrigger>
                          <SelectContent>
                            {antennas.map((antenna) => (
                              <SelectItem key={antenna.id} value={antenna.name}>
                                {antenna.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="plan">Plan</Label>
                        <Select
                          value={editingInstallation.plan}
                          onValueChange={(value) => {
                            setEditingInstallation({ ...editingInstallation, plan: value })
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar plan" />
                          </SelectTrigger>
                          <SelectContent>
                            {plans.map((plan) => (
                              <SelectItem key={plan.id} value={plan.name}>
                                {plan.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="editPppoeUser">Usuario PPPOE</Label>
                        <Input
                          id="editPppoeUser"
                          type="text"
                          value={editingInstallation.pppoeUser}
                          onChange={(e) =>
                            setEditingInstallation({ ...editingInstallation, pppoeUser: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="editInstallationDate">Fecha de Instalación</Label>
                        <Input
                          id="editInstallationDate"
                          type="date"
                          value={editingInstallation.installationDate}
                          onChange={(e) =>
                            setEditingInstallation({ ...editingInstallation, installationDate: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="editTechnician">Técnico Asignado</Label>
                        <Select
                          value={editingInstallation.technicianName}
                          onValueChange={(value) =>
                            setEditingInstallation({ ...editingInstallation, technicianName: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar técnico" />
                          </SelectTrigger>
                          <SelectContent>
                            {technicians.map((technician) => (
                              <SelectItem key={technician.id} value={technician.name}>
                                {technician.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="editEquipment">Detalles del Equipo</Label>
                        <Textarea
                          id="editEquipment"
                          value={editingInstallation.equipmentDetails}
                          onChange={(e) =>
                            setEditingInstallation({ ...editingInstallation, equipmentDetails: e.target.value })
                          }
                          placeholder="Router, cables, antenas, etc."
                        />
                      </div>
                      <div>
                        <Label htmlFor="editCost">Costo de Instalación</Label>
                        <Input
                          id="editCost"
                          type="number"
                          value={editingInstallation.installationCost}
                          onChange={(e) =>
                            setEditingInstallation({ ...editingInstallation, installationCost: e.target.value })
                          }
                          placeholder="75"
                        />
                      </div>
                      <div>
                        <Label htmlFor="editMonthlyFee">Tarifa Mensual del Cliente</Label>
                        <Input
                          id="editMonthlyFee"
                          type="number"
                          value={editingInstallation.monthlyFee}
                          onChange={(e) =>
                            setEditingInstallation({ ...editingInstallation, monthlyFee: e.target.value })
                          }
                          placeholder="25"
                        />
                      </div>
                      <div>
                        <Label htmlFor="editPaymentDay">Día de Cobro</Label>
                        <Input
                          id="editPaymentDay"
                          type="number"
                          min="1"
                          max="31"
                          value={editingInstallation.paymentDay}
                          onChange={(e) =>
                            setEditingInstallation({ ...editingInstallation, paymentDay: e.target.value })
                          }
                          placeholder="5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="editStatus">Estado</Label>
                        <Select
                          value={editingInstallation.status}
                          onValueChange={(value) => setEditingInstallation({ ...editingInstallation, status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pendiente</SelectItem>
                            <SelectItem value="completed">Completada</SelectItem>
                            <SelectItem value="cancelled">Cancelada</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="editNotes">Notas</Label>
                        <Textarea
                          id="editNotes"
                          value={editingInstallation.notes}
                          onChange={(e) => setEditingInstallation({ ...editingInstallation, notes: e.target.value })}
                          placeholder="Observaciones adicionales..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="editHotspotUser">Usuario Hotspot</Label>
                        <Input
                          id="editHotspotUser"
                          type="text"
                          value={editingInstallation.hotspotUser}
                          onChange={(e) =>
                            setEditingInstallation({ ...editingInstallation, hotspotUser: e.target.value })
                          }
                          placeholder="usuario_hotspot"
                        />
                      </div>
                      <div>
                        <Label htmlFor="editHotspotPassword">Clave Hotspot</Label>
                        <Input
                          id="editHotspotPassword"
                          type="text"
                          value={editingInstallation.hotspotPassword}
                          onChange={(e) =>
                            setEditingInstallation({ ...editingInstallation, hotspotPassword: e.target.value })
                          }
                          placeholder="clave123"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleUpdateInstallation} className="flex-1">
                          Guardar Cambios
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1">
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {Object.keys(installationsByAntenna).map(
            (antennaName) =>
              installationsByAntenna[antennaName].length > 0 && (
                <div key={antennaName} className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">{antennaName}</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {installationsByAntenna[antennaName].map((installation) => (
                      <Card key={installation.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{installation.clientName}</CardTitle>
                              <p className="text-sm text-gray-500">{installation.clientPhone}</p>
                            </div>
                            {getStatusBadge(installation.status)}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center space-x-2 text-sm">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span>{installation.antennaName}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <User className="h-4 w-4 text-gray-500" />
                            <span>{installation.pppoeUser}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span>{installation.installationDate}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <User className="h-4 w-4 text-gray-500" />
                            <span>{installation.technicianName}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <DollarSign className="h-4 w-4 text-gray-500" />
                            <span>{formatCurrency(installation.installationCost)}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <DollarSign className="h-4 w-4 text-gray-500" />
                            <span>Tarifa Mensual: {formatCurrency(installation.monthlyFee)}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span>Día de Cobro: {installation.paymentDay}</span>
                          </div>

                          <div className="pt-2 border-t">
                            <div className="mb-2">
                              <p className="text-xs font-medium text-gray-500 mb-1">EQUIPO:</p>
                              <p className="text-sm">{installation.equipmentDetails}</p>
                            </div>
                            {installation.notes && (
                              <div className="mb-3">
                                <p className="text-xs font-medium text-gray-500 mb-1">NOTAS:</p>
                                <p className="text-sm text-gray-600">{installation.notes}</p>
                              </div>
                            )}
                            {installation.hotspotEnabled ? (
                              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-green-800">🌐 Hotspot Habilitado</span>
                                  <Badge variant="default" className="bg-green-600">
                                    Activo
                                  </Badge>
                                </div>
                                <div className="space-y-1 text-sm text-green-700">
                                  <p>
                                    <strong>Usuario:</strong> {installation.hotspotUser}
                                  </p>
                                  <p>
                                    <strong>Clave:</strong> {installation.hotspotPassword}
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDisableHotspot(installation.id)}
                                  className="mt-2 w-full border-red-300 text-red-600 hover:bg-red-50"
                                >
                                  Deshabilitar Hotspot
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => handleEnableHotspot(installation.id)}
                                className="w-full bg-blue-600 hover:bg-blue-700"
                              >
                                🌐 Habilitar Hotspot
                              </Button>
                            )}

                            <div className="flex gap-2 mt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditInstallation(installation)}
                                className="flex-1"
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Editar
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ),
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Total Instalaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{installations.length}</div>
            <p className="text-xs text-blue-600">Instalaciones registradas</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Completadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {installations.filter((i) => i.status === "completed").length}
            </div>
            <p className="text-xs text-green-600">Instalaciones exitosas</p>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">
              {installations.filter((i) => i.status === "pending").length}
            </div>
            <p className="text-xs text-yellow-600">Por completar</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
