import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error() {
    return (
        <div className="flex flex-1 flex-col items-center justify-center select-none">
        <h1 className="text-5xl font-bold text-red-600 dark:text-red-500">
            404
        </h1>
        <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400">
            Page not found
        </h2>
        <Button variant="default" className="mt-4" asChild>
            <Link href="/" >
                Go back home
            </Link>
        </Button>
        </div>
    );
}