"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { CategoryColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { ApiList } from "@/components/ui/api-list";

interface CategoryClientProps {
  data: CategoryColumn[];
}

export const CategoryClient: React.FC<CategoryClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  const [isLoading, setIsLoading] = useState(false);

  const handleAddCategory = () => {
    setIsLoading(true);
    router.push(`/${params.storeId}/categorias/new`);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Categorías (${data.length})`}
          description="Maneja las categorías de tu tienda aquí"
        />
        <Button
          onClick={handleAddCategory}
          disabled={isLoading}
          style={{ backgroundColor: "#2563eb", color: "white" }}
          className="rounded-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cargando...
            </>
          ) : (
            <>
              <Plus size={16} className="mr-2 h-4 w-4" />
              Añadir categoría
            </>
          )}
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading
        title="API"
        description="Llama a la API para obtener tu categoría"
      />
      <Separator />
      <ApiList entityName="categorias" entityIdName="categoriasId" />
    </>
  );
};
