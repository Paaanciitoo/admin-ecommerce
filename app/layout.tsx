import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

//Lenguaje de Clerk para el formulario de inicio de sesión
import { esES } from "@clerk/localizations";

//Providers personalizados
import { ModalProvider } from "@/providers/modal-provider";

//Providers de terceros
import { ToastProvider } from "@/providers/toast-provider";

//Estilos globales
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Panel de administrador",
  description: "Panel de administrador",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={esES}>
      <html lang="es-ES">
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="white"
            enableSystem
            disableTransitionOnChange
          >
            <ToastProvider />
            <ModalProvider />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
