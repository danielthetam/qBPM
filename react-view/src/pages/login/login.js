import React from 'react';
import './login.css'
import axios from 'axios';
import {API_URL} from '../../index.js';

// TODO store employee details in session storage to prevent constant calling
// TODO make the list of employees page and also the employee profile page

// TODO add that admin and eid should be in server session storage instead of client session storage
// TODO include that you need to bypass user authentication and that you need to establish a system account for authentication for task completion

function Login() {
  var eidDone = false;

  function validateCredentials(eid, password) {
    const body = {
      "eid" : eid,
      "password" : password

    }
    axios.post(API_URL + "/employee/login", body).then((response) => {
      if (response.data == true) {
        axios.get(API_URL + "/employee/employees?employeeEid=" + eid).then((response) => {
          sessionStorage.setItem("admin", response.data["isAdmin"])
          sessionStorage.setItem("loggedin", 1)
          sessionStorage.setItem("eid", eid)
          window.location.replace("/");
        })
      } 
      else if (response.data == false) {
        window.location.href = "/incorrect"
      }
      else {
        window.location.href = "/error"
      }
    }).catch(() => window.location.href = "/error")
  }


  function animateForm(event) {
    event.preventDefault();
    const eid = document.getElementById("login-eid");
    const password = document.getElementById("login-password");
    if (eidDone == true && password.value != '') {
      validateCredentials(eid.value, password.value);
      return;
    }
    else if (eidDone == false && eid.value != '') {
      eidDone = true;
      document.getElementById("login-eid").style.animation = "leftSlide 2s";
      document.getElementById("login-eid").style.animationFillMode = "forwards";
      document.getElementById("login-password").style.animation = "leftSlide2 2s";
      document.getElementById("login-password").style.animationFillMode = "forwards";
      document.getElementById("login-btn").innerHTML = "Sign In";
    } 
    else {
      var el = document.getElementById("login-pointer");
      console.log('again')
      var newNode = document.getElementById("login-pointer").cloneNode();
      newNode.innerHTML = "swipe_left_alt";
      el.parentNode.replaceChild(newNode, document.getElementById("login-pointer"));
      document.getElementById("login-pointer").style.animationName = "pointerMove";
      document.getElementById("login-pointer").style.animationDuration = "3s";
    }
  }

  return (
    <div className='login-container'>
      <div className="login-left-block"></div>
      <div className='login-form-container'>
        <label className="login-form-title">qBPM</label>
        <p className="login-description">Sign in to your qBPM</p>
        <form>
          <input id="login-eid" placeholder="Enter employee id" type="text"></input>
          <input id="login-password" placeholder="Enter password" type="password"></input>
          <i id="login-pointer" className="material-icons">swipe_left_alt</i>
          <button id="login-btn" onClick={(event) => animateForm(event)}>Next</button>
        </form>
      </div>
      <div className="login-right-block"></div>
    </div>
    )
}


export default Login;