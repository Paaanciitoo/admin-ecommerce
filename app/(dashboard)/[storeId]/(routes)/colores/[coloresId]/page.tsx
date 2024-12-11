import prismadb from "@/lib/prismadb";
import { ColoresForms } from "./components/color-form";

const ColoresPage = async ({ params }: { params: { coloresId: string } }) => {
  const colores = await prismadb.color.findUnique({
    where: {
      id: params.coloresId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColoresForms initialData={colores} />
      </div>
    </div>
  );
};

export default ColoresPage;
