import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

type Inputs = {
  email: string;
  password: string;
};

const Login = () => {
  const loginApi = `${import.meta.env.VITE_BASE_URL}login`;

  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const loginUser = async (data: Inputs) => {
    axios
      .post(loginApi, {
        email: data.email,
        password: data.password,
      })
      .then(function () {
        navigate("/todos");
      })
      .catch(function (error) {
        setError(error.response.data.message);
      });
  };

  return (
    <div className="w-[400px] bg-white shadow-md p-3 rounded-lg">
      <h4 className="text-2xl text-center mb-5">Login</h4>
      {error && <span className="text-red-500 text-sm">{error}</span>}
      <form onSubmit={handleSubmit(loginUser)}>
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
          Login
        </button>
      </form>
      <p className="mt-3 text-center">
        Don't have an account ?{" "}
        <Link to="/register" className="text-indigo-500">
          Register
        </Link>
      </p>
    </div>
  );
};

export default Login;
