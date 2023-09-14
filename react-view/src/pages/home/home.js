import React from 'react';
import './home.css'

function redirect(url, safe) {
  if (!safe) {
    window.location.href = url;
  } else {
    window.location.replace(url);
  }
}

function Home() {
  return (
    <div className="home-container">
      <div className="home-cover"></div>
      <div className="home-title">
        <h1>qBPM</h1>
        <h2>Welcome</h2>
        <h3>To our quality Business Process Manager</h3>
        <h3>User {sessionStorage.getItem("eid")}</h3>
      </div>
    </div>
    )
}


export default Home;