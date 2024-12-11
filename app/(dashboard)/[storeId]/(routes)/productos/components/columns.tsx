"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type ProductColumn = {
  id: string;
  name: string;
  price: string;
  categorias: string;
  pesos: string;
  colores: string;
  isFeatured: boolean;
  isArchived: boolean;
  createdAt: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "isArchived",
    header: "Archivado",
  },
  {
    accessorKey: "isFeatured",
    header: "Destacado",
  },
  {
    accessorKey: "price",
    header: "Precio",
  },
  {
    accessorKey: "categorias",
    header: "Categoría",
  },
  {
    accessorKey: "pesos",
    header: "Peso",
  },
  {
    accessorKey: "colores",
    header: "Color",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.colores}
        <div
          className="h-6 w-6 rounded-full border"
          style={{ backgroundColor: row.original.colores }}
        />
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Fecha de creación",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
