"use client";

import { Heading } from "@/components/ui/heading";
import { OrderColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface OrderClientProps {
  data: OrderColumn[];
}

export const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
  return (
    <>
      <Heading
        title={`Pedidos (${data.length})`}
        description="Maneja los pedidos de tu tienda aquí"
      />
      <DataTable searchKey="productos" columns={columns} data={data} />
    </>
  );
};
