"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { useAuthStore } from "@/app/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (!username.trim()) {
      setError("Username wajib diisi");
      setLoading(false);
      return;
    }

    if (password.length < 1) {
      setError("Password wajib diisi");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      let data;
      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Server error: ${text.substring(0, 100)}`);
      }

      if (!response.ok) {
        throw new Error(data.error || data.message || "Login failed");
      }

      // Store auth data
      setAuth(data.user, data.access_token);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            WMS Login
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Masuk ke sistem Warehouse Management
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              autoComplete="username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign In"}
          </Button>

          <div className="text-center text-sm text-gray-500 mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="font-medium">Demo credentials:</p>
            <p>Username: <span className="font-mono">admin</span></p>
            <p>Password: <span className="font-mono">admin123</span></p>
          </div>
        </form>
      </div>
    </div>
  );
}
