import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { formatter } from "@/lib/utils";
import { CreditCard, DollarSign, Package2 } from 'lucide-react';

import { getTotalRevenue } from "@/actions/get-total-revenue";
import { getSalesCount } from "@/actions/get-sales-count";
import { getStockCount } from "@/actions/get-stock-count";
import { getGraphRevenue } from "@/actions/get-graph-revenue";
import { Overview } from "@/components/overview";

interface DashboardPageProps {
  params: { storeId: string };
}

const DashboardPage = async ({ params }: DashboardPageProps) => {
  const totalRevenue = await getTotalRevenue(params.storeId);
  const salesCount = await getSalesCount(params.storeId);
  const stockCount = await getStockCount(params.storeId);
  const graphRevenue = await getGraphRevenue(params.storeId);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-6 p-8 pt-6">
        <Heading
          title="Panel de inicio"
          description="Observa el rendimiento de tu tienda aquí"
        />
        <Separator className="my-6" />
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 bg-gradient-to-br from-green-400 to-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Ganancias totales de la tienda del año {new Date().getFullYear()}
              </CardTitle>
              <DollarSign className="w-6 h-6 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {formatter.format(totalRevenue.total)} CLP
              </div>
              <p className="text-xs text-green-100 mt-1">
                {totalRevenue.percentageChange >= 0 ? "+" : ""}
                {totalRevenue.percentageChange.toFixed(1)}% desde el mes pasado
              </p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 bg-gradient-to-br from-yellow-400 to-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Ventas totales de la tienda
              </CardTitle>
              <CreditCard className="w-6 h-6 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{salesCount.total}</div>
              <p className="text-xs text-yellow-100 mt-1">
                {salesCount.dailyChange >= 0 ? "+" : ""}
                {salesCount.dailyChange} desde ayer
              </p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 bg-gradient-to-br from-purple-400 to-indigo-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Productos disponibles en la tienda
              </CardTitle>
              <Package2 className="w-6 h-6 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stockCount.total}</div>
              <p className="text-xs text-purple-100 mt-1">
                +{stockCount.newProducts} nuevos productos esta semana
              </p>
            </CardContent>
          </Card>
        </div>
        <Card className="col-span-4 border-transparent border-white">
          <CardContent className="pl-2 p-2">
            <Overview data={graphRevenue} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;

