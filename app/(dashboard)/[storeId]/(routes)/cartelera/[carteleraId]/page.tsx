import prismadb from "@/lib/prismadb";
import { BillboardForms } from "./components/cartelera-form";

const CarteleraPage = async ({
  params,
}: {
  params: { carteleraId: string };
}) => {
  const cartelera = await prismadb.billboard.findUnique({
    where: {
      id: params.carteleraId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForms initialData={cartelera} />
      </div>
    </div>
  );
};

export default CarteleraPage;
