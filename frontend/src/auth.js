import React, { useState, useEffect, useContext, createContext } from "react";
import API from "./api";

/*
useAuth taken from
https://usehooks.com/useAuth/
*/

// create auth context
const AuthContext = createContext();

// context provider component, children cann access context through useAuth hook
export default function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

// hook for children to access auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// hook that handles auth state
function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const register = async (formData) => {
    return await fetch(API.register, {
      method: "POST",
      headers: { "X-CSRFToken": API.csrftoken() },
      body: formData,
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success) {
          setUser(res);
        }
        return res;
      })
      .catch(() => console.error("register error"));
  };

  const login = async (formData) => {
    try {
      const response = await fetch(API.login, {
        method: "POST",
        headers: { "X-CSRFToken": API.csrftoken() },
        body: formData,
      });
      const res = await response.json();
      if (res.success) {
        setUser(res);
      }
      return res;
    } catch (e) {
      console.error(e, "logging in error");
      return;
    }
  };

  const logout = async () => {
    return await fetch(API.logout)
      .then((res) => {
        if (res.ok) {
          setUser(null);
          console.log("logged out");
        } else {
          console.log("error while logging out");
        }
      })
      .catch((e) => console.error(e, "logout request error"));
  };

  useEffect(() => {
    // on mount send request for current user's data
    // if not authenticated, user is null
    fetch(API.login, {
      method: "POST",
      headers: { "X-CSRFToken": API.csrftoken() },
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success) {
          setUser(res);
          console.log("logged in");
        } else {
          console.log("not logged in");
        }
      })
      .catch((e) => console.error(e, "getting user on mount error"))
      .finally(() => setLoading(false));

    // remove user on unmount
    return () => setUser(null);
  }, []);

  return {
    loading,
    user,
    register,
    login,
    logout,
  };
}
