"use client";
import TodoComponent from "@/components/Todo";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {api} from "@/lib/utils";
import { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { IoIosAddCircleOutline } from "react-icons/io";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type ParamsType = {
  categoryId: string;
};

function AlertDialogComponent({handleDelete}: {handleDelete: () => void}){
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <RiDeleteBin6Line className="mr-2" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this category.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default function Page({ params }: { params: ParamsType }) {
  const { categoryId } = params;
  const [category, setCategory] = useState<Category | null>();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const completedTodos = todos.filter((todo) => todo.completed);
  const incompleteTodos = todos.filter((todo) => !todo.completed);
  const toast = useToast();
  const router = useRouter();

  async function toogleTodoStatus(todoId: string) {
    const todo = todos.find((todo) => todo._id === todoId);
    if (!todo) return;
    try {
      const newTodo = { ...todo, completed: !todo.completed };
      const response = await api.patch(
        `/todos/${todoId}`,
        { completed: !todo.completed },
      );
      const newTodos = todos.map((todo) => {
        if (todo._id === todoId) return newTodo;
        return todo;
      });
      toast.toast({
        title: "Todo Updated",
        description: `Todo ${todo.title} has been updated`,
      })
      setTodos(newTodos);
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteTodoById(todoId: string) {
    const todo = todos.find((todo) => todo._id === todoId);
    if (!todo) return;
    try {
      await api.delete(`/todos/${todoId}`);
      const newTodos = todos.filter((todo) => todo._id !== todoId);
      toast.toast({
        title: "Todo Deleted",
        description: `Todo ${todo?.title} has been deleted`,
        variant: "destructive",
      })
      setTodos(newTodos);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      // Two request in parallel
      try {
        const [todosData, categoryData] = await Promise.all([
          api.get(`/categories/${categoryId}/todos`),
          api.get(`/categories/${categoryId}`),
        ]);
  
        const { todos }: { todos: Todo[] } = todosData.data;
        const { category }: { category: Category } = categoryData.data;
  
        setTodos(todos);
        setCategory(category);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    return () => {
      // cleanup
      setTodos([]);
      setCategory(null);
    };
  }, [categoryId]);


  async function handleDelete() {
    try {
      await api.delete(`/categories/${categoryId}`);
      toast.toast({
        title: "Category Deleted",
        description: `Category ${category?.name} has been deleted`,
        variant: "destructive",
      })
      router.push(`/categories`);
    } catch (error) {
      console.log(error);
    }
  }

  function handleClick(){
    router.push(`/todos/new?categoryId=${categoryId}`)
  }

  if(loading) return <Loading />

  if(error) return <Error />

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 pt-5">
      <div className="w-full flex justify-center items-center gap-5">
        <h1 className="text-3xl font-bold underline underline-offset-8">{category?.name}</h1>
        {
          todos.length === 0 && (
            <AlertDialogComponent handleDelete={handleDelete} />
          )
        }
        
      </div>
      <div className="flex flex-wrap gap-7 justify-center items-center">
        <div className="flex flex-col gap-2 p-5 px-10 rounded-sm bg-ca ">
          <h2 className="text-xl font-bold">Completed</h2>
          <span className="text-muted-foreground">
            {completedTodos.length} of {todos.length}
          </span>
        </div>
        <div className="flex flex-col gap-2 p-5 px-10 rounded-sm">
          <h2 className="text-xl font-bold">Incomplete</h2>
          <span className="text-muted-foreground">
            {incompleteTodos.length} of {todos.length}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <div className="flex flex-col gap-5 flex-1 justify-center items-center">
          {todos.map((todo) => (
            <TodoComponent key={todo._id} todo={todo} toggle={toogleTodoStatus} deleteTodo={deleteTodoById} />
          ))}
        </div>
      </div>
      <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
        <Button variant="ghost" className="p-0 shadow-md fixed bottom-4 right-4 w-12 h-12 rounded-full" onClick={handleClick} >
        <IoIosAddCircleOutline className="w-8 h-8" />
      </Button>
        </TooltipTrigger>
        <TooltipContent className="text-sm rounded-md mr-2">
            Create a new todo
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>

    </div>
  );
}
