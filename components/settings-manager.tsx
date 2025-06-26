"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { DollarSign, Building2, Plus, Edit, Trash2, Save, RefreshCw, Globe, CreditCard } from "lucide-react"

// Configuración inicial
const initialSettings = {
  bcvRate: 36.5,
  lastBcvUpdate: "2024-12-24 10:00:00",
  autoUpdateBcv: false,
  defaultCurrency: "USD",
  invoiceCurrency: "USD",
  allowPaymentInVes: true,
  companyInfo: {
    name: "Internet Service Provider",
    rif: "J-12345678-9",
    address: "Av. Principal, Caracas, Venezuela",
    phone: "+58 212 123 4567",
    email: "contacto@internetservice.com",
  },
}

const venezuelanBanks = [
  { id: 1, name: "Banesco", code: "0134", active: true },
  { id: 2, name: "Banco de Venezuela", code: "0102", active: true },
  { id: 3, name: "Banco Mercantil", code: "0105", active: true },
  { id: 4, name: "Banco Provincial", code: "0108", active: true },
  { id: 5, name: "Banco Bicentenario", code: "0175", active: true },
  { id: 6, name: "Banco del Tesoro", code: "0163", active: false },
  { id: 7, name: "Banco Exterior", code: "0115", active: true },
  { id: 8, name: "100% Banco", code: "0156", active: false },
]

const paymentMethods = [
  { id: 1, name: "Efectivo USD", type: "cash", currency: "USD", active: true },
  { id: 2, name: "Efectivo VES", type: "cash", currency: "VES", active: true },
  { id: 3, name: "Transferencia Bancaria", type: "transfer", currency: "VES", active: true },
  { id: 4, name: "Pago Móvil", type: "mobile", currency: "VES", active: true },
  { id: 5, name: "Zelle", type: "digital", currency: "USD", active: true },
  { id: 6, name: "PayPal", type: "digital", currency: "USD", active: false },
]

