import React from 'react';
import axios from 'axios';

import './employee-edit.css';
import {API_URL, dateToString} from '../../index.js';

// Node representing a selected group
function SelectedNodes({name, removeFromSelectedFunction}) {
  return (
    <div className="selectdropbox-node-container">
      <p className="selectdropbox-node-text">{name}</p>
      <input type="button" onClick={() => removeFromSelectedFunction(name)} value="x" className="selectdropbox-remove-node"></input>
    </div>
  )
}

// Displays selected groups 
function Selection({groupList, removeFromSelectedFunction, toggleDropdown, dropdown}) {
  let isSelectedEmpty = false;
  if (groupList.length <= 0) {
    isSelectedEmpty = true;
  }

  return (
      <div className="selectdropbox-selection-container">
        {!isSelectedEmpty ? 
          <p></p>:<p className="selection-description">Add group or department</p>
        }
        <button className="selectdropbox-selection-container-btn" onClick={() => toggleDropdown()}>v</button>
        {
          groupList.map((groupName) => {
            return (
              <SelectedNodes
              name={groupName}
              removeFromSelectedFunction={removeFromSelectedFunction}
              />
            )
          })
        }
      </div>
  )
}

// Dropdown that displays groupList as buttons
function Dropdown({groupList, addToSelected}) {
  return (
    <div className="selectdropbox-dropdown-container">
      <div className="selectdropbox-dropdown-content">
        {
          groupList.map((groupName) =>{
              return (
                <input type="button" onClick={() => addToSelected(groupName)} value={groupName} className="selectdropbox-dropdown-node"></input>
              )
            }
          )
        }
      </div>
    </div>
  )
}

function SelectDropbox({selectedGroupList, setSelectedGroupList}) { // Main Node for Group/Department Field
// Fetches group options from api and displays as selectable dropbox

  const [groupList, setGroupList] = React.useState([]) // An array of groups displayed as a dropdown
  const [dropdown, setDropdown] = React.useState(false) // Boolean that controls when dropdown is displayed

  // Remove from the array of selected options
  function removeFromSelected(groupName) {
    let newSelectedGroupList = [...selectedGroupList];

    let index = newSelectedGroupList.indexOf(groupName);
    newSelectedGroupList.splice(index, 1);

    setSelectedGroupList(newSelectedGroupList);
  }

  // Add to the array of selected options
  function addToSelected(groupName) {
    var newSelectedGroupList = [...selectedGroupList];
    if (newSelectedGroupList.includes(groupName)) { // If it's already in the selected options, don't do anything
      return;
    } // otherwise, add it 
    newSelectedGroupList.push(groupName);
    setSelectedGroupList(newSelectedGroupList);
  }

  function toggleDropdown() {
    setDropdown(!dropdown);
  }

  React.useEffect(() => {
      axios.get(API_URL + "/proxy" + "/groups").then((response) => {
        setGroupList(response.data);
      })
    }, [])

  return (
    <div className="selectdropbox-container">
      <Selection
      groupList={selectedGroupList}
      removeFromSelectedFunction={removeFromSelected}
      toggleDropdown={toggleDropdown}
      dropdown={dropdown}
      />
      {dropdown ?
        <Dropdown
        addToSelected={addToSelected}
        groupList={groupList}
        /> : <div></div>
      }
    </div>
  )
}

function reverseString(string) {
  var splitString = string.split("-");
  var reversedArray = splitString.reverse();
  var reversedString = reversedArray.join("");

  return reversedString;
}

function EmployeeEdit({employeeEid}) {
  const [selectedGroupList, setSelectedGroupList] = React.useState([]) // An array of selected groups displayed in the Selection node
  const [employeeDetails, setEmployeeDetails] = React.useState({})

  function onSubmit(event) {
    event.preventDefault();
    var date = reverseString(document.getElementById("date").value);
    const body = {
    "eid" : employeeEid,
    "name" : document.getElementById("name").value,
    "email" : document.getElementById("email").value,
    "role" : document.getElementById("role").value,
    "department" : selectedGroupList,
    "datejoined" : parseInt(date),
    "admin" : document.getElementById("isadmin").checked,
    // "photo" : newPic
    }

    axios.put(API_URL + "/employee/employees", body).then((response) => {
    })
    if (employeeEid == sessionStorage.getItem("eid")) {
      sessionStorage.setItem("admin", document.getElementById("isadmin").checked)
    }

    window.location.href = "/employees/" + employeeEid.toString()
  }

  React.useEffect(() => {
    try {
        axios.get(API_URL + "/employee/employees?employeeEid=" + employeeEid).then((response) => {
            var date = response.data["datejoined"]
            date = dateToString(parseInt(date))
            date = date.split("-")
            date = date.reverse()
            date = date.join("-")
            response.data["datejoined"] = date
            setEmployeeDetails(response.data)
            setSelectedGroupList(response.data["department"])
        })
        document.getElementById("registry-form").addEventListener('submit', (event) => {
            event.preventDefault();
        })
    } catch {
      return;
    }
  }, [])

    return (
      <div className="registry-page">
        <form autoComplete="chrome-off" id="registry-main-form" onSubmit={(event) => onSubmit(event)}>
          <div className="registry-main-form-container">
            <div className="registry-basic-information">
              <div className="registry-title-container">
                <label className="registry-title">Employee Editing</label>
              </div>
              <div className="registry-basic-information-content">
                <label>Employee Name</label>
                <input id="name" autoComplete="chrome-off" defaultValue={employeeDetails["name"]} type="text" required></input>

                <label>Employee Email</label>
                <input id="email" autoComplee="chrome-off" defaultValue={employeeDetails["email"]} type="email" required></input>

                <label>Employee Role</label>
                <input id="role" defaultValue={employeeDetails["role"]} type="text" required></input>

                <label>Onboarding Date</label>
                <input id="date" defaultValue={employeeDetails["datejoined"]} type="date" required></input>

                <label>Employee Admin</label>
                {console.log('bla')}
                <div className="registry-admin-checkbox">
                    {employeeDetails["isAdmin"] ?
                    <input defaultChecked id="isadmin" type="checkbox"></input> 
                    :
                    <input id="isadmin" type="checkbox"></input> 
                    }
                  <label>Is Admin</label>
                </div>
                <br></br>
                {/* <label>Employee Photo</label>
                <input id="photo" accept="image/png, image/jpeg" type="file" required></input> */}
              </div>
            </div>
            <div className="registry-other-information">
              <form id="registry-form">
              <SelectDropbox
              selectedGroupList={selectedGroupList}
              setSelectedGroupList={setSelectedGroupList}
              />
              </form>

              <input className="registry-submit-btn" type='submit' value="Push Edits"></input> 
              <input className="employeeEdit-delete-btn" onClick={() => 
                {
                  axios.delete(API_URL + "/employee/employees?employeeEid="+employeeEid); 
                  window.location.href="/employees"; 
                  if (employeeEid == sessionStorage.getItem("eid")) {
                    sessionStorage.clear()
                  }
                }
              } type='button' value="Delete"></input> 
            </div>

          </div>
        </form>
      </div>
    )
}

export default EmployeeEdit