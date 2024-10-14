// Se importa prismadb para poder hacer la consulta a la base de datos.
import prismadb from "@/lib/prismadb";

// Se importan las funciones auth y redirect de Clerk para poder verificar si el usuario está autenticado y redirigirlo a la página de inicio de sesión.
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Se exporta la función SetupLayout que recibe un children de tipo React.ReactNode y retorna un JSX.Element. Esta función se encarga de verificar si el usuario está autenticado y
// si ya tiene una tienda creada. Si el usuario no está autenticado, se redirige a la página de inicio de sesión.
// Si el usuario ya tiene una tienda creada, se redirige a la página de la tienda. Si el usuario no tiene una tienda creada, se renderiza el contenido de la página.
export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Se obtiene el userId del usuario autenticado.
  const { userId } = auth();

  // Se verifica si el usuario está autenticado, si no lo está, se redirige a la página de inicio de sesión.
  if (!userId) {
    redirect("/sign-in");
  }

  // Se hace una consulta a la base de datos para verificar si el usuario ya tiene una tienda creada.
  const store = await prismadb.store.findFirst({
    where: { userId },
  });

  // Si el usuario ya tiene una tienda creada, se redirige a la página de la tienda.
  if (store) {
    redirect(`/${store.id}`);
  }

  // Si el usuario no tiene una tienda creada, se renderiza el contenido de la página.
  return <>{children}</>;
}
