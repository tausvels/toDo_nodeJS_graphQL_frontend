import React from 'react';

function AuthForm(props) {
  const {
    emailEl, passwordEl, isLoggedIn, setIsLoggedIn, login, handleSubmit
  } = props;
  return (
    <form className="auth-form" onSubmit={(event)=> handleSubmit(event, emailEl, passwordEl, isLoggedIn, login)}>
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
    </div>
  </form>
  );
}

export default AuthForm;