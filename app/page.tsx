"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Wifi,
  DollarSign,
  FileText,
  Calendar,
  Settings,
  Menu,
  X,
  Home,
  Wrench,
  CreditCard,
  Receipt,
  TrendingUp,
} from "lucide-react"

// Importar componentes
import ClientsManager from "@/components/clients-manager"
import InstallationsManager from "@/components/installations-manager"
import PaymentsManager from "@/components/payments-manager"
import AccountsReceivableManager from "@/components/accounts-receivable-manager"
import InvoicesManager from "@/components/invoices-manager"
import AntennaManager from "@/components/antennas-manager"
import SettingsManager from "@/components/settings-manager"
import TransactionsManager from "@/components/transactions-manager"
import RevenueChart from "@/components/revenue-chart"

export default function InternetManagementSystem() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Datos simulados para el dashboard
  const stats = {
    totalClients: 156,
    activeConnections: 142,
    monthlyRevenue: 3850,
    pendingPayments: 12,
    overdueAmount: 450,
    upcomingAmount: 1200,
  }

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "clients", label: "Clientes", icon: Users },
    { id: "antennas", label: "Puntos de Acceso", icon: Wifi },
    { id: "installations", label: "Instalaciones", icon: Wrench },
    { id: "payments", label: "Pagos", icon: CreditCard },
    { id: "accounts-receivable", label: "Cuentas por Cobrar", icon: TrendingUp },
    { id: "invoices", label: "Facturas", icon: FileText },
    { id: "transactions", label: "Transacciones", icon: Receipt },
    { id: "settings", label: "Configuración", icon: Settings },
  ]

  const renderContent = () => {
    switch (activeSection) {
      case "clients":
        return <ClientsManager />
      case "antennas":
        return <AntennaManager />
      case "installations":
        return <InstallationsManager />
      case "payments":
        return <PaymentsManager />
      case "accounts-receivable":
        return <AccountsReceivableManager />
      case "invoices":
        return <InvoicesManager />
      case "transactions":
        return <TransactionsManager />
      case "settings":
        return <SettingsManager />
      default:
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Total Clientes</p>
                      <p className="text-3xl font-bold">{stats.totalClients}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Conexiones Activas</p>
                      <p className="text-3xl font-bold">{stats.activeConnections}</p>
                    </div>
                    <Wifi className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">Ingresos Mensuales</p>
                      <p className="text-3xl font-bold">${stats.monthlyRevenue}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100">Pagos Pendientes</p>
                      <p className="text-3xl font-bold">{stats.pendingPayments}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cuentas por Cobrar Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-800 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Facturas Vencidas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-900">${stats.overdueAmount}</div>
                  <p className="text-red-600 text-sm">Requieren atención inmediata</p>
                  <Button
                    className="mt-3 bg-red-600 hover:bg-red-700"
                    size="sm"
                    onClick={() => setActiveSection("accounts-receivable")}
                  >
                    Ver Detalles
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="text-yellow-800 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Facturas Por Vencer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-900">${stats.upcomingAmount}</div>
                  <p className="text-yellow-600 text-sm">Próximos 7 días</p>
                  <Button
                    className="mt-3 bg-yellow-600 hover:bg-yellow-700"
                    size="sm"
                    onClick={() => setActiveSection("accounts-receivable")}
                  >
                    Ver Detalles
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Ingresos Mensuales</CardTitle>
                <CardDescription>Evolución de ingresos en los últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <RevenueChart />
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    className="h-20 flex flex-col gap-2"
                    variant="outline"
                    onClick={() => setActiveSection("clients")}
                  >
                    <Users className="h-6 w-6" />
                    Nuevo Cliente
                  </Button>
                  <Button
                    className="h-20 flex flex-col gap-2"
                    variant="outline"
                    onClick={() => setActiveSection("payments")}
                  >
                    <CreditCard className="h-6 w-6" />
                    Registrar Pago
                  </Button>
                  <Button
                    className="h-20 flex flex-col gap-2"
                    variant="outline"
                    onClick={() => setActiveSection("installations")}
                  >
                    <Wrench className="h-6 w-6" />
                    Nueva Instalación
                  </Button>
                  <Button
                    className="h-20 flex flex-col gap-2"
                    variant="outline"
                    onClick={() => setActiveSection("invoices")}
                  >
                    <FileText className="h-6 w-6" />
                    Generar Factura
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">Internet Manager</h1>
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id)
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 transition-colors ${
                  activeSection === item.id ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600" : "text-gray-700"
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="lg:hidden mr-2" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <h2 className="text-xl font-semibold text-gray-800">
              {menuItems.find((item) => item.id === activeSection)?.label || "Dashboard"}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Tasa BCV: Bs. 36.50
            </Badge>
            <div className="text-sm text-gray-600">
              {new Date().toLocaleDateString("es-VE", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">{renderContent()}</main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
