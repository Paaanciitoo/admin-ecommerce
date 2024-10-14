"use client";

import { Store } from "@prisma/client";
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
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";

interface SettingsFormsProps {
  initialData: Store;
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
});

// En este caso, el tipo de SettingsFormValues es inferido por z.infer<typeof formSchema> que es un tipo de Zod que representa el tipo de datos que se espera en el formulario.

type SettingsFormValues = z.infer<typeof formSchema>;

export const SettingsForms: React.FC<SettingsFormsProps> = ({
  initialData,
}) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setLoading(true);
      await axios.patch(`/api/stores/${params.storeId}`, data);
      router.refresh();
      toast.success("Nombre actualizado 🎊");
    } catch (error) {
      toast.error("Algo salió mal");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/stores/${params.storeId}`);
      router.refresh();
      router.push("/");
      toast.success("Tienda eliminada");
    } catch (error) {
      toast.error(
        "Asegúrate de que la tienda no tenga productos antes de eliminarla 🛑."
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  // Aquí se renderiza el formulario de ajustes de la tienda, el cual contiene un campo para el nombre de la tienda y un botón para guardar los cambios.
  // Además, se incluye un botón para eliminar la tienda, el cual muestra un modal de confirmación al hacer clic en él.
  // El formulario se renderiza utilizando el componente Form de la librería de componentes de la aplicación, el cual se encarga de
  // manejar el estado del formulario y de mostrar los mensajes de error en caso de que existan.
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading
          title="Ajustes de la tienda"
          description="Manje la configuración de la tienda seleccionada"
        />
        <Button
          disabled={loading}
          className="rounded-full size-10"
          variant="destructive"
          size="sm"
          onClick={() => setOpen(true)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la tienda: </FormLabel>
                  <FormControl>
                    <Input
                      className="w-[300px]"
                      disabled={loading}
                      placeholder="Escribe el nombre de tu tienda aquí"
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
            Guardar cambios
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      />
    </>
  );
};
