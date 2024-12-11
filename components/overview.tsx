"use client";

import { useState, useMemo } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  Line,
  ComposedChart,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatter } from "@/lib/utils";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from "lucide-react";

interface OverviewProps {
  data: {
    [year: number]: Array<{ name: string; total: number }>;
  };
}

const colors = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
  "#F06292",
  "#AED581",
  "#7986CB",
  "#4DB6AC",
  "#FFD54F",
  "#9575CD",
  "#4DD0E1",
];

export const Overview: React.FC<OverviewProps> = ({ data }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const yearData =
    data[selectedYear] ||
    Array(12)
      .fill({ name: "", total: 0 })
      .map((_, index) => ({
        name: new Date(selectedYear, index).toLocaleString("es-CL", {
          month: "long",
        }),
        total: 0,
      }));

  const totalAnnualRevenue = yearData.reduce(
    (sum, item) => sum + (item.total || 0),
    0
  );

  const stats = useMemo(() => {
    const prevYearData = data[selectedYear - 1] || [];
    const prevYearTotal = prevYearData.reduce(
      (sum, item) => sum + (item.total || 0),
      0
    );
    const yearOverYearGrowth = prevYearTotal
      ? ((totalAnnualRevenue - prevYearTotal) / prevYearTotal) * 100
      : 0;

    const maxMonth = yearData.reduce(
      (max, item) => (item.total > max.total ? item : max),
      { name: "", total: 0 }
    );
    const minMonth = yearData.reduce(
      (min, item) => (item.total < min.total && item.total > 0 ? item : min),
      { name: "", total: Infinity }
    );

    const averageMonthlyRevenue = totalAnnualRevenue / 12;

    return {
      yearOverYearGrowth,
      maxMonth,
      minMonth,
      averageMonthlyRevenue,
    };
  }, [data, selectedYear, totalAnnualRevenue, yearData]);

  const combinedData = useMemo(() => {
    return yearData.map((item, index) => ({
      ...item,
      average: stats.averageMonthlyRevenue,
    }));
  }, [yearData, stats.averageMonthlyRevenue]);

  return (
    <Card className="w-full overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 dark:bg-none">
      <CardHeader className="bg-gradient-to-b from-purple-400 to-purple-500 text-white p-6">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">
            Resumen de Ingresos Mensuales
          </CardTitle>
          <Select
            value={selectedYear.toString()}
            onValueChange={(value) => setSelectedYear(Number(value))}
          >
            <SelectTrigger className="w-[120px] bg-white text-purple-600">
              <SelectValue placeholder="Selecciona un año" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-center mt-2 text-xl font-semibold">
          Total Anual: {formatter.format(totalAnnualRevenue)} CLP
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-sm font-medium">
                Crecimiento Anual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center">
                {stats.yearOverYearGrowth >= 0 ? (
                  <ArrowUpIcon className="text-green-500 mr-2" />
                ) : (
                  <ArrowDownIcon className="text-red-500 mr-2" />
                )}
                {stats.yearOverYearGrowth.toFixed(2)}%
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-sm font-medium">
                Mes Más Alto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.maxMonth.name}</div>
              <div className="text-sm text-gray-500">
                {formatter.format(stats.maxMonth.total)} CLP
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-sm font-medium">
                Mes Más Bajo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.minMonth.name}</div>
              <div className="text-sm text-gray-500">
                {formatter.format(stats.minMonth.total)} CLP
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-sm font-medium">
                Promedio Mensual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatter.format(stats.averageMonthlyRevenue)} CLP
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="bar" className="w-full">
          <TabsList>
            <TabsTrigger value="bar">Gráfico de Barras</TabsTrigger>
            <TabsTrigger value="line">Gráfico de Líneas</TabsTrigger>
          </TabsList>
          <TabsContent value="bar">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={yearData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  stroke="gray"
                  fontSize={14}
                  tickLine={false}
                  axisLine={{ stroke: "#333" }}
                />
                <YAxis
                  stroke="gray"
                  fontSize={14}
                  tickLine={false}
                  axisLine={{ stroke: "#333" }}
                  tickFormatter={(value) => `${formatter.format(value)}`}
                />
                <Tooltip
                  cursor={{ fill: "rgba(255, 255, 255, 0.3)" }}
                  contentStyle={{
                    background: "rgba(255, 255, 255, 0.9)",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    color: "black",
                  }}
                  formatter={(value) => [
                    `${formatter.format(value as number)} CLP`,
                    "Ingresos",
                  ]}
                />
                <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                  {yearData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="line">
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart
                data={combinedData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  stroke="gray"
                  fontSize={14}
                  tickLine={false}
                  axisLine={{ stroke: "#333" }}
                />
                <YAxis
                  stroke="gray"
                  fontSize={14}
                  tickLine={false}
                  axisLine={{ stroke: "#333" }}
                  tickFormatter={(value) => `${formatter.format(value)}`}
                />
                <Tooltip
                  cursor={{ fill: "rgba(255, 255, 255, 0.3)" }}
                  contentStyle={{
                    background: "rgba(255, 255, 255, 0.9)",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    color: "black",
                  }}
                  formatter={(value, name) => [
                    `${formatter.format(value as number)} CLP`,
                    name === "total"
                      ? "Ingresos Mensuales"
                      : "Ingresos Mensuales",
                  ]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Ingresos Mensuales"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>

        {totalAnnualRevenue === 0 && (
          <div className="text-center text-gray-500 mt-4">
            No hay datos disponibles para el año {selectedYear}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
