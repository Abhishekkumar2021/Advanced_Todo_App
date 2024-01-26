"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/utils";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import { useSearchParams } from "next/navigation";
import * as zod from "zod";
import { Textarea } from "@/components/ui/textarea";

const formSchema = zod.object({
  title: zod
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .trim(),
  description: zod
    .string()
    .min(3, { message: "Description must be at least 3 characters long" })
    .trim(),
  category: zod.string().trim(),
});

export default function Page() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const toast = useToast();
  const form = useForm({
    resolver: zodResolver(formSchema),
  });
  const router = useRouter();

  useEffect(() => {
    async function getCategories() {
      setLoading(true);
      try {
        const { data } = await api.get("/categories");
        setCategories(data.categories);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    getCategories();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error />;

  const onSubmit = async (data: any) => {
    console.log(data)
    try {
      const res = await api.post(`/todos`, data);
      toast.toast({
        title: "Todo Created",
        description: `Todo created successfully`,
      });
      router.push("/todos");
    } catch (error) {
      toast.toast({
        title: "Error",
        description: "There was an error creating your todo",
        variant: "destructive",
      });
    } finally {
      form.reset();
    }
  };
  return (
    <main className="flex flex-1 flex-col gap-4 items-center justify-center p-5">
      <h1 className="text-3xl font-bold">Create Todo</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 border-2 border-secondary rounded-sm mt-5 p-5"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <FormItem>
                <FormLabel>Title of the todo</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Type here..."
                    onChange={onChange}
                    value={value}
                  />
                </FormControl>
                <FormDescription>This is the title of the todo</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <FormItem>
                <FormLabel>Description of the todo</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Type here..."
                    onChange={onChange}
                    value={value}
                    className="max-h-32"
                  />
                </FormControl>
                <FormDescription>
                  This is the description of the todo
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field: { onChange, value = categoryId } }) => (
              <FormItem>
                <FormLabel>Category of the todo</FormLabel>
                <FormControl>
                  <Select value={value} onValueChange={onChange}>
                    <SelectTrigger className="w-72">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  This is the category of the todo
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    <Button asChild variant="link">
        <Link href="/todos">See All Todos</Link>
    </Button>
    </main>
  );
}
