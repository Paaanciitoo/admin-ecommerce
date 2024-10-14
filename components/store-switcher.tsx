"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useStoreModal } from "@/hooks/use-store-modal";
import { Store } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Check,
  ChevronsUpDown,
  PlusCircle,
  Store as StoreIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

// Esto es un componente de React que se utiliza para renderizar el conmutador de tienda. El componente StoreSwitcher se utiliza en el componente Navbar
// para permitir a los usuarios cambiar entre diferentes tiendas. El componente StoreSwitcher se compone de un PopoverTrigger que se utiliza para mostrar
// un menú desplegable con una lista de tiendas disponibles. El componente StoreSwitcher no acepta ninguna propiedad y no devuelve ningún valor.
type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

// La interfaz StoreSwitcherProps es una interfaz de TypeScript que define las propiedades aceptadas por el componente StoreSwitcher. La interfaz StoreSwitcherProps
// extiende la interfaz PopoverTriggerProps y agrega una propiedad items que es un arreglo de objetos de tipo Store. La interfaz StoreSwitcherProps se utiliza para
// definir las propiedades que se pueden pasar al componente StoreSwitcher.
interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Store[];
}

// La función StoreSwitcher es un componente de React que se utiliza para renderizar el conmutador de tienda. El componente StoreSwitcher acepta las propiedades
// className y items. La propiedad className se utiliza para agregar clases de CSS personalizadas al componente. La propiedad items es un arreglo de objetos de
// tipo Store que contiene la lista de tiendas disponibles. El componente StoreSwitcher devuelve un elemento div que contiene un mensaje de texto que indica
// al usuario que seleccione una tienda.
export default function StoreSwitcher({
  className,
  items = [],
}: StoreSwitcherProps) {
  const storeModal = useStoreModal();
  const params = useParams();
  const router = useRouter();

  // La variable formatedItems es un arreglo de objetos que contiene las tiendas formateadas. Cada objeto tiene una propiedad label que contiene el nombre
  // de la tienda y una propiedad value que contiene el ID de la tienda. La variable formatedItems se utiliza para mostrar la lista de tiendas en el menú desplegable.
  const formatedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  // La variable currentStore contiene la tienda actual seleccionada por el usuario. La variable currentStore se obtiene buscando la tienda actual en el arreglo
  // de tiendas formateadas.
  const currentStore = formatedItems.find(
    (item) => item.value === params.storeId
  );

  const [open, setOpen] = useState(false);

  const onStoreSelect = (store: { value: string; label: string }) => {
    setOpen(false);
    router.push(`/${store.value}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Selecciona una tienda"
          className={cn("w-[320px] justify-between", className)}
        >
          <StoreIcon className="mr-2 h-4 w-4" />
          {currentStore?.label}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Buscar una tienda" />
            <CommandEmpty>No se encontraron tiendas.</CommandEmpty>
            <CommandGroup heading="Tiendas">
              {formatedItems.map((store) => (
                <CommandItem
                  key={store.value}
                  onSelect={() => onStoreSelect(store)}
                  className="text-sm"
                >
                  <StoreIcon className="mr-2 h-4 w-4" />
                  {store.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentStore?.value === store.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  storeModal.onOpen();
                }}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Crear una tienda
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
