"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { PesoColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { ApiList } from "@/components/ui/api-list";

interface PesosClientProps {
  data: PesoColumn[];
}

export const PesosClient: React.FC<PesosClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  const [isLoading, setIsLoading] = useState(false);

  const handleAddBillboard = () => {
    setIsLoading(true);
    router.push(`/${params.storeId}/pesos/new`);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Peso del producto (${data.length})`}
          description="Maneja los pesos de los productos aquí"
        />
        <Button
          onClick={handleAddBillboard}
          disabled={isLoading}
          style={{ backgroundColor: "#dc2626", color: "white" }}
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
              Añadir peso del producto
            </>
          )}
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading
        title="API"
        description="Llama a la API para obtener los pesos de los productos"
      />
      <Separator />
      <ApiList entityName="pesos" entityIdName="pesosId" />
    </>
  );
};
