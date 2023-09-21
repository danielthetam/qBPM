import React from 'react';
import axios from 'axios';

import './employees.css';
import {API_URL} from '../../index.js';

function EmployeeNode({employee}) {
    return (
        <div className='employee-node-container'>
            <img className="employees-employee-image" src={"data:image/png;base64,"+ employee["photo"]}></img>
            <div className="employee-node-details">
            <p className='employees-name'>{employee["name"]}</p>
            <p className='employees-eid'>EID: {employee["eid"]}</p>
            </div>
            {sessionStorage.getItem("admin") == "true" ?
              <input type="button" value="Open" onClick={() => {window.location.href = "/employees/"+employee["eid"]}}></input>: <div></div>
            }
        </div>
    )
}

function Employees() {
    const [employeesList, setEmployeesList] = React.useState([])

    React.useEffect(() => {
        axios.get(API_URL + "/employee/employees").then((response) => {
            var response = response.data
            setEmployeesList(response)
        })
    }, [])

    return (
        <div className="employees-container">
            {employeesList.map((employee) => {
                return (
                    <EmployeeNode 
                        employee={employee}
                    />
                )
            })}
        </div>
    )
}

export default Employees;