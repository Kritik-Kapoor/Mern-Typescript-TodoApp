import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "../hooks";
import { setUser } from "../store/slices/UserSlice";
import { Button } from "../components/ui/button";

type Inputs = {
  email: string;
  password: string;
};

const Login = () => {
  const loginApi = `${import.meta.env.VITE_BASE_URL}login`;

  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const loginUser = async (data: Inputs) => {
    axios
      .post(loginApi, { email: data.email, password: data.password })
      .then(function (response) {
        console.log(response);
        dispatch(setUser({ ...response.data }));
        navigate("/lists");
      })
      .catch(function (error) {
        setError(error.response.data.message);
      });
  };

  return (
    <div className="absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 w-[400px] bg-white shadow-md p-3 rounded-lg">
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
            type="password"
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
        <Button variant={"primary"} className="w-full mt-4 text-white">
          Login
        </Button>
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
