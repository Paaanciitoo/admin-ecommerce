import React, { Suspense } from "react";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { MainNav } from "@/components/main-nav";
import prismadb from "@/lib/prismadb";
import { ModeToggle } from "./toggle-theme";

interface Store {
  id: string;
  name: string;
  userId: string;
  createAt: Date;
  updateAt: Date;
}

const StoreSwitcher = React.lazy(() => import("@/components/store-switcher"));

const Navbar = async () => {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  let stores: Store[] = [];
  try {
    stores = await prismadb.store.findMany({
      where: {
        userId,
      },
    });
  } catch (error) {
    console.error("Error al cargar las tiendas:", error);
  }

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <Suspense fallback={<div>Cargando tiendas...</div>}>
          <StoreSwitcher items={stores} />
        </Suspense>
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          <UserButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
