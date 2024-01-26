"use client";

import Loading from "@/components/Loading";
import Error from "@/components/Error";
import { useEffect, useState } from "react";
import { api } from "@/lib/utils";
import TodoComponent from "@/components/Todo";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { IoIosAddCircleOutline } from "react-icons/io";

export default function Page() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    async function getCategories() {
      setLoading(true);
      try {
        const { data } = await api.get("/todos");
        setTodos(data.todos);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    getCategories();
  }, []);

  const completedTodos = todos.filter((todo) => todo.completed);
  const incompleteTodos = todos.filter((todo) => !todo.completed);
  const toast = useToast();
  const router = useRouter();

  async function toogleTodoStatus(todoId: string) {
    const todo = todos.find((todo) => todo._id === todoId);
    if (!todo) return;
    try {
      const newTodo = { ...todo, completed: !todo.completed };
      const response = await api.patch(`/todos/${todoId}`, {
        completed: !todo.completed,
      });
      const newTodos = todos.map((todo) => {
        if (todo._id === todoId) return newTodo;
        return todo;
      });
      toast.toast({
        title: "Todo Updated",
        description: `Todo ${todo.title} has been updated`,
      });
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
      });
      setTodos(newTodos);
    } catch (error) {
      console.log(error);
    }
  }

  function handleClick(){
    router.push(`/todos/new`)
  }

  if (loading) return <Loading />;
  if (error) return <Error />;

  return (
    <div className="flex flex-col gap-4 items-center justify-center pt-3">
      <h1 className="text-3xl font-bold">Todos</h1>
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
            <TodoComponent
              key={todo._id}
              todo={todo}
              toggle={toogleTodoStatus}
              deleteTodo={deleteTodoById}
            />
          ))}
        </div>
      </div>
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="p-0 shadow-md fixed bottom-4 right-4 w-12 h-12 rounded-full"
              onClick={handleClick}
            >
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
