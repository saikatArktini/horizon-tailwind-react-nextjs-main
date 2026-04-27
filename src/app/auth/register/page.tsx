"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    password: "",
    roleId: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: form.username,
        password: form.password,
        roleId: Number(form.roleId),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Registration failed");
      return;
    }

    alert("User registered successfully");
    router.push("auth/login");
  };

  return (
    <div className="max-w-md mx-auto mt-20 border p-6 rounded space-y-4">
      <h1 className="text-xl font-bold">Register User</h1>

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

      <input
        className="border px-3 py-2 w-full"
        placeholder="Role ID"
        name="roleId"
        value={form.roleId}
        onChange={handleChange}
      />

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-4 py-2 w-full rounded"
      >
        Register
      </button>
    </div>
  );
}
