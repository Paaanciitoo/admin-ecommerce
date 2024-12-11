import prismadb from "@/lib/prismadb";
import { PesosClient } from "./components/client";
import { PesoColumn } from "./components/columns";

import { format } from "date-fns";

const PesosPage = async ({
  params,
}: {
  params: {
    storeId: string;
  };
}) => {
  const pesos = await prismadb.peso.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createAt: "desc",
    },
  });

  const formatedPesos: PesoColumn[] = pesos.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(new Date(item.createAt), "dd/MM/yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PesosClient data={formatedPesos} />
      </div>
    </div>
  );
};

export default PesosPage;
