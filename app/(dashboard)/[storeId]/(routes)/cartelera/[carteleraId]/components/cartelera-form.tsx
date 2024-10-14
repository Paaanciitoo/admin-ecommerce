"use client";

import { Billboard } from "@prisma/client";
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
import ImageUpload from "@/components/ui/image-upload";

interface BillboardFormsProps {
  initialData: Billboard | null;
}

const formSchema = z.object({
  label: z
    .string()
    .min(
      1,
      "El nombre no puede estar vacío, debe contener al menos un carácter"
    )
    .regex(
      /[a-zA-Z0-9]/,
      "El nombre debe contener al menos una letra o número"
    ),
  imageUrl: z.string().min(1),
});

type BillboardFormValues = z.infer<typeof formSchema>;

export const BillboardForms: React.FC<BillboardFormsProps> = ({
  initialData,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Editar cartelera" : "Crea una cartelera";
  const description = initialData
    ? "Editar la cartelera."
    : "En este apartado tendrás la posibilidad de crear una cartelera para tu tienda.";
  const toastMessage = initialData
    ? "Cartelera actualizada."
    : "Cartelera creada.";
  const action = initialData ? "Guardar cambios" : "Crear cartelera";

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (data: BillboardFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/cartelera/${params.carteleraId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/cartelera`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/cartelera`);
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
      await axios.delete(
        `/api/${params.storeId}/cartelera/${params.carteleraId}`
      );
      router.refresh();
      router.push(`/${params.storeId}/cartelera`);
      toast.success("Cartelera eliminada");
    } catch (error) {
      toast.error(
        "Asegúrate de haber eliminado todas las categorías que esta cartelera contiene antes de eliminarla."
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
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imagen de fondo</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={loading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Etiqueta</FormLabel>
                  <FormControl>
                    <Input
                      className="w-[300px]"
                      disabled={loading}
                      placeholder="Escribe el nombre de la cartelera aquí"
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
