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

    const { name, carteleraId } = body;

    if (!userId) {
      return new NextResponse("No tienes permitido ingresar.", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Se requiere un nombre para continuar.", {
        status: 400,
      });
    }

    if (!carteleraId) {
      return new NextResponse("Se requiere el ID de la cartelera para continuar.", {
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

    const category = await prismadb.category.create({
      data: {
        name,
        carteleraId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORIES_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

////////////////////////////////////////

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Se requiere un ID de tienda para continuar.", {
        status: 400,
      });
    }

    const categories = await prismadb.category.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log("[CATEGORIES_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
