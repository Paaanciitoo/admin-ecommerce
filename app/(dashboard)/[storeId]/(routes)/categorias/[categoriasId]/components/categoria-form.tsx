"use client";

import { Billboard, Category } from "@prisma/client";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryFormsProps {
  initialData: Category | null;
  billboards: Billboard[];
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
  carteleraId: z.string().min(1),
});

type CategoryFormValues = z.infer<typeof formSchema>;

export const CategoryForm: React.FC<CategoryFormsProps> = ({
  initialData,
  billboards,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Editar categoría" : "Crea una categoría";
  const description = initialData
    ? "Editar la categoría."
    : "En este apartado tendrás la posibilidad de crear una categoría para tu tienda.";
  const toastMessage = initialData
    ? "Categoría actualizada."
    : "Categoría creada.";
  const action = initialData ? "Guardar cambios" : "Crear categoría";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      carteleraId: "",
    },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/categorias/${params.categoriasId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/categorias`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/categorias`);
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
        `/api/${params.storeId}/categorias/${params.categoriasId}`
      );
      router.refresh();
      router.push(`/${params.storeId}/categorias`);
      toast.success("Categoría eliminada");
    } catch (error) {
      toast.error(
        "Asegúrate de haber eliminado todos los productos que contiene esta categoría contiene antes de eliminarla."
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
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      className="w-[380px]"
                      disabled={loading}
                      placeholder="Escribe el nombre de la categoría aquí"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="carteleraId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cartelera</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[380px]">
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Selecciona una cartelera"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map((billboard) => (
                        <SelectItem key={billboard.id} value={billboard.id}>
                          {billboard.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
