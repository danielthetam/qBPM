import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css'

import Form from './pages/wfh_portal/form/form.js';
import Tasks from './pages/tasks/tasks.js';
import Registry from './pages/registry/registry.js';
import Home from './pages/home/home.js';
import Menu from './pages/home/menu.js';
import Login from './pages/login/login.js';
import Profile from './pages/profile/profile.js';

export const API_URL = "http://localhost" // Base url for our spring boot api

// Routes users to valid pages based on their path and login status
function Route({setOnLoginPage}) {
  const path = window.location.pathname;
  const loggedIn = sessionStorage.getItem("loggedin"); // 1 = true, 0 = false

  if (path == "/incorrect") { // A page redirected to from the login page when you input incorrect credentials
    setOnLoginPage(true);
    return <p>incorrect credentials</p>
  }
  else if (path == "/error") {
    setOnLoginPage(true);
    return <p>An internal server error occurred. Try again.</p>
  }
  
  if (loggedIn == 1) {
    var pathArray = path.split("/")
    if (path === '/') {
      return React.createElement(Home);
    } 
    else if (path === "/wfh-form") {
      return React.createElement(Form);
    }
    else if (path === "/registry" && sessionStorage.getItem("admin") == "true") { // only admins can register new employees
      return React.createElement(Registry);
    } 
    else if (path === "/tasks") {
      return React.createElement(Tasks);
    }
    else if (pathArray[1] == "employees") {
      return React.createElement(Profile, {profileEid : pathArray[2]})
    }
    else {
      window.location.href = "/";
    }
  }
  else if (loggedIn == null) {
    setOnLoginPage(true);
    if (path != "/login") { // any page they try to go to while not logged in, they are directed to the login page
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
      {onLoginPage ? <div></div> : <Menu />} {/* if they are not logged in, don't display the menu */}
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