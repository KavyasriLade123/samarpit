import React, { createContext, useContext, useMemo, useState } from "react";
import { api } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("admin_user");
        return saved ? JSON.parse(saved) : null;
    });

    const login = async (email, password) => {
        const res = await api.login({ email, password });
        localStorage.setItem("admin_token", res.token);
        localStorage.setItem("admin_user", JSON.stringify(res.user));
        setUser(res.user);
    };

    const logout = () => {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        setUser(null);
    };

    const value = useMemo(() => ({ user, login, logout }), [user]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
