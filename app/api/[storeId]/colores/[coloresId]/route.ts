import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Desde la API, se puede obtener una tienda utilizando el método GET. Para ello, se debe enviar una solicitud GET a la ruta /api/stores/[storeId].
// Al obtener una tienda, se devuelven los datos de la tienda, incluyendo su nombre y el id del usuario propietario de la tienda. Esto funciona de manera similar
// a la obtención de una tienda desde el dashboard, pero en este caso se realiza desde la API.

export async function GET(
  req: Request,
  { params }: { params: { coloresId: string } }
) {
  try {
    if (!params.coloresId) {
      return new NextResponse("Se requiere el color del accesorio para continuar.", {
        status: 400,
      });
    }

    const colores = await prismadb.color.findUnique({
      where: {
        id: params.coloresId,
      },
    });

    return NextResponse.json(colores);
  } catch (error) {
    console.log("[COLORES_GET]", error);
    return new NextResponse("Al parecer ha ocurrido un error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; coloresId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, value } = body;

    if (!userId) {
      return new NextResponse("No estás autorizado.", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Se requiere rellenar el nombre.", {
        status: 400,
      });
    }

    if (!value) {
      return new NextResponse("Se requiere rellenar el valor.", {
        status: 400,
      });
    }

    if (!params.coloresId) {
      return new NextResponse("Se requiere el ID del color.", {
        status: 400,
      });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("No tienes permitido ingresar.", {
        status: 403,
      });
    }

    const colores = await prismadb.color.updateMany({
      where: {
        id: params.coloresId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(colores);
  } catch (error) {
    console.log("[COLORES_PATCH]", error);
    return new NextResponse("Al parecer ha ocurrido un error", { status: 500 });
  }
}

// Desde la API, se puede eliminar una tienda utilizando el método DELETE. Para ello, se debe enviar una solicitud DELETE a la ruta /api/stores/[storeId].
// Al eliminar una tienda, se eliminan todos los productos asociados a la misma. Además, se eliminan las imágenes de los productos y de la tienda. Esto funciona
// de manera similar a la eliminación de una tienda desde el dashboard, pero en este caso se realiza desde la API.
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; coloresId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("No estás autorizado.", { status: 401 });
    }

    if (!params.coloresId) {
      return new NextResponse("Se requiere el ID del color para continuar.", {
        status: 400,
      });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("No tienes permitido ingresar.", {
        status: 403,
      });
    }

    const colores = await prismadb.color.deleteMany({
      where: {
        id: params.coloresId,
      },
    });

    return NextResponse.json(colores);
  } catch (error) {
    console.log("[COLORES_DELETE]", error);
    return new NextResponse("Al parecer ha ocurrido un error", { status: 500 });
  }
}
