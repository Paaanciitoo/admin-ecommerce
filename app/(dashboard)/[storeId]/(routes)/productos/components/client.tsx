"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ProductColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { ApiList } from "@/components/ui/api-list";

interface ProductClientProps {
  data: ProductColumn[];
}

export const ProductClient: React.FC<ProductClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  const [isLoading, setIsLoading] = useState(false);

  const handleAddBillboard = () => {
    setIsLoading(true);
    router.push(`/${params.storeId}/productos/new`);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Productos (${data.length})`}
          description="Maneja los productos de tu tienda aquí"
        />
        <Button
          onClick={handleAddBillboard}
          disabled={isLoading}
          className="rounded-full bg-lime-500 hover:bg-lime-600 text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cargando...
            </>
          ) : (
            <>
              <Plus size={16} className="mr-2 h-4 w-4" />
              Añadir un producto
            </>
          )}
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading
        title="API"
        description="Llama a la API para obtener los productos de tu tienda"
      />
      <Separator />
      <ApiList entityName="productos" entityIdName="productosId" />
    </>
  );
};
