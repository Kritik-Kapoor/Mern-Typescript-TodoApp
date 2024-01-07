import axios from "axios";
import { Buttons } from "../../components/Buttons";
import { useAppSelector } from "../../hooks";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import randomId from "../../utils/randomId";

type Inputs = {
  list_item: string;
};

type listObject = {
  id: string;
  title: string;
  list_item: [];
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
        id: userData.id,
        list: data.list_item,
        list_id: randomId(),
      })
      .then(function (response) {
        setList((prev) => [...prev, response.data.data]);
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
    <div className="w-[700px]">
      <h4 className="mb-5 text-2xl text-center text-white">My Lists</h4>
      {error && <span className="text-red-500 text-sm">{error}</span>}
      {errors.list_item && (
        <span className="text-red-500 text-sm">{errors.list_item.message}</span>
      )}
      <form
        onSubmit={handleSubmit(createList)}
        className="flex items-center justify-between"
      >
        <input
          type="text"
          id="list_item"
          placeholder="Create new list..."
          className="w-10/12 border border-slate-400 p-2 rounded-md"
          {...register("list_item", {
            required: "List is required",
          })}
        />
        <Buttons type="submit" text="Add" classes="w-2/12 p-2 ms-3" />
      </form>
      <div className="mt-5">
        {list?.map((list) => (
          <div key={list.id} className="flex items-center">
            <Link
              to={`/todos/${list.id}`}
              className="w-11/12 p-1.5 my-1.5 bg-white shadow-md rounded-md hover:bg-indigo-600 hover:text-white cursor-pointer"
            >
              {list.title}
            </Link>
            <i
              className="fa-solid fa-trash fa-xl ms-5 text-red-500 cursor-pointer"
              onClick={() => deleteList(list.id)}
            ></i>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lists;
