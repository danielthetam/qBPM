import React from 'react';
import axios from 'axios';
import './profile.css';
import {API_URL, dateToString} from '../../index.js';

function Profile({profileEid}) {
    const [profileDetails, setProfileDetails] = React.useState({})

    React.useEffect(() => {
        axios.get(API_URL + "/employee/employees?employeeEid=" + profileEid).then((response) => {
            response = response.data
            var newProfileDetails = {}
            for (const [key, value] of Object.entries(response)) {
                newProfileDetails[key] = value.toString();
            }
            setProfileDetails(newProfileDetails);
        })
    }, [])

    return (
        <div className="profile-container">
            <div className="profile-card">
                <img className="profile-image" src={"data:image/png;base64,"+profileDetails["photo"]}></img>
                <div className="profile-details">
                    <div className="profile-detail-container">
                        <label>Name: </label>
                        <p>{profileDetails["name"]}</p>
                    </div>
                    <div className="profile-detail-container">
                        <label>Employee Identification: </label>
                        <p>{profileDetails["eid"]}</p>
                    </div>
                    <div className="profile-detail-container">
                        <label>Email: </label>
                        <p>{profileDetails["email"]}</p>
                    </div>
                    <div className="profile-detail-container">
                        <label>Role: </label>
                        <p>{profileDetails["role"]}</p>
                    </div>
                    <div className="profile-detail-container">
                        <label>Department: </label>
                        <p>{profileDetails["department"]}</p>
                    </div>
                    <div className="profile-detail-container">
                        <label>Onboarding Date: </label>
                        <p>{dateToString(parseInt(profileDetails["datejoined"]))}</p>
                    </div>
                    <div className="profile-detail-container">
                        <label>Is Admin: </label>
                        <p>{profileDetails["isAdmin"]}</p>
                    </div>
                    {sessionStorage.getItem("admin") == "true" ?
                    <input type="button" value="Edit" onClick={() => {window.location.href = "/employee-edit/"+profileEid}}></input>: <div></div>
                    }
                </div>
            </div>
        </div>
    )
}


export default Profile;