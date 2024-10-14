"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Bone } from "lucide-react";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  const routes = [
    {
      href: `/${params.storeId}`,
      label: "Inicio",
      active: pathname === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/cartelera`,
      label: "Cartelera",
      active: pathname === `/${params.storeId}/cartelera`,
    },
    {
      href: `/${params.storeId}/settings`,
      label: "Ajustes",
      active: pathname === `/${params.storeId}/settings`,
    },
  ];

  const handleNavigation = (href: string) => {
    if (pathname === href) {
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      router.push(href);
    });
  };

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
