"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BUSINESS_INFO } from "@/lib/constants";

const ADMIN_PASSWORD = "jrod2024";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("admin_auth", "true");
      router.push("/admin");
    } else {
      setError("Invalid password");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-forest-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-cream-light border border-forest/10 p-8">
        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl font-bold text-forest">
            {BUSINESS_INFO.name}
          </h1>
          <p className="text-forest/60 mt-2">Admin Login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-forest/70 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              className="w-full px-4 py-3 bg-cream border border-forest/20 text-forest placeholder:text-forest/30 focus:outline-none focus:border-forest transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
