import React, { createContext, useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';


export const AuthContext = createContext(null);

export const AuthContextProvider = (props) => {
  const history = useHistory();
  const [authState, setAuthState] = useState({ token: null,  userId: null, email: null});

  const login = (token, userId, email, tokenExpiration) => {
    localStorage.setItem("userId", userId);
    localStorage.setItem("email", email);
    const userIdInLocalStorage = localStorage.getItem("userId");
    const emailInLocalStorage = localStorage.getItem("email");
    setAuthState(prevState => ({
      ...prevState,
      token: token,
      userId: userIdInLocalStorage,
      email: emailInLocalStorage
    }));
    history.push('/tasks');
  };

  const logout = () => {
    // localStorage.removeItem("userId");
    // localStorage.removeItem("email");
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