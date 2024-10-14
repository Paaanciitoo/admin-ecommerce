"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="¿Estás seguro que deseas eliminar la tienda"
      description="Al eliminar la esta tienda, ya no podrás acceder a esta tienda desde es tu navegador."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-4 space-x-2 flex items-center justify-end w-full">
        <Button disabled={loading} variant="default" onClick={onClose}>
          Cancelar
        </Button>
        <Button disabled={loading} variant="destructive" onClick={onConfirm}>
          Eliminar
        </Button>
      </div>
    </Modal>
  );
};
