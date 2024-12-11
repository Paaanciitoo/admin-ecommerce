import prismadb from "@/lib/prismadb";
import { CategoryClient } from "./components/client";
import { CategoryColumn } from "./components/columns";

import { format } from "date-fns";

const CategoriesPage = async ({
  params,
}: {
  params: {
    storeId: string;
  };
}) => {
  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createAt: "desc",
    },
  });

  const formatedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard.label,
    createdAt: format(new Date(item.createAt), "dd/MM/yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formatedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
