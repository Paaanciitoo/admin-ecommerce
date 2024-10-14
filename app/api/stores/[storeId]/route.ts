import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Desde la API, se puede obtener una tienda utilizando el método GET. Para ello, se debe enviar una solicitud GET a la ruta /api/stores/[storeId].
// Al obtener una tienda, se devuelven los datos de la tienda, incluyendo su nombre y el id del usuario propietario de la tienda. Esto funciona de manera similar
// a la obtención de una tienda desde el dashboard, pero en este caso se realiza desde la API.

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name } = body;

    if (!userId) {
      return new NextResponse("No estás autorizado.", { status: 401 });
    }

    if (!name) {
      return new NextResponse("El nombre no puede estar vacío.", {
        status: 400,
      });
    }

    if (!params.storeId) {
      return new NextResponse("No se ha encontrado la tienda.", {
        status: 400,
      });
    }

    const store = await prismadb.store.updateMany({
      where: {
        id: params.storeId,
        userId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("[STORE_PATCH]", error);
    return new NextResponse("Al parecer ha ocurrido un error", { status: 500 });
  }
}

// Desde la API, se puede eliminar una tienda utilizando el método DELETE. Para ello, se debe enviar una solicitud DELETE a la ruta /api/stores/[storeId].
// Al eliminar una tienda, se eliminan todos los productos asociados a la misma. Además, se eliminan las imágenes de los productos y de la tienda. Esto funciona
// de manera similar a la eliminación de una tienda desde el dashboard, pero en este caso se realiza desde la API.
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("No estás autorizado.", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("No se ha encontrado la tienda.", {
        status: 400,
      });
    }

    const store = await prismadb.store.deleteMany({
      where: {
        id: params.storeId,
        userId,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("[STORE_DELETE]", error);
    return new NextResponse("Al parecer ha ocurrido un error", { status: 500 });
  }
}
