import { createContext } from "react";

interface Auth {
  id: string;
  phone_number: string;
  name: string;
}

interface AuthContext {
  auth: undefined | Auth;
  setAuth: React.Dispatch<React.SetStateAction<undefined>>;
}

const AuthContext = createContext<AuthContext>({
  auth: undefined,
  setAuth: () => {}, // Provide a dummy function
});

export default AuthContext;
