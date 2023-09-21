import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';

import './index.css'

import Form from './pages/wfh_portal/form/form.js';
import Tasks from './pages/tasks/tasks.js';
import Registry from './pages/registry/registry.js';
import Home from './pages/home/home.js';
import Menu from './pages/home/menu.js';
import Login from './pages/login/login.js';
import Profile from './pages/profile/profile.js';
import Employees from './pages/employees/employees.js'
import EmployeeEdit from './pages/employee-edit/employee-edit.js'

export const API_URL = "http://localhost" // Base url for our spring boot api

// Routes users to valid pages based on their path and login status
function Route({setOnLoginPage}) {
  const path = window.location.pathname;
  const loggedIn = sessionStorage.getItem("loggedin"); // 1 = true, 0 = false
  const [employeesExist, setEmployeesExist] = React.useState(true)

  React.useEffect(() => {
    axios.get(API_URL + "/employee/employees").then((response) => {
      var response = response.data
      if (response.length == 0) {
        setEmployeesExist(false)
      }
    })
  }, [])

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
    else if (path === "/employees") {
      return React.createElement(Employees)
    }
    else if (pathArray[1] == "employees") {
      return React.createElement(Profile, {profileEid : pathArray[2]})
    } 
    else if (pathArray[1] == "employee-edit") {
      return React.createElement(EmployeeEdit, {employeeEid : pathArray[2]})
    } 
    else {
      window.location.href = "/";
    }
  }
  else if (loggedIn == null) {
    setOnLoginPage(true);
    if (employeesExist == true) {
      if (path != "/login") { // any page they try to go to while not logged in, they are directed to the login page
        window.location.href = "/login";
      }
      return React.createElement(Login)
    } 
    else if (employeesExist == false) {
        return React.createElement(Registry);
    }
  } 
  else {
    setOnLoginPage(true);
    sessionStorage.clear();
    return <div><p>error</p></div>
  }
}

export function dateToString(date) {
    var dateString = date.toString()
    if (dateString.length % 2 == 0) {
        return (dateString.slice(0, 2) + "-" + dateString.slice(2, 4) + "-" + dateString.slice(4, 8))
    }
    else {
        return ("0" + dateString.slice(0, 1) + "-" + dateString.slice(1, 3) + "-" + dateString.slice(3, 7))
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