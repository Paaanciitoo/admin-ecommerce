import prismadb from "@/lib/prismadb";
import { ProductsForms } from "./components/productos-form";

const ProductPage = async ({
  params,
}: {
  params: { productosId: string, storeId: string };
}) => {
  const productos = await prismadb.product.findUnique({
    where: {
      id: params.productosId,
    },
    include: {
      images: true,
    },
  });

  const categorias = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
  })

  const pesos = await prismadb.peso.findMany({
    where: {
      storeId: params.storeId,
    },
  })

  const colores = await prismadb.color.findMany({
    where: {
      storeId: params.storeId,
    },
  })

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductsForms
        categorias={categorias}
        pesos={pesos}
        colores={colores} 
        initialData={productos} />
      </div>
    </div>
  );
};

export default ProductPage;
