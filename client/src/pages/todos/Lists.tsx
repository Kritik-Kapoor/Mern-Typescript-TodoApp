import axios from "axios";
import { Button } from "../../components/ui/button";
import { useAppSelector } from "../../hooks";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import ListCard from "@/components/ui/listCard";

type Inputs = {
  todo: string;
};

type listObject = {
  _id: string;
  title: string;
  todos: [
    {
      status: number;
      todo: string;
      _id: string;
    }
  ];
  status: number;
};

const Lists = () => {
  const createListApi = `${import.meta.env.VITE_BASE_URL}create-list`;
  const getListApi = `${import.meta.env.VITE_BASE_URL}get-list`;
  const deleteListApi = `${import.meta.env.VITE_BASE_URL}delete-list`;
  const userData = useAppSelector((state) => state.userReducer);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm<Inputs>();

  const [list, setList] = useState<listObject[]>([]);
  const [error, setError] = useState<string>("");

  const createList = async (data: Inputs) => {
    await axios
      .post(createListApi, {
        user_id: userData.id,
        list: data.todo,
      })
      .then(function (response) {
        setList([...response.data.data]);
      })
      .catch(function (error) {
        setError(error.response.data.message);
      });
  };

  const getList = useCallback(async () => {
    await axios
      .post(getListApi, {
        id: userData.id,
      })
      .then(function (response) {
        console.log(response);
        setList(response.data.list);
      })
      .catch(function (error) {
        setError(error.response.data.message);
      });
  }, [getListApi, userData]);

  const deleteList = async (list_id: string) => {
    axios
      .delete(`${deleteListApi}/${userData.id}/${list_id}`)
      .then(function (response) {
        setList(response.data.data);
        console.log(response);
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
    const timer = setTimeout(() => {
      getList();
    });
    return () => {
      clearTimeout(timer);
    };
  }, [getList]);

  return (
    <div className="grid grid-cols-6">
      <Sidebar />
      <div className="col-span-5 p-5">
        <h4 className="mb-5 text-2xl text-center text-white">My Lists</h4>
        {error && <span className="text-red-500 text-sm">{error}</span>}
        {errors.todo && (
          <span className="text-red-500 text-sm">{errors.todo.message}</span>
        )}
        <form
          onSubmit={handleSubmit(createList)}
          className="flex items-center justify-between"
        >
          <input
            type="text"
            id="todo"
            placeholder="Create new list..."
            className="w-10/12 border border-slate-400 p-2 rounded-md"
            {...register("todo", {
              required: "List is required",
            })}
          />
          <Button variant={"primary"} className="w-2/12 ms-3 text-white">
            Add
          </Button>
        </form>
        <div className="grid grid-cols-4 gap-5 mt-12">
          {list ? (
            list.map((list) => (
              <Link to={`/todos/${list._id}`} key={list._id}>
                <ListCard data={list} deleteList={deleteList} />
              </Link>
            ))
          ) : (
            <p className="font-medium">No List Created</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lists;
