import prismadb from "@/lib/prismadb";

export const getTotalRevenue = async (storeId: string): Promise<{ total: number, percentageChange: number }> => {
  const currentDate = new Date();
  const lastMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);

  const calculateRevenue = async (startDate: Date, endDate: Date) => {
    const paidOrders = await prismadb.order.findMany({
      where: {
        storeId,
        isPaid: true,
        createAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      include: {
        orderItems: {
          include: {
            productos: true,
          },
        },
      },
    });

    return paidOrders.reduce((total, order) => {
      const orderTotal = order.orderItems.reduce((orderSum, item) => {
        return orderSum + item.productos.price.toNumber();
      }, 0);
      return total + orderTotal;
    }, 0);
  };

  const currentMonthRevenue = await calculateRevenue(lastMonthDate, currentDate);
  const lastMonthRevenue = await calculateRevenue(new Date(lastMonthDate.getFullYear(), lastMonthDate.getMonth() - 1, 1), lastMonthDate);

  const percentageChange = lastMonthRevenue !== 0
    ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
    : 0;

  return { 
    total: currentMonthRevenue, 
    percentageChange 
  };
};

