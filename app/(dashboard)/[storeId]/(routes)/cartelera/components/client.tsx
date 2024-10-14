"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { BillboardColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface BillboardClientProps {
  data: BillboardColumn[];
}

export const BillboardClient: React.FC<BillboardClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  const [isLoading, setIsLoading] = useState(false);

  const handleAddBillboard = () => {
    setIsLoading(true);
    router.push(`/${params.storeId}/cartelera/new`);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Cartelera (${data.length})`}
          description="Maneja la cartelera de tu tienda aquí"
        />
        <Button onClick={handleAddBillboard} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cargando...
            </>
          ) : (
            <>
              <Plus size={16} className="mr-2 h-4 w-4" />
              Añadir cartelera
            </>
          )}
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="label" columns={columns} data={data} />
    </>
  );
};
