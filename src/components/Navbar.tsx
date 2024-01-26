"use client";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { useToast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";
import { ToastAction } from "./ui/toast";

export default function Navbar() {
  const { setTheme } = useTheme();
  const { toast } = useToast();
  return (
    <nav className="flex-col items-center backdrop-blur-md gap-2 sm:flex-row w-full p-3 bg-card shadow-sm flex sticky top-0 justify-between z-10 ">
      <h1
        className="text-2xl font-bold text-green-500
      "
      >
        <Link href="/">Advanced Todo</Link>
      </h1>
      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <Link href="/categories">Categories</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/todos">Todos</Link>
        </Button>
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className=" absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              setTheme("light");
              toast({
                title: "Theme changed to light",
                action: (
                  <ToastAction altText="Undo" onClick={() => setTheme("dark")}>
                    Undo
                  </ToastAction>
                ),
              });
            }}
          >
            Light
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setTheme("dark");
              toast({
                title: "Theme changed to dark",
                action: (
                  <ToastAction altText="Undo" onClick={() => setTheme("light")}>
                    Undo
                  </ToastAction>
                ),
              });
            }}
          >
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setTheme("system");
              toast({
                title: "Theme changed to system",
              });
            }}
          >
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      </div>
      
    </nav>
  );
}
