/* @deprecated */

import React, { useState, useEffect, useContext, createContext } from "react";
import { useDispatch } from "react-redux";
import { setLoading, setUser } from "../store/usersSlice";
import API from "../api/config";

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
/* @deprecated, moved to Redux store and ActionsContext */
export const useAuth = () => {
  return useContext(AuthContext);
};

// hook that handles auth state
function useProvideAuth() {
  const [user, setUserState] = useState(null);
  const [loading, setLoadingState] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    //login(null).then(() => setLoadingState(false));
  }, []);

  async function sendAuthRequest(url, formData) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "X-CSRFToken": API.csrftoken() },
      body: formData,
    });
    dispatch(setLoading(false));
    if (response.ok) {
      const user = await response.json();
      dispatch(setUser(user));
      return null;
    } else if (response.status === 406) {
      const formErrors = await response.json();
      return {
        status: response.status,
        ...formErrors,
      };
    } else {
      return {
        status: response.status,
        error: await response.text(),
      };
    }
  }

  async function register(formData) {
    dispatch(setUser({ id: 0, username: "test" }));
    dispatch(setLoading(false));
    return null;
    return await sendAuthRequest(API.register, formData);
  }

  async function login(formData) {
    return await sendAuthRequest(API.login, formData);
  }

  async function logout() {
    const response = await fetch(API.logout);
    if (response.ok) {
      window.location.replace("/");
    } else {
      console.error("Logout error: ", await response.text());
    }
  }

  return {
    loading,
    user,
    register,
    login,
    logout,
  };
}
