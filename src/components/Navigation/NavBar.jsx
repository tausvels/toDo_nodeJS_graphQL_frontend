import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import './navBar.css';
import { AuthContext } from '../../context/auth-context';

function NavBar(props) {
  const {logout} = useContext(AuthContext);
  // const userId = localStorage.getItem("userId");
  return (
    <header className='main-navigation'>
      <div className="main-navigation__logo">
        <h1>Easy ToDo</h1>
      </div>
      <nav className="main-navigation__items">
        <ul>
          {/* <li><NavLink to="/tasks">All ToDo Items</NavLink></li> */}
          <li><a href="/tasks">All ToDo Items</a></li>
          {/* {!authState.token && <li><NavLink to="/auth">Authenticate</NavLink></li>} */}
          {!localStorage.getItem("userId") && <li><NavLink to="/auth">Login</NavLink></li>}
          {localStorage.getItem("userId") && (
            <>
              <li><button onClick={logout}>Logout</button></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default NavBar;