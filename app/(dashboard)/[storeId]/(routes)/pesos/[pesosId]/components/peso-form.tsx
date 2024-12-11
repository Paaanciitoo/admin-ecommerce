"use client";

import { Peso } from "@prisma/client";
import { Save, Trash } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AlertModal } from "@/components/modals/alert-modal";

interface PesoFormsProps {
  initialData: Peso | null;
}

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
  value: z.string().min(1),
});

type PesoFormValues = z.infer<typeof formSchema>;

export const PesoForms: React.FC<PesoFormsProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData
    ? "Editar peso del producto"
    : "Añade el peso del producto";
  const description = initialData
    ? "Editar el peso del producto."
    : "En este apartado tendrás la posibilidad de crear un peso para cada uno de los productos que se deseen añadir.";
  const toastMessage = initialData
    ? "Peso actualizado."
    : "Peso del producto creado.";
  const action = initialData ? "Guardar cambios" : "Crear peso del producto";

  const form = useForm<PesoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });

  const onSubmit = async (data: PesoFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/pesos/${params.pesosId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/pesos`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/pesos`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Algo salió mal");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/pesos/${params.pesosId}`);
      router.refresh();
      router.push(`/${params.storeId}/pesos`);
      toast.success("Peso eliminado correctamente.");
    } catch (error) {
      toast.error(
        "Asegúrate de haber eliminado todas los productos que contienen este peso antes de eliminarla."
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
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            className="rounded-full"
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Peso</FormLabel>
                  <FormControl>
                    <Input
                      className="w-[300px]"
                      disabled={loading}
                      placeholder="Digita el peso que deseas añadir aquí"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor por KG</FormLabel>
                  <FormControl>
                    <Input
                      className="w-[300px]"
                      disabled={loading}
                      placeholder="Digita el valor por KG aquí"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            <Save className="mr-2" />
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
