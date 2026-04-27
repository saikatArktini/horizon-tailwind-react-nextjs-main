"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    console.log("20",form);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Login failed");
      return;
    }

    // Store token (cookie is better later)
    localStorage.setItem("token", data.token);

    // Temporary redirect (later use role-based redirect)
    router.push("/admin/default");
  };

  return (
    <div className="max-w-md mx-auto mt-20 border p-6 rounded space-y-4">
      <h1 className="text-xl font-bold">Login</h1>

      {error && <p className="text-red-600">{error}</p>}

      <input
        className="border px-3 py-2 w-full"
        placeholder="Username"
        name="username"
        value={form.username}
        onChange={handleChange}
      />

      <input
        className="border px-3 py-2 w-full"
        placeholder="Password"
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 w-full rounded"
      >
        Login
      </button>
    </div>
  );
}
