import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "../hooks";
import { setUser } from "../store/slices/UserSlice";
import { Button } from "../components/ui/button";

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
        navigate("/lists");
      })
      .catch(function (error) {
        setError(error.response.data.message);
      });
  };

  return (
    <div className="absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 w-[400px] bg-white shadow-md p-3 rounded-lg">
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
        <Button variant={"primary"} className="w-full mt-4 text-white">
          Register
        </Button>
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
