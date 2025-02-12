import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

//Prisma es immportado desde la carpeta lib que creamos anteriormente y la que contiene la configuración de la base de datos
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name } = body;

    if (!userId) {
      return new NextResponse("No tienes permitido ingresar.", { status: 401 });
    }
    if (!name) {
      return new NextResponse("Se requiere un nombre para continuar.", {
        status: 400,
      });
    }

    const store = await prismadb.store.create({
      data: {
        name,
        userId,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("[STORES_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
