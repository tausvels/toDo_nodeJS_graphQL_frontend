import React, { useState, useRef, useContext } from 'react';
import { AuthContext } from 'context/auth-context';
import { handleSubmit } from './helper';
import AuthForm from 'components/TaskForm/AuthForm';
import "./auth.css";

function Auth(props) {
  const {login} = useContext(AuthContext);
  const emailEl = useRef();
  const passwordEl = useRef();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <div>
      <AuthForm 
        emailEl={emailEl}
        passwordEl={passwordEl}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        login={login}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default Auth;