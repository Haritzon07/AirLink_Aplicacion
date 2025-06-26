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
import { Plus, Wifi, MapPin, Settings, AlertTriangle, CheckCircle } from "lucide-react"

const mockAntennas = [
  {
    id: 1,
    name: "Antena Norte",
    location: "Sector Norte - Calle Principal",
    status: "active",
    installationDate: "2024-01-15",
    coverageArea: "Barrios: El Prado, Los Alamos, Villa Norte",
    connectedClients: 2,
    maxCapacity: 50,
    signalStrength: 95,
    lastMaintenance: "2024-11-01",
  },
  {
    id: 2,
    name: "Antena Sur",
    location: "Sector Sur - Avenida Central",
    status: "active",
    installationDate: "2024-02-01",
    coverageArea: "Barrios: San José, La Esperanza, Villa Sur",
    connectedClients: 1,
    maxCapacity: 50,
    signalStrength: 88,
    lastMaintenance: "2024-10-15",
  },
  {
    id: 3,
    name: "Antena Este",
    location: "Sector Este - Plaza Mayor",
    status: "active",
    installationDate: "2024-02-15",
    coverageArea: "Barrios: El Mirador, Las Flores, Zona Este",
    connectedClients: 1,
    maxCapacity: 50,
    signalStrength: 92,
    lastMaintenance: "2024-11-10",
  },
  {
    id: 4,
    name: "Antena Oeste",
    location: "Sector Oeste - Terminal",
    status: "maintenance",
    installationDate: "2024-03-01",
    coverageArea: "Barrios: El Bosque, La Colina, Sector Oeste",
    connectedClients: 1,
    maxCapacity: 50,
    signalStrength: 75,
    lastMaintenance: "2024-12-01",
  },
]

