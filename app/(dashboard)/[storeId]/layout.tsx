import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// El cliente prisma se importa desde el archivo prismadb.ts en la carpeta lib de la raíz del proyecto y se exporta como un módulo.
import prismadb from "@/lib/prismadb";

// El componente Navbar se importa desde el archivo navbar.tsx en la carpeta components de la raíz del proyecto. 
//Este componente se utiliza para renderizar la barra de navegación de la aplicación.
import Navbar from "@/components/navbar";

/**
 *
 * La función DashboardLayout es un componente de diseño que se utiliza para envolver las páginas de la aplicación de la tienda.
 * Este componente se encarga de verificar si el usuario está autenticado y de obtener
 * la información de la tienda a partir del ID de la tienda que se pasa como parámetro.
 * La información de la tienda se obtiene de la base de datos utilizando el cliente prisma. Si el usuario no está autenticado, se redirige a la página de inicio de sesión.
 * Si la tienda no existe, se muestra un mensaje de error. Si la tienda existe, se renderiza el contenido de la página de la aplicación de la tienda.
 */
export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await prismadb.store.findFirst({
    where: { id: params.storeId, userId },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
