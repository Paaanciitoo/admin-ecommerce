"use client";

import * as React from "react";
import { Moon, Sun, Laptop } from 'lucide-react';
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="relative overflow-hidden border-none rounded-full w-10 h-10 transition-all duration-300 transform hover:scale-110"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Cambiar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 bg-gradient-to-b from-white to-white dark:from-gray-900 dark:to-gray-900 border-pink-100 dark:border-black">
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className="flex items-center justify-between cursor-pointer hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors duration-200"
        >
          <span>Claro</span>
          <Sun className="h-4 w-4 text-yellow-500" />
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className="flex items-center justify-between cursor-pointer hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors duration-200"
        >
          <span>Oscuro</span>
          <Moon className="h-4 w-4 text-blue-500" />
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className="flex items-center justify-between cursor-pointer hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors duration-200"
        >
          <span>Sistema</span>
          <Laptop className="h-4 w-4 text-green-500" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

