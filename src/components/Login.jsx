import React, { useEffect } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { cn } from "../util/lib";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { LoginValidationSchema } from "../validations/loginValidationSchema";
import toast from "react-hot-toast";
import { login } from "../api/api";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/slices/authSlice";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {userInfo} = useSelector((state)=> state.auth );

  useEffect(()=>{
    if(userInfo){
      navigate('/home');
    }
  },[navigate,userInfo])

  const { handleSubmit, handleChange, handleBlur, values, errors, touched } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: LoginValidationSchema,
      onSubmit: async (values) => {
        console.log("Form submitted", values);
        try {
          const response = await login(values);
          console.log("response:", response);
          if (response.status === true) {
            dispatch(setCredentials(response.payload))
            toast.success(response.message);
            navigate("/home");
          }
        } catch (error) {
          toast.error(error.message);
        }
      },
    });

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 text-center">
        Login
      </h2>
      <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            placeholder="Enter your email Id here"
            type="email"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
          />
          {touched.email && errors.email ? (
            <div className="text-red-500 text-sm">{errors.email}</div>
          ) : null}
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            placeholder="Enter your password here"
            type="password"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.password}
          />
          {touched.password && errors.password ? (
            <div className="text-red-500 text-sm">{errors.password}</div>
          ) : null}
        </LabelInputContainer>

        <div className="mb-4 text-right">
          <button
            type="button"
            // onClick={handleForgotPassword}
            className="text-sm hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Log In
          <BottomGradient />
        </button>

        <div className="mt-2 text-center">
          <button type="button" className="text-sm">
            Doesnt have an account?
            <Link to="/signup">
              <span className="hover:underline text-gray-500"> Sign up</span>
            </Link>
          </button>
        </div>
      </form>
    </div>
  );
}
const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
