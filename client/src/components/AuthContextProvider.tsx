import { useState } from "react";
import AuthContext from "../context/AuthContext";

export default function AuthContextProvider({ children }: { children: React.ReactNode }) {
    const [auth, setAuth] = useState();

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}
