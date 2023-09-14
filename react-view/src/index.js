import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css'

import Form from './pages/wfh_portal/form/form.js';
import AdminView from './pages/wfh_portal/admin/admin.js';
import Tasks from './pages/tasks/tasks.js';
import Registry from './pages/registry/registry.js';
import Home from './pages/home/home.js';
import Menu from './pages/home/menu.js';
import Login from './pages/login/login.js';

export const API_URL = "http://localhost"

function Route({setOnLoginPage}) {
  const path = window.location.pathname;
  const loggedIn = sessionStorage.getItem("loggedin");

  if (path == "/incorrect") {
    setOnLoginPage(true);
    return <p>incorrect credentials</p>
  }
  else if (path == "/error") {
    setOnLoginPage(true);
    return <p>An internal server error occurred. Try again.</p>
  }
  
  if (loggedIn == 1) {
    if (path === '/') {
      return React.createElement(Home);
    } 
    else if (path === "/wfh-form") {
      return React.createElement(Form);
    }
    else if (path === "/registry" && sessionStorage.getItem("admin") == "true") {
      return React.createElement(Registry);
    } 
    else if (path === "/tasks") {
      return React.createElement(Tasks);
    }
    else {
      window.location.href = "/";
    }
  }
  else if (loggedIn == null) {
    setOnLoginPage(true);
    if (path != "/login") {
      window.location.href = "/login";
    }
    return React.createElement(Login)
  } 
  else {
    setOnLoginPage(true);
    sessionStorage.clear();
    return <div><p>error</p></div>
  }
}

function App() {
  const [onLoginPage, setOnLoginPage] = React.useState(false);

  return (
    <div className="bigboi">
      {onLoginPage ? <div></div> : <Menu />}
      <Route 
      setOnLoginPage={setOnLoginPage}
      />
    </div>
  );
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />    
);