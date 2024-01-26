import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import {RiDeleteBin6Line} from "react-icons/ri";
import { formatDistance } from "date-fns";

type TodoProps = {
  todo: Todo; // Define the type of the 'todo' prop
  toggle: (todoId: string) => void;
  deleteTodo: (todoId: string) => void;
};

const TodoComponent: React.FC<TodoProps> = ({ todo, toggle, deleteTodo }) : JSX.Element => {
  const completed = todo.completed;
  const handleToggle = () => {
    toggle(todo._id);
  };
  const handleDelete = () => {
    deleteTodo(todo._id)
  }
  return (
    <Card className="w-96">
      <CardHeader className="flex gap-5 flex-row items-center"  >
        <Checkbox onClick={handleToggle} checked={completed} />
        <CardTitle>{todo.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{todo.description}</CardDescription>
        <div className="flex mt-4 gap-8">
                <CardDescription>
                  Created {formatDistance(new Date(todo.createdAt), new Date(), {
                    addSuffix: true,
                  })}
                </CardDescription>
                <CardDescription>
                  Updated {formatDistance(new Date(todo.updatedAt), new Date(), {
                    addSuffix: true,
                  })}
                </CardDescription>
              </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleDelete} variant="destructive" size="sm" >
          <RiDeleteBin6Line className="mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
};

export default TodoComponent;
