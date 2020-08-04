import React, { useState, useRef, useContext } from 'react';
import { AuthContext } from '../context/auth-context';
import "./auth.css";

function Auth(props) {
  const { authState, login} = useContext(AuthContext);
  const emailEl = useRef();
  const passwordEl = useRef();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  async function handleSubmit (e) {
    e.preventDefault();
    const email = emailEl.current.value;
    const password = passwordEl.current.value;
    if (email.trim().length === 0 || password.trim().length === 0) {
      return
    }
    let requestBody = {
      query: `
        query {
          login(email: "${email}", password:"${password}") {
            userId
            email
            token
            tokenExpiration
          }
        }
      `
    };
    if (!isLoggedIn) {
      requestBody = {
        query: `
          mutation {
            createUser(userInput: { email: "${email}", password: "${password}" }) {
              _id
              email
            }
          }
        `
      };
    }
    
    try {
      const result = await fetch("http://localhost:3001/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {  "Content-type": "application/json"  }
    });
      if (result.status !== 200 && result.status !== 201) {console.log('I have failed'); throw new Error ('Failed')}
      
      const resultBody = await result.json();
      if (resultBody.data.login.token) {
        login(
          resultBody.data.login.token, 
          resultBody.data.login.userId,
          resultBody.data.login.email, 
          resultBody.data.login.tokenExpiration
        );
      }
    } catch (err) {
      console.log(err)
      throw err;
    } 
  }
  return (
    <div>
      <form className="auth-form" onSubmit={handleSubmit}>

        <div className="form-control">
          <label htmlFor="email">E-mail</label>
          <input ref={emailEl} id="email" name="email" type="email" placeholder="Enter email" />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input ref={passwordEl} id="password" name="password" type="password" placeholder="Enter password" />
        </div>
        <div className="form-actions">
          <button type='submit'>Submit</button>
          <button type='button' onClick={()=> setIsLoggedIn(prev => !prev)}>
            Switch to {isLoggedIn ? 'SignUp' : 'Login'}
          </button>
          <h3>{authState.userId}</h3>
        </div>
      </form>
    </div>
  );
}

export default Auth;