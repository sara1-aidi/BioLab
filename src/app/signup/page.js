"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/authContext"; // Add auth context

export default function SignUp() {
  const [error, setError] = useState("");
  const [fullName, setFullName] = useState("");
  const router = useRouter();
  const { user } = useAuth(); // Get current user state

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      router.push(user.role === 'admin' ? '/admin/dashboard' : '/patient/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (email, password) => {
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/patient/dashboard`
        }
      });

      if (authError) throw authError;

      // Use upsert instead of update to handle new profiles
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: data.user.id,
          full_name: fullName,
          role: "patient",
          patient_type: "external"
        });

      if (profileError) throw profileError;

      // Redirect directly to patient dashboard
      router.push("/patient");

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pastel-blue-light">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-pastel-blue-dark">
          Create Account
        </h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <AuthForm
            type="signup"
            onSubmit={handleSubmit}
            error={error}
          />
          <p className="text-center mt-4">
            Already have an account?{" "}
            <a href="/signin" className="text-pastel-green-dark font-semibold">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}