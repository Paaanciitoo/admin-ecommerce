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

    const { label, imageUrl } = body;

    if (!userId) {
      return new NextResponse("No tienes permitido ingresar.", { status: 401 });
    }

    if (!label) {
      return new NextResponse("Se requiere una etiqueta para continuar.", {
        status: 400,
      });
    }

    if (!imageUrl) {
      return new NextResponse(
        "Se requiere la URL de la imagen para continuar.",
        {
          status: 400,
        }
      );
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

    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARDS_POST]", error);
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

    const billboards = await prismadb.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboards);
  } catch (error) {
    console.log("[BILLBOARDS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
