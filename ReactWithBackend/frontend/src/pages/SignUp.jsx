import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();

  async function handleFormSubmit(event) {
    event.preventDefault();
    const { email, username, password } = event.target;
    
    try {
      const res = await axios.post("http://localhost:3000/user/signup", {
        email: email.value,
        username: username.value,
        password: password.value,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      console.error("Signup failed:", err);
      alert("Signup failed. Check console.");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <form
        className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-md"
        onSubmit={handleFormSubmit}
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>

        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 font-medium">
            Email
          </label>
          <input
            required
            type="email"
            id="email"
            name="email"
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="username" className="block mb-1 font-medium">
            Username
          </label>
          <input
            required
            type="text"
            id="username"
            name="username"
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your username"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block mb-1 font-medium">
            Password
          </label>
          <input
            required
            type="password"
            id="password"
            name="password"
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
          />
        </div>

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

