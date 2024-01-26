// make it a module
export {};

declare global {
  interface Category {
    _id: string;
    name: string;
    color: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    todos: number;
    completed: boolean;
  }

  interface Todo {
    _id: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
    category: Category;
  }

}
