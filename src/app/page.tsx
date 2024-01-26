import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 bg-red flex-col items-center justify-center">
      <h1 className="w-3/4 text-center text-3xl">
        <span className="text-5xl font-bold text-green-600 dark:text-green-500 p-2">
          Hi
        </span>
        , Welcome to
        <span className="text-4xl font-bold p-2 text-green-600 dark:text-green-500">
          Advanced Todo
        </span>
        , A todo app built with
        <span className="text-xl font-bold py-1 px-2 bg-zinc-100 m-2 rounded-md dark:bg-zinc-700">
          Next.js
        </span>
        and
        <span className="text-xl font-bold px-2 py-1 bg-zinc-100 m-2 rounded-md dark:bg-zinc-700">
          Node.js
        </span>
        .
      </h1>
      <Button variant="default" className="mt-4" asChild>
        <Link href="/categories">Get Started</Link>
      </Button>
    </main>
  );
}
