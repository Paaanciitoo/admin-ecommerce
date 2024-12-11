import prismadb from "@/lib/prismadb";
import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";

import { format } from "date-fns";
import { formatter } from "@/lib/utils";

const ProductsPage = async ({
  params,
}: {
  params: {
    storeId: string;
  };
}) => {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      categorias: true,
      pesos: true,
      colores: true,
    },
    orderBy: {
      createAt: "desc",
    },
  });

  const formatedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price.toNumber()),
    categorias: item.categorias.name,
    pesos: item.pesos.name,
    colores: item.colores.value,
    createdAt: format(new Date(item.createAt), "dd/MM/yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formatedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
