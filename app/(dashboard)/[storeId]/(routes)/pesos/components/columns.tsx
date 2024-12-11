"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type PesoColumn = {
  id: string;
  name: string;
  value: string;
  createdAt: string;
};

export const columns: ColumnDef<PesoColumn>[] = [
  {
    accessorKey: "name",
    header: "Peso",
  },
  {
    accessorKey: "value",
    header: "Valor por KG",
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
