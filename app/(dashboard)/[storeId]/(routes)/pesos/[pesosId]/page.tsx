import prismadb from "@/lib/prismadb";
import { PesoForms } from "./components/peso-form";

const PesosPage = async ({ params }: { params: { pesosId: string } }) => {
  const cartelera = await prismadb.peso.findUnique({
    where: {
      id: params.pesosId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PesoForms initialData={cartelera} />
      </div>
    </div>
  );
};

export default PesosPage;
