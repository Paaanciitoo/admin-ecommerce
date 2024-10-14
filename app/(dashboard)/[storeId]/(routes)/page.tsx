import prismadb from "@/lib/prismadb";

// Se importa la interfaz DashboardPageProps desde el archivo types.ts. Esta interfaz define la estructura de los parámetros que recibe la página DashboardPage.
interface DashboardPageProps {
  params: { storeId: string };
}

// Se crea la página DashboardPage que recibe un parámetro storeId de tipo string y retorna un JSX.Element. Esta página se encarga de hacer una consulta a la base de datos
// para obtener la información de la tienda con el id proporcionado y mostrar el nombre de la tienda en la página.
const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  const store = await prismadb.store.findFirst({
    where: { id: params.storeId },
  });

  return (
    <div className="p-5 flex items-center w-full">
      <h1>
        <strong>El nombre de la tienda es:</strong> {store?.name}
      </h1>
    </div>
  );
};

export default DashboardPage;
