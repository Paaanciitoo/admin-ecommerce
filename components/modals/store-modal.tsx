"use client";

import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import toast from "react-hot-toast";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const formSchema = z.object({
  name: z
    .string()
    .min(
      1,
      "El nombre no puede estar vacío, debe contener al menos un carácter"
    )
    .regex(
      /[a-zA-Z0-9]/,
      "El nombre debe contener al menos una letra o número"
    ),
});

export const StoreModal = () => {
  const storeModal = useStoreModal();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      const response = await axios.post("/api/stores", values);

      // Window.location redirigirá a la página de la tienda creada.

      window.location.assign(`/${response.data.id}`);
    } catch (error) {
      toast.error("Ocurrió un error al crear la tienda, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Crear una tienda"
      description="En este apartado podrás crear una tienda para gestionar tus productos y tus ventas."
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <b className="text-lg">Nombre de tu tienda</b>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Escribe el nombre de tu tienda aquí"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-4">
                <i className="text-dark">¡Recuerda!</i>
                <p className="text-sm text-gray-600 pt-2">
                  <b className="text-red-600">*</b> El nombre de tu tienda será
                  visible para tus clientes y este mismo debe ser único.
                </p>
              </div>
              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button
                  disabled={loading}
                  variant="destructive"
                  onClick={storeModal.onClose}
                >
                  Cancelar
                </Button>
                <Button disabled={loading} type="submit">
                  Continuar
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
