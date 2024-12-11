"use client";

import { Color } from "@prisma/client";
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

interface ColoresFormsProps {
  initialData: Color | null;
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
  value: z.string().min(4).regex(/^#/, {
    message: "El valor debe ser un color hexadecimal",
  }),
});

type ColoresFormValues = z.infer<typeof formSchema>;

export const ColoresForms: React.FC<ColoresFormsProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData
    ? "Editar el color del acccesorio"
    : "Añade el color del accesorio";
  const description = initialData
    ? "Editar el color del accesorio."
    : "En este apartado tendrás la posibilidad de crear un color para cada uno de los accesorios que se deseen añadir.";
  const toastMessage = initialData
    ? "Color actualizado."
    : "Color del accesorio creado.";
  const action = initialData
    ? "Guardar cambios"
    : "Crear un color del accesorio";

  const form = useForm<ColoresFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });

  const onSubmit = async (data: ColoresFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/colores/${params.coloresId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/colores`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/colores`);
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
      await axios.delete(`/api/${params.storeId}/colores/${params.coloresId}`);
      router.refresh();
      router.push(`/${params.storeId}/colores`);
      toast.success("Color eliminado correctamente.");
    } catch (error) {
      toast.error(
        "Asegúrate de haber eliminado todas los accesorios que contienen este color antes de eliminarlo."
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
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Input
                      className="w-[300px]"
                      disabled={loading}
                      placeholder="Digita el color que deseas añadir aquí"
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
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input
                        className="w-[300px]"
                        disabled={loading}
                        placeholder="Valor hexadecimal del color"
                        {...field}
                      />
                      <div
                        className="border p-4 rounded-full"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
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
