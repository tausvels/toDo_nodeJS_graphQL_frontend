import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

/**
 * IMPORTING SCREENS/COMPONENTS
 */
import NavBar from './components/Navigation/NavBar';
import Auth from "./screens/Auth";
import Tasks from "./screens/Tasks";

import { AuthContextProvider } from './context/auth-context';

function App() {

  return (
    <Router>
      <AuthContextProvider>
        <NavBar />
        <main className='main-content'>
          <Switch>
            <Route exact path='/tasks/' render={ routeProps => <Tasks {...routeProps}/>}></Route>
            <Route exact path='/tasks/:category' render={ routeProps => <Tasks {...routeProps}/>}></Route>
            <Route exact path='/auth' render={ routeProps => <Auth {...routeProps}/>}></Route>
          </Switch>
        </main>
      </AuthContextProvider>
    </Router>
  );
}

export default App;
