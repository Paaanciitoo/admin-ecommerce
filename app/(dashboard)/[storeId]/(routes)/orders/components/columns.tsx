"use client";

import { ColumnDef } from "@tanstack/react-table";

export type OrderColumn = {
  id: string;
  phone: string;
  address: string;
  isPaid: boolean;
  totalPrice: string;
  productos: string;
  createdAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "productos",
    header: "Productos",
  },
  {
    accessorKey: "phone",
    header: "Teléfono",
  },
  {
    accessorKey: "address",
    header: "Dirección",
  },
  {
    accessorKey: "totalPrice",
    header: "Precio total",
  },
  {
    accessorKey: "isPaid",
    header: "Pagado/No pagado",
  },
];
