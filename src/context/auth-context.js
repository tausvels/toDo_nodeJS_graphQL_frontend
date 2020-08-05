import React, { createContext, useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';


export const AuthContext = createContext(null);

export const AuthContextProvider = (props) => {
  const history = useHistory();
  const [authState, setAuthState] = useState({ token: null,  userId: null, email: null});

  const login = (token, userId, email, tokenExpiration) => {
    localStorage.setItem("userId", userId);
    localStorage.setItem("email", email);
    localStorage.setItem("token", token)
    const userIdInLocalStorage = localStorage.getItem("userId");
    const emailInLocalStorage = localStorage.getItem("email");
    const tokenFromLocalStorage = localStorage.getItem("token");
    setAuthState(prevState => ({
      ...prevState,
      token: tokenFromLocalStorage,
      userId: userIdInLocalStorage,
      email: emailInLocalStorage
    }));
    history.push('/tasks');
  };

  const logout = () => {
    localStorage.clear();
    setAuthState(prevState => ({
      ...prevState,
      token: null,
      userId: null,
      email: null
    }));
  }
  return (
    <AuthContext.Provider value={{authState, login, logout}}>
      {props.children}
    </AuthContext.Provider>
  )
}