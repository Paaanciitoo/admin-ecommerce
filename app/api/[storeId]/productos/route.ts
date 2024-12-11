import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

//Prisma es immportado desde la carpeta lib que creamos anteriormente y la que contiene la configuración de la base de datos
import prismadb from "@/lib/prismadb";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
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
      return new NextResponse("No tienes permitido ingresar.", { status: 401 });
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

    if (!params.storeId) {
      return new NextResponse("Se requiere un ID de tienda para continuar.", {
        status: 400,
      });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    // Si no se encuentra la tienda con el ID y el usuario, se devuelve un error 403 (Forbidden) al usuario que intenta acceder a la tienda
    // que no le pertenece y no se crea la cartelera en la base de datos de la tienda. Quitando la posibilidad de que un usuario pueda crear
    // cartelera en una tienda que no le pertenece.
    if (!storeByUserId) {
      return new NextResponse("No tienes permitido ingresar.", {
        status: 403,
      });
    }

    const productos = await prismadb.product.create({
      data: {
        name,
        price,
        categoriasId,
        pesosId,
        coloresId,
        isFeatured,
        isArchived,
        storeId: params.storeId,
        images: {
          createMany: {
            data: [...images.map((image: string) => image)],
          },
        },
      },
    });

    return NextResponse.json(productos);
  } catch (error) {
    console.log("[PRODUCTS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

////////////////////////////////////////

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoriasId = searchParams.get("categoriaId") || undefined;
    const coloresId = searchParams.get("coloresId") || undefined;
    const pesosId = searchParams.get("pesosId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    if (!params.storeId) {
      return new NextResponse("Se requiere un ID de tienda para continuar.", {
        status: 400,
      });
    }

    const productos = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoriasId,
        coloresId,
        pesosId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        categorias: true,
        colores: true,
        pesos: true,
      },
      orderBy: {
        createAt: "desc",
      },
    });

    return NextResponse.json(productos);
  } catch (error) {
    console.log("[PRODUCTOS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
