"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Bone } from 'lucide-react';

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [targetPath, setTargetPath] = useState<string | null>(null);

  const routes = useMemo(() => [
    {
      href: `/${params.storeId}`,
      label: "Inicio",
      active: pathname === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/productos`,
      label: "Productos",
      active: pathname === `/${params.storeId}/productos`,
    },
    {
      href: `/${params.storeId}/orders`,
      label: "Pedidos",
      active: pathname === `/${params.storeId}/orders`,
    },
    {
      href: `/${params.storeId}/cartelera`,
      label: "Cartelera",
      active: pathname === `/${params.storeId}/cartelera`,
    },
    {
      href: `/${params.storeId}/categorias`,
      label: "Categorías",
      active: pathname === `/${params.storeId}/categorias`,
    },
    {
      href: `/${params.storeId}/pesos`,
      label: "Peso",
      active: pathname === `/${params.storeId}/pesos`,
    },
    {
      href: `/${params.storeId}/colores`,
      label: "Colores",
      active: pathname === `/${params.storeId}/colores`,
    },
    {
      href: `/${params.storeId}/settings`,
      label: "Ajustes",
      active: pathname === `/${params.storeId}/settings`,
    },
  ], [params.storeId, pathname]);

  const handleNavigation = useCallback((href: string) => {
    if (pathname === href) {
      return;
    }
    setIsLoading(true);
    setTargetPath(href);
    router.push(href);
  }, [pathname, router]);

  useEffect(() => {
    if (isLoading && targetPath === pathname) {
      setIsLoading(false);
      setTargetPath(null);
    }
  }, [isLoading, targetPath, pathname]);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-50 z-50">
          <div className="text-center">
            <Bone className="h-10 w-10 animate-spin text-primary mx-auto" />
            <p className="mt-4 text-lg font-medium text-primary">Cargando</p>
          </div>
        </div>
      )}
      <nav
        className={cn("flex items-center space-x-4 lg:space-x-6", className)}
        {...props}
      >
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              route.active
                ? "text-black dark:text-white"
                : "text-muted-foreground"
            )}
            onClick={(e) => {
              e.preventDefault();
              handleNavigation(route.href);
            }}
          >
            {route.label}
          </Link>
        ))}
      </nav>
    </>
  );
}

