import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("admin@samarpit.org");
    const [password, setPassword] = useState("Admin@123");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(email, password);
            navigate("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-lg"
            >
                <h1 className="text-2xl font-bold text-slate-800">Admin Login</h1>
                <p className="mt-1 text-sm text-slate-500">Sign in to manage students and employees.</p>

                <div className="mt-4 space-y-3">
                    <input
                        className="w-full rounded border px-3 py-2"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        className="w-full rounded border px-3 py-2"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className="mt-4 w-full rounded bg-slate-900 px-4 py-2 text-white"
                >
                    {loading ? "Signing in..." : "Login"}
                </button>
            </form>
        </div>
    );
}
