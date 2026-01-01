"use client";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import AuthForm from "../components/AuthForm";

export default function SignIn() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (email, password) => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;

    // Fetch the user's profile to get their role
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", authData.user.id)
      .single();

    if (profileError) throw profileError;

    if (profile.role === "admin") {
      router.push("/admin");
    } else if (profile.role === "patient") {
      router.push("/patient");
    } else {
      setError("Role not recognized.");
    }
  } catch (err) {
    setError(err.message);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-pastel-blue-light">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-pastel-blue-dark">
          Welcome Back
        </h1>
        <AuthForm
          type="signin"
          onSubmit={handleSubmit}
          error={error}
        />
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <a href="/signup" className="text-pastel-green-dark font-semibold">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}