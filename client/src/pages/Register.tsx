import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "../hooks";
import { setUser } from "../store/slices/UserSlice";

type Inputs = {
  username: string;
  email: string;
  password: string;
};
const Register = () => {
  const registerApi = `${import.meta.env.VITE_BASE_URL}register`;

  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const registerUser = async (data: Inputs) => {
    axios
      .post(registerApi, {
        username: data.username,
        email: data.email,
        password: data.password,
      })
      .then(function (response) {
        dispatch(setUser({ ...response.data }));
        navigate("/todos");
      })
      .catch(function (error) {
        setError(error.response.data.message);
      });
  };

  return (
    <div className="w-[400px] bg-white shadow-md p-3 rounded-lg">
      <h4 className="text-2xl text-center mb-5">Register</h4>
      {error && <span className="text-red-500 text-sm">{error}</span>}
      <form onSubmit={handleSubmit(registerUser)}>
        <div className="flex flex-col">
          <label htmlFor="username">UserName</label>
          <input
            type="text"
            id="username"
            className="border border-slate-400 p-2 rounded-md"
            {...register("username", {
              required: "Username is required",
            })}
          />
        </div>
        {errors.username && (
          <span className="text-red-500 text-xs">
            {errors.username.message}
          </span>
        )}
        <div className="flex flex-col">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="border border-slate-400 p-2 rounded-md"
            {...register("email", {
              required: "Email is required",
            })}
          />
        </div>
        {errors.email && (
          <span className="text-red-500 text-xs">{errors.email.message}</span>
        )}
        <div className="flex flex-col">
          <label htmlFor="password">Password</label>
          <input
            type="text"
            id="password"
            className="border border-slate-400 p-2 rounded-md"
            {...register("password", {
              required: "Password is required",
            })}
          />
        </div>
        {errors.password && (
          <span className="text-red-500 text-xs">
            {errors.password.message}
          </span>
        )}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white rounded-md p-1.5 mt-4"
        >
          Register
        </button>
      </form>
      <p className="mt-3 text-center">
        Already have an account ?{" "}
        <Link to="/" className="text-indigo-500">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;
