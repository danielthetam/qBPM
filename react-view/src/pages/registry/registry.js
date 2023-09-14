import React from 'react';
import axios from 'axios';

import './registry.css';
import {API_URL} from '../../index.js';

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

function PasswordDisplay({eid, password}) {
  return (
    <div className="registry-pd-container">
      <div className="registry-pd-node">
        <label>Employee Identification : </label>
        <p>{eid}</p>
      </div>

      <div className="registry-pd-node">
        <label>Employee Password : </label>
        <p>{password}</p>
      </div>
    </div>
  )
}

function Registry() {
  const [selectedGroupList, setSelectedGroupList] = React.useState([]) // An array of selected groups displayed in the Selection node
  const [displayPassword, setDisplayPassword] = React.useState(false);
  const [passwordDetails, setPasswordDetails] = React.useState({});

  function onSubmit(event) {
    event.preventDefault();
    var date = reverseString(document.getElementById("date").value);
    var pic = document.getElementById("photo").files;

    const reader = new FileReader();

    reader.readAsBinaryString(pic[0])

    reader.onloadend = (event) => {
      var newPic = btoa(event.target.result)
      const body = {
        "name" : document.getElementById("name").value,
        "email" : document.getElementById("email").value,
        "role" : document.getElementById("role").value,
        "department" : selectedGroupList,
        "datejoined" : parseInt(date),
        "admin" : document.getElementById("isadmin").checked,
        "photo" : newPic
      }

      axios.post(API_URL + "/employee/employees", body).then((response) => {
        setDisplayPassword(true);
        setPasswordDetails(response.data);
      })
    }
  }

  React.useEffect(() => {
    try {
      document.getElementById("registry-form").addEventListener('submit', (event) => {
        event.preventDefault();
      })
    } catch {
      return;
    }
  }, [])

  if (!displayPassword) {
    return (
      <div className="registry-page">
        <form id="registry-main-form" onSubmit={(event) => onSubmit(event)}>
          <div className="registry-main-form-container">
            <div className="registry-basic-information">
              <div className="registry-title-container">
                <label className="registry-title">Registration</label>
              </div>
              <div className="registry-basic-information-content">
                <label>Employee Name</label>
                <input id="name" type="text" required></input>

                <label>Employee Email</label>
                <input id="email" type="email" required></input>

                <label>Employee Role</label>
                <input id="role" type="text" required></input>

                <label>Onboarding Date</label>
                <input id="date" type="date" required></input>

                <label>Employee Admin</label>
                <div className="registry-admin-checkbox">
                  <input id="isadmin" type="checkbox"></input>
                  <label>Is Admin</label>
                </div>
                <br></br>
                <label>Employee Photo</label>
                <input id="photo" accept="image/png, image/jpeg" type="file" required></input>
              </div>
            </div>
            <div className="registry-other-information">
              <form id="registry-form">
              <SelectDropbox
              selectedGroupList={selectedGroupList}
              setSelectedGroupList={setSelectedGroupList}
              />
              </form>

              <input className="registry-submit-btn" type='submit' value="Register"></input> 
            </div>

          </div>
        </form>
      </div>
    )
  } 
  else {
    return (
    <div className="registry-page">
    <PasswordDisplay
    eid={passwordDetails.eid} 
    password={passwordDetails.password}
    />
    </div>
    )
  }
}


export default Registry;