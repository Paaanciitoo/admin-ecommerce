import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Desde la API, se puede obtener una tienda utilizando el método GET. Para ello, se debe enviar una solicitud GET a la ruta /api/stores/[storeId].
// Al obtener una tienda, se devuelven los datos de la tienda, incluyendo su nombre y el id del usuario propietario de la tienda. Esto funciona de manera similar
// a la obtención de una tienda desde el dashboard, pero en este caso se realiza desde la API.

export async function GET(
  req: Request,
  { params }: { params: { productosId: string } }
) {
  try {
    if (!params.productosId) {
      return new NextResponse("Se requiere el ID del producto.", {
        status: 400,
      });
    }

    const productos = await prismadb.product.findUnique({
      where: {
        id: params.productosId,
      },
      include: {
        images: true,
        categorias: true,
        colores: true,
        pesos: true,
      },
    });

    return NextResponse.json(productos);
  } catch (error) {
    console.log("[PRODUCTOS_GET]", error);
    return new NextResponse("Al parecer ha ocurrido un error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productosId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const {
      name,
      price,
      categoriasId,
      pesosId,
      coloresId,
      images,
      isFeatured,
      isArchived,
    } = body;

    if (!userId) {
      return new NextResponse("No estás autorizado.", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Se requiere un nombre para continuar.", {
        status: 400,
      });
    }

    if (!images || !images.length) {
      return new NextResponse(
        "Se requiere al menos una imagen para continuar.",
        {
          status: 400,
        }
      );
    }

    if (!price) {
      return new NextResponse("Se requiere un precio para continuar.", {
        status: 400,
      });
    }

    if (!categoriasId) {
      return new NextResponse(
        "Se requiere el ID de la categoría para continuar.",
        {
          status: 400,
        }
      );
    }

    if (!pesosId) {
      return new NextResponse("Se requiere el ID del peso para continuar.", {
        status: 400,
      });
    }

    if (!coloresId) {
      return new NextResponse("Se requiere el ID del color para continuar.", {
        status: 400,
      });
    }

    if (!params.productosId) {
      return new NextResponse("Se requiere el ID del producto.", {
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

    await prismadb.product.update({
      where: {
        id: params.productosId,
      },
      data: {
        name,
        price,
        categoriasId,
        pesosId,
        coloresId,
        images: {
          deleteMany: {},
        },
        isFeatured,
        isArchived,
      },
    });

    const productos = await prismadb.product.update({
      where: {
        id: params.productosId
      },
      data: {
        images: {
          createMany: {
            data : [
              ...images.map((image: { url: string }) => image),
            ]
          }
        }
      }
    })

    return NextResponse.json(productos);
  } catch (error) {
    console.log("[PRODUCTOS_PATCH]", error);
    return new NextResponse("Al parecer ha ocurrido un error", { status: 500 });
  }
}

// Desde la API, se puede eliminar una tienda utilizando el método DELETE. Para ello, se debe enviar una solicitud DELETE a la ruta /api/stores/[storeId].
// Al eliminar una tienda, se eliminan todos los productos asociados a la misma. Además, se eliminan las imágenes de los productos y de la tienda. Esto funciona
// de manera similar a la eliminación de una tienda desde el dashboard, pero en este caso se realiza desde la API.
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; productosId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("No estás autorizado.", { status: 401 });
    }

    if (!params.productosId) {
      return new NextResponse("Se requiere el ID del producto.", {
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

    const productos = await prismadb.product.deleteMany({
      where: {
        id: params.productosId,
      },
    });

    return NextResponse.json(productos);
  } catch (error) {
    console.log("[PRODUCTOS_DELETE]", error);
    return new NextResponse("Al parecer ha ocurrido un error", { status: 500 });
  }
}
