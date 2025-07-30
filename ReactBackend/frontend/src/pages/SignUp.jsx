import React from "react";
import axios from 'axios'
import {useNavigate} from "react-router-dom";

function SignUp() {

  const navigate=useNavigate();

async function handleFormSubmit(event){
  event.preventDefault();
  const email=event.target.email.value;
  const username=event.target.username.value;
  const password=event.target.password.value;
 
  await axios.post("http://localhost:3000/user/signup",{
    email,
    password,
    username
  }).then((res)=>{
    const data=res.data;
    localStorage.setItem("token",data.token);
    navigate("/");

  }).catch((err)=>{
    console.log(err);
  })
  
  }

  
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <form className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-md"
        onSubmit={handleFormSubmit}>
          
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 font-medium">Email</label>
          <input
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
          />
        </div>

        {/* Username */}
        <div className="mb-4">
          <label htmlFor="username" className="block mb-1 font-medium">Username</label>
          <input
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            name="username"
            id="username"
            placeholder="Enter your username"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label htmlFor="password" className="block mb-1 font-medium">Password</label>
          <input
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-semibold transition duration-200"
        >
          Sign Up
        </button>
      </form>
    </main>
  );
}

export default SignUp;


