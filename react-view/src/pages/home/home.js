import React from 'react';
import './home.css'
import axios from 'axios';
import {API_URL} from '../../index.js'

function Home() {
  const [name, setName] = React.useState("USERNAME")

  React.useEffect(() => {
    axios.get(API_URL + "/employee/employees?employeeEid=" + sessionStorage.getItem("eid")).then((response) => {
      setName(response.data["name"])
    })
  }, [])
  return (
    <div className="home-container">
      <div className="home-cover"></div>
      <div className="home-title">
        <h1>qBPM</h1>
        <h2>Welcome</h2>
        <h3>To our quality Business Process Manager</h3>
        <h3>{name}</h3>
      </div>
    </div>
    )
}


export default Home;