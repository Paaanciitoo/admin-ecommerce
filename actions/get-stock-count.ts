import prismadb from "@/lib/prismadb";

export const getStockCount = async (storeId: string): Promise<{ total: number, newProducts: number }> => {
  const totalStock = await prismadb.product.count({
    where: {
      storeId,
      isArchived: false,
    },
  });

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const newProducts = await prismadb.product.count({
    where: {
      storeId,
      isArchived: false,
      createAt: {
        gte: oneWeekAgo,
      },
    },
  });

  return { 
    total: totalStock, 
    newProducts 
  };
};

