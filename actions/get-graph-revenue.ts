import prismadb from "@/lib/prismadb";

export const getGraphRevenue = async (storeId: string) => {
  const paidOrders = await prismadb.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          productos: true,
        },
      },
    },
  });

  const monthlyRevenue: { [key: number]: { [key: number]: number } } = {};

  for (const order of paidOrders) {
    const year = order.createAt.getFullYear();
    const month = order.createAt.getMonth();
    
    if (!monthlyRevenue[year]) {
      monthlyRevenue[year] = {};
    }

    if (!monthlyRevenue[year][month]) {
      monthlyRevenue[year][month] = 0;
    }

    let revenueForOrder = 0;
    for (const item of order.orderItems) {
      revenueForOrder += item.productos.price.toNumber();
    }

    monthlyRevenue[year][month] += revenueForOrder;
  }

  const graphData: { [key: number]: Array<{ name: string; total: number }> } = {};

  for (const year in monthlyRevenue) {
    graphData[parseInt(year)] = Array(12).fill(null).map((_, month) => ({
      name: new Date(parseInt(year), month).toLocaleString('es-CL', { month: 'long' }),
      total: monthlyRevenue[parseInt(year)][month] || 0,
    }));
  }

  return graphData;
};

