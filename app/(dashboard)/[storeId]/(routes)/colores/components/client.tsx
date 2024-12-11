"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ColoresColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { ApiList } from "@/components/ui/api-list";

interface ColoresClientProps {
  data: ColoresColumn[];
}

export const ColoresClient: React.FC<ColoresClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  const [isLoading, setIsLoading] = useState(false);

  const handleAddBillboard = () => {
    setIsLoading(true);
    router.push(`/${params.storeId}/colores/new`);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Colores de los accesorios (${data.length})`}
          description="Maneja el color de los accesorios aquí"
        />
        <Button
          onClick={handleAddBillboard}
          disabled={isLoading}
          style={{ backgroundColor: "#9333ea", color: "white" }}
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
              Añadir color del accesorio
            </>
          )}
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading
        title="API"
        description="Llama a la API para obtener los colores de los accesorios"
      />
      <Separator />
      <ApiList entityName="colores" entityIdName="coloresId" />
    </>
  );
};
