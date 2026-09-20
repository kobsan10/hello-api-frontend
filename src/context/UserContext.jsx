import { createContext, useEffect, useRef, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

// Matches ADMIN_ID on the backend: the env-configured admin is not a database user.
const ADMIN_ID = "-1";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const isInit = useRef(false);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginErrorMsg, setLoginErrorMsg] = useState("");
  const [isLogInError, setIsLoginError] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (isInit.current) return;
    isInit.current = true;
    me();
  }, []);

  const me = async () => {
    const result = await fetch(`${API_URL}/api/me`, {
      credentials: "include",
    });
    if (result.ok) {
      const data = await result.json();
      console.log("==>user data: ", data);
      setUser(data.user);
      setIsLoggedIn(true);
    }
    setIsInitializing(false);
  };

  const login = async (email, password) => {
    const body = {
      email: email,
      password: password,
    };
    console.log("==>Login body: ", body);
    const result = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(body),
    });
    if (result.ok) {
      const data = await result.json();
      setUser(data.user);
      setIsLoggedIn(true);
      return true;
    } else {
      const errData = await result.json();
      console.log("==>Login failed: ", errData.error);
      setIsLoggedIn(false);
      setIsLoginError(true);
      setLoginErrorMsg(errData.error);
      return false;
    }
  };

  const logout = async () => {
    const result = await fetch(`${API_URL}/api/auth/logout`, {
      method: "GET",
      credentials: "include",
    });
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        isLoggedIn,
        isLogInError,
        loginErrorMsg,
        isInitializing,
        isAdmin: user?.id === ADMIN_ID,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
