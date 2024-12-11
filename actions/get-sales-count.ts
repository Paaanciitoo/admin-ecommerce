import prismadb from "@/lib/prismadb";

export const getSalesCount = async (storeId: string): Promise<{ total: number, dailyChange: number }> => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const todaySales = await prismadb.order.count({
    where: {
      storeId,
      isPaid: true,
      createAt: {
        gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      },
    },
  });

  const yesterdaySales = await prismadb.order.count({
    where: {
      storeId,
      isPaid: true,
      createAt: {
        gte: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()),
        lt: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      },
    },
  });

  const totalSales = await prismadb.order.count({
    where: {
      storeId,
      isPaid: true,
    },
  });

  return { 
    total: totalSales, 
    dailyChange: todaySales - yesterdaySales 
  };
};

