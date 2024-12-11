import prismadb from "@/lib/prismadb";
import { ColoresClient } from "./components/client";
import { ColoresColumn } from "./components/columns";

import { format } from "date-fns";

const ColoresPage = async ({
  params,
}: {
  params: {
    storeId: string;
  };
}) => {
  const colores = await prismadb.color.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createAt: "desc",
    },
  });

  const formatedColores: ColoresColumn[] = colores.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(new Date(item.createAt), "dd/MM/yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColoresClient data={formatedColores} />
      </div>
    </div>
  );
};

export default ColoresPage;
