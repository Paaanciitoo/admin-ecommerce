import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Desde la API, se puede obtener una tienda utilizando el método GET. Para ello, se debe enviar una solicitud GET a la ruta /api/stores/[storeId].
// Al obtener una tienda, se devuelven los datos de la tienda, incluyendo su nombre y el id del usuario propietario de la tienda. Esto funciona de manera similar
// a la obtención de una tienda desde el dashboard, pero en este caso se realiza desde la API.

export async function GET(
  req: Request,
  { params }: { params: { pesosId: string } }
) {
  try {
    if (!params.pesosId) {
      return new NextResponse("Se requiere el peso para continuar.", {
        status: 400,
      });
    }

    const peso = await prismadb.peso.findUnique({
      where: {
        id: params.pesosId,
      },
    });

    return NextResponse.json(peso);
  } catch (error) {
    console.log("[PESO_GET]", error);
    return new NextResponse("Al parecer ha ocurrido un error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; pesosId: string } }
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

    if (!params.pesosId) {
      return new NextResponse("Se requiere el ID del peso.", {
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

    const peso = await prismadb.peso.updateMany({
      where: {
        id: params.pesosId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(peso);
  } catch (error) {
    console.log("[PESO_PATCH]", error);
    return new NextResponse("Al parecer ha ocurrido un error", { status: 500 });
  }
}

// Desde la API, se puede eliminar una tienda utilizando el método DELETE. Para ello, se debe enviar una solicitud DELETE a la ruta /api/stores/[storeId].
// Al eliminar una tienda, se eliminan todos los productos asociados a la misma. Además, se eliminan las imágenes de los productos y de la tienda. Esto funciona
// de manera similar a la eliminación de una tienda desde el dashboard, pero en este caso se realiza desde la API.
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; pesosId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("No estás autorizado.", { status: 401 });
    }

    if (!params.pesosId) {
      return new NextResponse("Se requiere el ID del peso para continuar.", {
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

    const peso = await prismadb.peso.deleteMany({
      where: {
        id: params.pesosId,
      },
    });

    return NextResponse.json(peso);
  } catch (error) {
    console.log("[PESO_DELETE]", error);
    return new NextResponse("Al parecer ha ocurrido un error", { status: 500 });
  }
}
