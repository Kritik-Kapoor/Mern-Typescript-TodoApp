import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../hooks";
import randomId from "../../utils/randomId";
import { Buttons } from "../../components/Buttons";

type Inputs = {
  todo: string;
};

type todosObject = {
  todo: string;
  id: string;
  status: number;
};

const Todos = () => {
  const getTodosApi = `${import.meta.env.VITE_BASE_URL}get-todos`;
  const addTodoApi = `${import.meta.env.VITE_BASE_URL}add-todo`;
  const markAsCompletedApi = `${import.meta.env.VITE_BASE_URL}mark-completed`;
  const deleteTodoApi = `${import.meta.env.VITE_BASE_URL}delete-todo`;

  const userData = useAppSelector((state) => state.userReducer);
  const [todos, setTodos] = useState<todosObject[]>([]);
  const [error, setError] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm<Inputs>();
  const { id } = useParams();

  const getTodos = useCallback(async () => {
    await axios
      .post(getTodosApi, {
        id: id,
      })
      .then(function (response) {
        console.log(response);
        setTodos(response.data.todos);
      })
      .catch(function (error) {
        setTodos([]);
        setError(error.response.data.message);
      });
  }, [getTodosApi, id]);

  const addTodo = async (data: Inputs) => {
    await axios
      .post(addTodoApi, {
        list_id: id,
        todo: data.todo,
        todo_id: randomId(),
      })
      .then((response) => {
        setTodos((prev) => {
          return [...prev, response.data.data];
        });
      })
      .catch(function (error) {
        setError(error.response.data.message);
      });
  };

  const markAsCompleted = useCallback(
    async (todo_id: string) => {
      await axios
        .put(markAsCompletedApi, {
          list_id: id,
          todo_id,
        })
        .then((response) => {
          console.log(response);
          setTodos(response.data.data);
        })
        .catch(function (error) {
          setError(error.response.data.message);
        });
    },
    [markAsCompletedApi, id]
  );

  const deleteTodo = async (todo_id: string) => {
    axios
      .delete(`${deleteTodoApi}/${userData.id}/${todo_id}`)
      .then(function (response) {
        setTodos(response.data.data);
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

  useEffect(() => {
    const timer = setTimeout(async () => {
      getTodos();
    }, 10);
    return () => {
      clearTimeout(timer);
    };
  }, [getTodos, userData, markAsCompleted]);

  return (
    <div className="w-[700px]">
      <h4 className="mb-5 text-2xl text-center text-white">Todos</h4>
      {error && <span className="text-red-500 text-sm">{error}</span>}
      {errors.todo && (
        <span className="text-red-500 text-sm">{errors.todo.message}</span>
      )}
      <form
        onSubmit={handleSubmit(addTodo)}
        className="flex items-center justify-between"
      >
        <input
          type="text"
          id="todo"
          placeholder="Add new todo..."
          className="w-10/12 border border-slate-400 p-2 rounded-md"
          {...register("todo", {
            required: "Todo is required",
          })}
        />
        <Buttons type="submit" text="Add" classes="w-2/12 p-2 ms-3" />
      </form>
      <div className="mt-5">
        {todos?.map((todo) => (
          <div key={todo.id} className="flex items-center">
            <p className="w-11/12 p-1.5 my-1.5 bg-white shadow-md rounded-md">
              {todo.todo}
            </p>
            {todo.status === 0 ? (
              <i
                className="fa-regular fa-circle-check fa-xl ms-5 text-green-500 cursor-pointer"
                onClick={() => markAsCompleted(todo.id)}
              ></i>
            ) : (
              <i className="fa-solid fa-circle-check fa-xl ms-5 text-green-500"></i>
            )}

            <i
              className="fa-solid fa-trash fa-xl ms-5 text-red-500 cursor-pointer"
              onClick={() => deleteTodo(todo.id)}
            ></i>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Todos;
