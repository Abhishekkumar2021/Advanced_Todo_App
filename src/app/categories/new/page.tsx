"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as zod from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import Link from "next/link"
import {api} from "@/lib/utils"
import { useRouter } from "next/navigation"

const formSchema = zod.object({
  name: zod.string().min(3, { message: "Name must be at least 3 characters long" }).trim(),
  color: zod.string().trim(),
})

export default function NewCategoryPage() {
  const [show, setShow] = useState<boolean>(false)
  const toast = useToast()
  const form = useForm({
    resolver: zodResolver(formSchema),
  })
  const router = useRouter()

  const onSubmit = async (data:any) => {
    try {
      const res = await api.post(`/categories`, data)
      toast.toast({
        title: "Category created",
        description: `Category ${res.data.name} has been created`
      })
      router.push("/categories")
    } catch (error) {
      toast.toast({
        title: "Error",
        description: "There was an error creating your category",
        variant: "destructive",
      })
    }
    finally {
      form.reset()
      setShow(true)
    }
  }
  return (
    <main className="flex flex-1 flex-col gap-4 items-center justify-center">
      <h1 className="text-3xl font-bold">Create Category</h1>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 border-2 border-secondary rounded-sm mt-5 p-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="Type here..." {...field} />
              </FormControl>
              <FormDescription>
                This is the name of the category
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <Input type="color" placeholder="Type here..." {...field} />
              </FormControl>
              <FormDescription>
                This is the color associated to the category
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
    {
      show && (
        <Button asChild variant="link">
          <Link href="/categories">
            Go back
          </Link>
        </Button>
      )
    }
    </main>
  )
}