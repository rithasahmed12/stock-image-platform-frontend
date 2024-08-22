import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { cn } from "../util/lib";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { SignupValidationSchema } from "../validations/signupValdationSchema";
import toast from "react-hot-toast";
import { signup } from "../api/api";
import { useSelector } from "react-redux";

export default function Signup() {

  const navigate = useNavigate();

  const {userInfo} = useSelector((state)=> state.auth );

  useEffect(()=>{
    if(userInfo){
      navigate('/home');
    }
  },[navigate,userInfo])

    const {handleSubmit,handleChange,handleBlur,values,errors,touched} = useFormik({
      initialValues: {
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
      },
      validationSchema: SignupValidationSchema,
      onSubmit: async(values) => {
        console.log("Form submitted", values);
        try {
          const response = await signup(values);
          console.log('response:',response);
          if(response.status === true){
            toast.success(response.message);
            navigate('/');
          }
        } catch (error) {
          toast.error(error.message)
        }
      },
    });


  
  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 text-center">
        Register
      </h2>
    <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

      <form className="my-8" onSubmit={handleSubmit}>
  <LabelInputContainer className="mb-4">
    <Label htmlFor="email">Email Address</Label>
    <Input
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
    <Label htmlFor="phone">Phone</Label>
    <Input
      name="phone"
      placeholder="Enter your phone number here"
      type="text"
      onChange={handleChange}
      onBlur={handleBlur}
      value={values.phone}
    />
    {touched.phone && errors.phone ? (
      <div className="text-red-500 text-sm">{errors.phone}</div>
    ) : null}
  </LabelInputContainer>
  <LabelInputContainer className="mb-4">
    <Label htmlFor="password">Password</Label>
    <Input
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

  <LabelInputContainer className="mb-4">
    <Label htmlFor="confirmPassword">Confirm Password</Label>
    <Input
      name="confirmPassword"
      placeholder="Enter your password here"
      type="password"
      onChange={handleChange}
      onBlur={handleBlur}
      value={values.confirmPassword}
    />
    {touched.confirmPassword && errors.confirmPassword ? (
      <div className="text-red-500 text-sm">{errors.confirmPassword}</div>
    ) : null}
  </LabelInputContainer>
    


  <button
    className="bg-gradient-to-br relative group/btn mt-10 from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
    type="submit"
  >
    Sign Up
    <BottomGradient />
  </button>


  <div className="mt-2 text-center">
    <button type="button" className="text-sm">Have an account? 
      <Link to='/'>
      <span className="hover:underline text-gray-500"> Login</span>
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

const LabelInputContainer = ({
  children,
  className,
}) => {
  return (
      <div className={cn("flex flex-col space-y-2 w-full", className)}>
          {children}
      </div>
  );
};