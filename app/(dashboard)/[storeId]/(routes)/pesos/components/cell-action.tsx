"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PesoColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Loader, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { AlertModal } from "@/components/modals/alert-modal";

interface CellActionProps {
  data: PesoColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Copiado al portapapeles.");
  };

  const onUpdate = async () => {
    setIsUpdating(true);
    setIsMenuOpen(false);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push(`/${params.storeId}/pesos/${data.id}`);
    } catch (error) {
      console.error("Error al navegar:", error);
      toast.error("Error al actualizar. Intente de nuevo.");
    } finally {
      setIsUpdating(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/pesos/${data.id}`);
      router.refresh();
      toast.success("Peso eliminado correctamente.");
    } catch (error) {
      toast.error(
        "Asegúrate de haber eliminado todos los productos que contienen este peso antes de eliminarla."
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="relative">
        {isUpdating && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
            <Loader className="h-4 w-4 mr-2 animate-spin" />
            <span className="text-xs mt-1 text-primary">Cargando</span>
          </div>
        )}
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              className="h-8 w-8 p-0"
              variant="ghost"
              disabled={isUpdating}
            >
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[200px]" align="end">
            <DropdownMenuLabel className="font-bold tracking-tight flex rounded-md items-center justify-center mb-1">
              -- Acciones --
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onCopy(data.id)}>
              <Copy className="mr-2 h-4 w-4" />
              Copiar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onUpdate} disabled={isUpdating}>
              <Edit className="mr-2 h-4 w-4" />
              {isUpdating ? "Actualizando..." : "Actualizar"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpen(true)}>
              <X className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
