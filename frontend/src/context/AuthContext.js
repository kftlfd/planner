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

  useEffect(() => {
    login(null).then(() => setLoading(false));
  }, []);

  async function sendAuthRequest(url, formData) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "X-CSRFToken": API.csrftoken() },
      body: formData,
    });
    const responseClone = response.clone();
    try {
      let res = await response.json();
      if (res.success) setUser(res);
      return res;
    } catch (err) {
      let responseText = await responseClone.text();
      return { serverError: responseText, errorInfo: err.message };
    }
  }

  async function register(formData) {
    return await sendAuthRequest(API.register, formData);
  }

  async function login(formData) {
    return await sendAuthRequest(API.login, formData);
  }

  async function logout() {
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
  }

  return {
    loading,
    user,
    register,
    login,
    logout,
  };
}