export default function AntennasManager() {
  const [antennas, setAntennas] = useState(mockAntennas)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingAntenna, setEditingAntenna] = useState<any>(null)

  const [newAntenna, setNewAntenna] = useState({
    name: "",
    location: "",
    status: "active",
    installationDate: "",
    coverageArea: "",
    maxCapacity: "50",
    signalStrength: "90",
  })

  const handleAddAntenna = () => {
    const antenna = {
      id: Date.now(),
      ...newAntenna,
      maxCapacity: Number.parseInt(newAntenna.maxCapacity),
      signalStrength: Number.parseInt(newAntenna.signalStrength),
      connectedClients: 0,
      lastMaintenance: new Date().toISOString().split("T")[0],
    }

    setAntennas([...antennas, antenna])
    setNewAntenna({
      name: "",
      location: "",
      status: "active",
      installationDate: "",
      coverageArea: "",
      maxCapacity: "50",
      signalStrength: "90",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditAntenna = (antenna: any) => {
    setEditingAntenna(antenna)
    setNewAntenna({
      name: antenna.name,
      location: antenna.location,
      status: antenna.status,
      installationDate: antenna.installationDate,
      coverageArea: antenna.coverageArea,
      maxCapacity: antenna.maxCapacity.toString(),
      signalStrength: antenna.signalStrength.toString(),
    })
  }

  const handleUpdateAntenna = () => {
    const updatedAntennas = antennas.map((antenna) =>
      antenna.id === editingAntenna.id
        ? {
            ...antenna,
            ...newAntenna,
            maxCapacity: Number.parseInt(newAntenna.maxCapacity),
            signalStrength: Number.parseInt(newAntenna.signalStrength),
          }
        : antenna,
    )
    setAntennas(updatedAntennas)
    setEditingAntenna(null)
    setNewAntenna({
      name: "",
      location: "",
      status: "active",
      installationDate: "",
      coverageArea: "",
      maxCapacity: "50",
      signalStrength: "90",
    })
  }

  const updateAntennaStatus = (id: number, status: string) => {
    setAntennas(antennas.map((antenna) => (antenna.id === id ? { ...antenna, status } : antenna)))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-600">
            Activa
          </Badge>
        )
      case "maintenance":
        return (
          <Badge variant="secondary" className="bg-yellow-600">
            Mantenimiento
          </Badge>
        )
      case "inactive":
        return <Badge variant="destructive">Inactiva</Badge>
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  const getSignalColor = (strength: number) => {
    if (strength >= 90) return "text-green-600"
    if (strength >= 75) return "text-yellow-600"
    return "text-red-600"
  }

  const getCapacityColor = (current: number, max: number) => {
    const percentage = (current / max) * 100
    if (percentage < 70) return "text-green-600"
    if (percentage < 90) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl">Gestión de Antenas Starlink</CardTitle>
              <CardDescription>Control y monitoreo de las 4 antenas de distribución</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Antena
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Agregar Nueva Antena</DialogTitle>
                  <DialogDescription>Registra una nueva antena Starlink</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nombre de la Antena</Label>
                    <Input
                      id="name"
                      value={newAntenna.name}
                      onChange={(e) => setNewAntenna({ ...newAntenna, name: e.target.value })}
                      placeholder="Ej: Antena Centro"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Ubicación</Label>
                    <Input
                      id="location"
                      value={newAntenna.location}
                      onChange={(e) => setNewAntenna({ ...newAntenna, location: e.target.value })}
                      placeholder="Ej: Sector Centro - Plaza Principal"
                    />
                  </div>
                  <div>
                    <Label htmlFor="installationDate">Fecha de Instalación</Label>
                    <Input
                      id="installationDate"
                      type="date"
                      value={newAntenna.installationDate}
                      onChange={(e) => setNewAntenna({ ...newAntenna, installationDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="coverageArea">Área de Cobertura</Label>
                    <Textarea
                      id="coverageArea"
                      value={newAntenna.coverageArea}
                      onChange={(e) => setNewAntenna({ ...newAntenna, coverageArea: e.target.value })}
                      placeholder="Barrios y sectores que cubre esta antena"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxCapacity">Capacidad Máxima</Label>
                    <Input
                      id="maxCapacity"
                      type="number"
                      value={newAntenna.maxCapacity}
                      onChange={(e) => setNewAntenna({ ...newAntenna, maxCapacity: e.target.value })}
                      placeholder="50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signalStrength">Fuerza de Señal (%)</Label>
                    <Input
                      id="signalStrength"
                      type="number"
                      min="0"
                      max="100"
                      value={newAntenna.signalStrength}
                      onChange={(e) => setNewAntenna({ ...newAntenna, signalStrength: e.target.value })}
                      placeholder="90"
                    />
                  </div>
                  <Button onClick={handleAddAntenna} className="w-full">
                    Agregar Antena
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {antennas.map((antenna) => (
              <Card key={antenna.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <Wifi className="h-5 w-5 text-blue-600" />
                      <div>
                        <CardTitle className="text-lg">{antenna.name}</CardTitle>
                        <p className="text-sm text-gray-500">Instalada: {antenna.installationDate}</p>
                      </div>
                    </div>
                    {getStatusBadge(antenna.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <span className="text-gray-600">{antenna.location}</span>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Clientes Conectados</span>
                      <span className={`font-bold ${getCapacityColor(antenna.connectedClients, antenna.maxCapacity)}`}>
                        {antenna.connectedClients}/{antenna.maxCapacity}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(antenna.connectedClients / antenna.maxCapacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Fuerza de Señal</span>
                      <span className={`font-bold ${getSignalColor(antenna.signalStrength)}`}>
                        {antenna.signalStrength}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          antenna.signalStrength >= 90
                            ? "bg-green-500"
                            : antenna.signalStrength >= 75
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${antenna.signalStrength}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="text-sm">
                    <p className="font-medium text-gray-700 mb-1">Área de Cobertura:</p>
                    <p className="text-gray-600">{antenna.coverageArea}</p>
                  </div>

                  <div className="text-sm">
                    <p className="font-medium text-gray-700">Último Mantenimiento:</p>
                    <p className="text-gray-600">{antenna.lastMaintenance}</p>
                  </div>

                  <div className="flex gap-2 pt-2 border-t">
                    <Button size="sm" variant="outline" onClick={() => handleEditAntenna(antenna)} className="flex-1">
                      <Settings className="h-4 w-4 mr-1" />
                      Configurar
                    </Button>
                    {antenna.status === "active" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateAntennaStatus(antenna.id, "maintenance")}
                        className="flex-1"
                      >
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Mantenimiento
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => updateAntennaStatus(antenna.id, "active")}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Activar
                      </Button>
                    )}
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
            <CardTitle className="text-sm font-medium text-green-800">Antenas Activas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {antennas.filter((a) => a.status === "active").length}
            </div>
            <p className="text-xs text-green-600">De {antennas.length} totales</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Clientes Conectados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {antennas.reduce((sum, a) => sum + a.connectedClients, 0)}
            </div>
            <p className="text-xs text-blue-600">Total en red</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Capacidad Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {antennas.reduce((sum, a) => sum + a.maxCapacity, 0)}
            </div>
            <p className="text-xs text-purple-600">Clientes máximos</p>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800">Señal Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">
              {Math.round(antennas.reduce((sum, a) => sum + a.signalStrength, 0) / antennas.length)}%
            </div>
            <p className="text-xs text-yellow-600">Calidad de red</p>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      {editingAntenna && (
        <Dialog open={!!editingAntenna} onOpenChange={() => setEditingAntenna(null)}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Antena</DialogTitle>
              <DialogDescription>Modifica la configuración de la antena</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Nombre</Label>
                <Input
                  id="edit-name"
                  value={newAntenna.name}
                  onChange={(e) => setNewAntenna({ ...newAntenna, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-location">Ubicación</Label>
                <Input
                  id="edit-location"
                  value={newAntenna.location}
                  onChange={(e) => setNewAntenna({ ...newAntenna, location: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-status">Estado</Label>
                <Select
                  value={newAntenna.status}
                  onValueChange={(value) => setNewAntenna({ ...newAntenna, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activa</SelectItem>
                    <SelectItem value="maintenance">Mantenimiento</SelectItem>
                    <SelectItem value="inactive">Inactiva</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-coverageArea">Área de Cobertura</Label>
                <Textarea
                  id="edit-coverageArea"
                  value={newAntenna.coverageArea}
                  onChange={(e) => setNewAntenna({ ...newAntenna, coverageArea: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-maxCapacity">Capacidad Máxima</Label>
                <Input
                  id="edit-maxCapacity"
                  type="number"
                  value={newAntenna.maxCapacity}
                  onChange={(e) => setNewAntenna({ ...newAntenna, maxCapacity: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-signalStrength">Fuerza de Señal (%)</Label>
                <Input
                  id="edit-signalStrength"
                  type="number"
                  min="0"
                  max="100"
                  value={newAntenna.signalStrength}
                  onChange={(e) => setNewAntenna({ ...newAntenna, signalStrength: e.target.value })}
                />
              </div>
              <Button onClick={handleUpdateAntenna} className="w-full">
                Actualizar Antena
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
