import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAppSelector } from "../../hooks";

type Inputs = {
  todo: string;
};

type todosObject = {
  todo: string;
  id: string;
};

//get all todos

const Todos = () => {
  // const getTodosApi = `${import.meta.env.VITE_BASE_URL}get-todos`;
  const addTodoApi = `${import.meta.env.VITE_BASE_URL}add-todo`;

  const userData = useAppSelector((state) => state.userReducer);
  const [todos, setTodos] = useState<todosObject[]>([]);
  const [error, setError] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm<Inputs>();

  const addTodo = async (data: Inputs) => {
    await axios
      .post(addTodoApi, {
        email: userData.email,
        todo: data.todo,
        id: new Date(),
      })
      .then((response) => {
        console.log(response);
        setTodos((prev) => {
          return [...prev, response.data.data];
        });
      })
      .catch(function (error) {
        setError(error.response.data.message);
      });
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [reset, isSubmitSuccessful]);

  return (
    <div className="w-[700px]">
      <h4 className="mb-5 text-2xl text-center">Todos</h4>
      {error && <span className="text-red-500 text-sm">{error}</span>}
      {errors.todo && (
        <span className="text-red-500 text-sm">{errors.todo.message}</span>
      )}
      <form onSubmit={handleSubmit(addTodo)} className="flex items-center">
        <input
          type="text"
          id="todo"
          placeholder="Add new todo..."
          className="w-10/12 border border-slate-400 p-2 rounded-md"
          {...register("todo", {
            required: "Todo is required",
          })}
        />
        <button
          type="submit"
          className="p-2 ms-3 bg-indigo-600 text-white rounded-md"
        >
          Add
        </button>
      </form>
      <div className="mt-5">
        {todos?.map((todo) => (
          <p
            className="p-1.5 my-1.5 bg-white shadow-md rounded-md"
            key={todo.id}
          >
            {todo.todo}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Todos;
