import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define rutas públicas
const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export default clerkMiddleware(async (auth, request) => {
  // Si la ruta es pública, no hacemos nada
  if (isPublicRoute(request)) {
    return; // No proteger las rutas públicas
  }

  // Aquí se asegura de que solo las rutas privadas sean protegidas
  try {
    // Si el usuario no está autenticado, protege la ruta y redirige al login
    auth();
  } catch (error) {
    // Si hay un error (por ejemplo, no está autenticado), redirige al login
    return Response.redirect("/sign-in");
  }

  // Añadir encabezados CORS a la respuesta
  const response = NextResponse.next();
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
});

export const config = {
  matcher: [
    // Rutas de API y TRPC
    "/(api|trpc)(.*)",
    // Excluir archivos estáticos y internos de Next.js
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
