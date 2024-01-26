"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn, api } from "@/lib/utils";
import { formatDistance, set } from "date-fns";
import Color from "color";
import {PlusCircledIcon} from "@radix-ui/react-icons"
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import Error from "@/components/Error";


export default function Todo() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  useEffect(() => {
    setLoading(true);
    async function getCategories() {
      try {
        const response = await api.get("/categories");
        const { data } = response;
        setCategories(data.categories);
      } catch (error) {
        setError(true);
      }
      finally {
        setLoading(false);
      }
    }
    getCategories();
  }, []);

  if(loading) <Loading />

  if(error) <Error />

  return (
    <div className="flex flex-1 flex-col items-center justify-center pt-2">
      <div className="flex items-center justify-evenly gap-4 w-full py-2">
        <h1 className="text-xl sm:text-3xl font-bold text-primary">
          All Categories ({categories.length})
        </h1>
        <Button variant="default" size="sm" asChild>
          <Link href="/categories/new" >
            <div className="flex flex-row items-center justify-center">
              <PlusCircledIcon className="h-5 w-5 mr-2" />
              <span>Add Category</span>
            </div>
          </Link>
        </Button>
        
      </div>
      <div className="flex flex-1 content-center items-center justify-center p-8 gap-4 flex-wrap">
      {categories.map((category) => {
        const color = Color(category.color);

        return (
          <Card
            key={category._id}
            className="w-80 relative"
          >
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                It contains {category.todos} todos
              </CardDescription>
              <div className="flex mt-4 gap-6">
                <CardDescription>
                  Created{" "}
                  {formatDistance(new Date(category.createdAt), new Date(), {
                    addSuffix: true,
                  })}
                </CardDescription>
                <CardDescription>
                  Updated{" "}
                  {formatDistance(new Date(category.updatedAt), new Date(), {
                    addSuffix: true,
                  })}
                </CardDescription>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="default">
                <Link href={`/categories/${category._id}`}>View Todos</Link>
              </Button>
              {
                category.completed ? (
                  <Badge variant="secondary">Completed</Badge>
                ) : (
                  <Badge variant="destructive">Incomplete</Badge>
                )
              }
            </CardFooter>
            <div
              className="absolute top-2 right-2 w-8 h-8 rounded-full p-1"
              style={{
                border: `2px solid ${color.lighten(0.6).hex()}`,
              }}
            >
              <div className={cn("w-full h-full rounded-full")} style={{
                backgroundColor: color.lighten(0.6).hex()
              }}>

              </div>
            </div>
          </Card>
        );
      })}
      </div>
    </div>
  );
}