export default function SettingsManager() {
  const [settings, setSettings] = useState(initialSettings)
  const [banks, setBanks] = useState(venezuelanBanks)
  const [methods, setMethods] = useState(paymentMethods)
  const [isEditingBcv, setIsEditingBcv] = useState(false)
  const [isAddingBank, setIsAddingBank] = useState(false)
  const [isAddingMethod, setIsAddingMethod] = useState(false)
  const [tempBcvRate, setTempBcvRate] = useState(settings.bcvRate.toString())

  const [newBank, setNewBank] = useState({
    name: "",
    code: "",
    active: true,
  })

  const [newMethod, setNewMethod] = useState({
    name: "",
    type: "transfer",
    currency: "VES",
    active: true,
  })

  // Simular actualización de tasa BCV
  const updateBcvRate = async () => {
    // En un sistema real, esto haría una llamada a la API del BCV
    const simulatedRate = (Math.random() * (38 - 35) + 35).toFixed(2)

    setSettings({
      ...settings,
      bcvRate: Number.parseFloat(simulatedRate),
      lastBcvUpdate: new Date().toLocaleString("es-VE"),
    })

    alert(`Tasa BCV actualizada: Bs. ${simulatedRate} por USD`)
  }

  const saveBcvRate = () => {
    const newRate = Number.parseFloat(tempBcvRate)
    if (newRate > 0) {
      setSettings({
        ...settings,
        bcvRate: newRate,
        lastBcvUpdate: new Date().toLocaleString("es-VE"),
      })
      setIsEditingBcv(false)
    }
  }

  const toggleBankStatus = (bankId: number) => {
    setBanks(banks.map((bank) => (bank.id === bankId ? { ...bank, active: !bank.active } : bank)))
  }

  const toggleMethodStatus = (methodId: number) => {
    setMethods(methods.map((method) => (method.id === methodId ? { ...method, active: !method.active } : method)))
  }

  const addBank = () => {
    if (newBank.name && newBank.code) {
      setBanks([
        ...banks,
        {
          id: Date.now(),
          ...newBank,
        },
      ])
      setNewBank({ name: "", code: "", active: true })
      setIsAddingBank(false)
    }
  }

  const addPaymentMethod = () => {
    if (newMethod.name) {
      setMethods([
        ...methods,
        {
          id: Date.now(),
          ...newMethod,
        },
      ])
      setNewMethod({ name: "", type: "transfer", currency: "VES", active: true })
      setIsAddingMethod(false)
    }
  }

  const removeBank = (bankId: number) => {
    setBanks(banks.filter((bank) => bank.id !== bankId))
  }

  const removeMethod = (methodId: number) => {
    setMethods(methods.filter((method) => method.id !== methodId))
  }

  const formatCurrency = (amount: number, currency: "USD" | "VES" = "USD") => {
    if (currency === "USD") {
      return `$${amount.toFixed(2)} USD`
    } else {
      return `Bs. ${amount.toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
  }

  return (
    <div className="space-y-6">
      {/* Configuración de Monedas y Tasa BCV */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Configuración de Monedas y Tasa BCV
          </CardTitle>
          <CardDescription>
            Administra las monedas del sistema y la tasa de cambio del Banco Central de Venezuela
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tasa BCV */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-blue-800">Tasa BCV Actual</h3>
                <p className="text-sm text-blue-600">Última actualización: {settings.lastBcvUpdate}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={updateBcvRate} className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Actualizar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingBcv(true)}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>
              </div>
            </div>

            {isEditingBcv ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  step="0.01"
                  value={tempBcvRate}
                  onChange={(e) => setTempBcvRate(e.target.value)}
                  className="w-32"
                />
                <span className="text-sm">Bs. por USD</span>
                <Button size="sm" onClick={saveBcvRate}>
                  <Save className="h-4 w-4 mr-1" />
                  Guardar
                </Button>
                <Button size="sm" variant="outline" onClick={() => setIsEditingBcv(false)}>
                  Cancelar
                </Button>
              </div>
            ) : (
              <div className="text-3xl font-bold text-blue-900">Bs. {settings.bcvRate.toFixed(2)} por USD</div>
            )}
          </div>

          {/* Configuración de Monedas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Moneda para Facturas</Label>
              <Select
                value={settings.invoiceCurrency}
                onValueChange={(value) => setSettings({ ...settings, invoiceCurrency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">Dólares Americanos (USD)</SelectItem>
                  <SelectItem value="VES">Bolívares (VES)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Moneda por Defecto</Label>
              <Select
                value={settings.defaultCurrency}
                onValueChange={(value) => setSettings({ ...settings, defaultCurrency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">Dólares Americanos (USD)</SelectItem>
                  <SelectItem value="VES">Bolívares (VES)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={settings.allowPaymentInVes}
              onCheckedChange={(checked) => setSettings({ ...settings, allowPaymentInVes: checked })}
            />
            <Label>Permitir pagos en Bolívares</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={settings.autoUpdateBcv}
              onCheckedChange={(checked) => setSettings({ ...settings, autoUpdateBcv: checked })}
            />
            <Label>Actualización automática de tasa BCV (diaria)</Label>
          </div>
        </CardContent>
      </Card>

      {/* Configuración de Bancos */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Bancos Venezolanos
              </CardTitle>
              <CardDescription>Administra los bancos disponibles para transferencias y pagos móviles</CardDescription>
            </div>
            <Dialog open={isAddingBank} onOpenChange={setIsAddingBank}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Agregar Banco
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Banco</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Nombre del Banco</Label>
                    <Input
                      value={newBank.name}
                      onChange={(e) => setNewBank({ ...newBank, name: e.target.value })}
                      placeholder="Ej: Banco Nacional"
                    />
                  </div>
                  <div>
                    <Label>Código del Banco</Label>
                    <Input
                      value={newBank.code}
                      onChange={(e) => setNewBank({ ...newBank, code: e.target.value })}
                      placeholder="Ej: 0191"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={newBank.active}
                      onCheckedChange={(checked) => setNewBank({ ...newBank, active: checked })}
                    />
                    <Label>Activo</Label>
                  </div>
                  <Button onClick={addBank} className="w-full">
                    Agregar Banco
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {banks.map((bank) => (
              <Card
                key={bank.id}
                className={`${bank.active ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{bank.name}</h3>
                    <Badge variant={bank.active ? "default" : "secondary"}>{bank.active ? "Activo" : "Inactivo"}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Código: {bank.code}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => toggleBankStatus(bank.id)} className="flex-1">
                      {bank.active ? "Desactivar" : "Activar"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeBank(bank.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Métodos de Pago */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Métodos de Pago
              </CardTitle>
              <CardDescription>Configura los métodos de pago disponibles para los clientes</CardDescription>
            </div>
            <Dialog open={isAddingMethod} onOpenChange={setIsAddingMethod}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Agregar Método
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agregar Método de Pago</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Nombre del Método</Label>
                    <Input
                      value={newMethod.name}
                      onChange={(e) => setNewMethod({ ...newMethod, name: e.target.value })}
                      placeholder="Ej: Binance Pay"
                    />
                  </div>
                  <div>
                    <Label>Tipo</Label>
                    <Select
                      value={newMethod.type}
                      onValueChange={(value) => setNewMethod({ ...newMethod, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Efectivo</SelectItem>
                        <SelectItem value="transfer">Transferencia</SelectItem>
                        <SelectItem value="mobile">Pago Móvil</SelectItem>
                        <SelectItem value="digital">Digital</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Moneda</Label>
                    <Select
                      value={newMethod.currency}
                      onValueChange={(value) => setNewMethod({ ...newMethod, currency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="VES">VES</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={newMethod.active}
                      onCheckedChange={(checked) => setNewMethod({ ...newMethod, active: checked })}
                    />
                    <Label>Activo</Label>
                  </div>
                  <Button onClick={addPaymentMethod} className="w-full">
                    Agregar Método
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {methods.map((method) => (
              <Card
                key={method.id}
                className={`${method.active ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{method.name}</h3>
                    <Badge variant={method.active ? "default" : "secondary"}>
                      {method.active ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600 mb-3">
                    <p>Tipo: {method.type}</p>
                    <p>Moneda: {method.currency}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleMethodStatus(method.id)}
                      className="flex-1"
                    >
                      {method.active ? "Desactivar" : "Activar"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeMethod(method.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Información de la Empresa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Información de la Empresa
          </CardTitle>
          <CardDescription>Datos que aparecerán en las facturas y comunicaciones</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Nombre de la Empresa</Label>
              <Input
                value={settings.companyInfo.name}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    companyInfo: { ...settings.companyInfo, name: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <Label>RIF</Label>
              <Input
                value={settings.companyInfo.rif}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    companyInfo: { ...settings.companyInfo, rif: e.target.value },
                  })
                }
              />
            </div>
          </div>

          <div>
            <Label>Dirección</Label>
            <Textarea
              value={settings.companyInfo.address}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  companyInfo: { ...settings.companyInfo, address: e.target.value },
                })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Teléfono</Label>
              <Input
                value={settings.companyInfo.phone}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    companyInfo: { ...settings.companyInfo, phone: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={settings.companyInfo.email}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    companyInfo: { ...settings.companyInfo, email: e.target.value },
                  })
                }
              />
            </div>
          </div>

          <Button className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Guardar Configuración
          </Button>
        </CardContent>
      </Card>

      {/* Resumen de Configuración */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Resumen de Configuración Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="font-semibold text-blue-800">Tasa BCV</p>
              <p className="text-blue-600">Bs. {settings.bcvRate.toFixed(2)} por USD</p>
            </div>
            <div>
              <p className="font-semibold text-blue-800">Moneda Facturas</p>
              <p className="text-blue-600">{settings.invoiceCurrency}</p>
            </div>
            <div>
              <p className="font-semibold text-blue-800">Bancos Activos</p>
              <p className="text-blue-600">
                {banks.filter((b) => b.active).length} de {banks.length}
              </p>
            </div>
            <div>
              <p className="font-semibold text-blue-800">Métodos de Pago</p>
              <p className="text-blue-600">{methods.filter((m) => m.active).length} activos</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
