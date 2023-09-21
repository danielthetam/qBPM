import React from 'react';
import './login.css'
import axios from 'axios';
import {API_URL} from '../../index.js';

function Login() {
  var eidDone = false; // boolean which states whether the eid has been filled in, if so, let the user fill in their password

  // Called when eid and password has been filled up
  function validateCredentials(eid, password) {
    const body = {
      "eid" : eid,
      "password" : password

    }
    axios.post(API_URL + "/employee/login", body).then((response) => { // post request to login method
      if (response.data == true) {
        axios.get(API_URL + "/employee/employees?employeeEid=" + eid).then((response) => { // get request for employee details

          sessionStorage.setItem("admin", response.data["isAdmin"]) // states whether user is an admin
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

      // animate input fields
      document.getElementById("login-eid").style.animation = "leftSlide 2s";
      document.getElementById("login-eid").style.animationFillMode = "forwards";
      document.getElementById("login-password").style.animation = "leftSlide2 2s";
      document.getElementById("login-password").style.animationFillMode = "forwards";
      document.getElementById("login-btn").innerHTML = "Sign In";
    } 
    else { // if eid and password value are empty
      // animate a pointer to remind them to fill up the field
      var el = document.getElementById("login-pointer");
      var newNode = document.getElementById("login-pointer").cloneNode();

      newNode.innerHTML = "swipe_left_alt";
      el.parentNode.replaceChild(newNode, document.getElementById("login-pointer")); // replace the pointer element with a clone to restart animation
      document.getElementById("login-pointer").style.animationName = "pointerMove";
      document.getElementById("login-pointer").style.animationDuration = "3s";
    }
  }

  return (
    <div className='login-container'>
      <div className="login-left-block"></div> {/* coloured white to hide the input fields for animation */}

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