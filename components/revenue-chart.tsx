"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const monthlyData = [
  { month: "Ene", revenue: 180000, clients: 4 },
  { month: "Feb", revenue: 225000, clients: 5 },
  { month: "Mar", revenue: 225000, clients: 5 },
  { month: "Abr", revenue: 225000, clients: 5 },
  { month: "May", revenue: 225000, clients: 5 },
  { month: "Jun", revenue: 225000, clients: 5 },
  { month: "Jul", revenue: 225000, clients: 5 },
  { month: "Ago", revenue: 225000, clients: 5 },
  { month: "Sep", revenue: 225000, clients: 5 },
  { month: "Oct", revenue: 225000, clients: 5 },
  { month: "Nov", revenue: 225000, clients: 5 },
  { month: "Dic", revenue: 225000, clients: 5 },
]

const weeklyData = [
  { week: "Sem 1", revenue: 56250 },
  { week: "Sem 2", revenue: 56250 },
  { week: "Sem 3", revenue: 56250 },
  { week: "Sem 4", revenue: 56250 },
]

const antennaRevenue = [
  { name: "Antena Norte", value: 90000, color: "#3B82F6" },
  { name: "Antena Sur", value: 45000, color: "#10B981" },
  { name: "Antena Este", value: 50000, color: "#F59E0B" },
  { name: "Antena Oeste", value: 45000, color: "#EF4444" },
]

export default function RevenueChart() {
  const [chartType, setChartType] = useState("monthly")

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Análisis de Ingresos</h3>
        <Select value={chartType} onValueChange={setChartType}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Mensual</SelectItem>
            <SelectItem value="weekly">Semanal</SelectItem>
            <SelectItem value="antennas">Por Antena</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {chartType === "monthly" && (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), "Ingresos"]}
                labelStyle={{ color: "#374151" }}
              />
              <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {chartType === "weekly" && (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), "Ingresos"]}
                labelStyle={{ color: "#374151" }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: "#10B981", strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {chartType === "antennas" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={antennaRevenue}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {antennaRevenue.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700">Ingresos por Antena</h4>
            {antennaRevenue.map((antenna, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: antenna.color }}></div>
                  <span className="font-medium">{antenna.name}</span>
                </div>
                <span className="font-bold text-gray-900">{formatCurrency(antenna.value)}</span>
              </div>
            ))}
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Total:</span>
                <span className="font-bold text-lg text-blue-600">
                  {formatCurrency(antennaRevenue.reduce((sum, a) => sum + a.value, 0))}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$225,000</div>
            <p className="text-xs text-blue-100">Diciembre 2024</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Promedio Mensual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$218,750</div>
            <p className="text-xs text-green-100">Últimos 12 meses</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Proyección Anual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,625,000</div>
            <p className="text-xs text-purple-100">Basado en tendencia actual</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
