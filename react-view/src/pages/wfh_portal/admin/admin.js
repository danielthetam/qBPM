import React from 'react';
import ReactDOM from 'react-dom/client';
import './admin.css';
import axios from "axios";


function AdminView() {
    const [requests, setRequests] = React.useState([]);

    const [displayMoreReason, setDisplayMoreReason] = React.useState(false);
    const [sorting, setSorting] = React.useState("");
    const [view, setView] = React.useState("Unreviewed")
    const reasonText = React.useRef("");
    React.useEffect(() => {
        getRequests();
        if (displayMoreReason) {
            document.getElementById('read-more-box').innerHTML = reasonText.current;
        }
    }, [displayMoreReason, sorting]);

    const moreReasonClicked = (reason) => {
        reasonText.current = reason;
        setDisplayMoreReason(true);
    }

    const closeMoreReasonClicked = () => {
        reasonText.current = '';
        setDisplayMoreReason(false);
    }

    const approveClicked = async (id) => {
        const request = await axios.get("http://localhost/api/requests/" + id.toString())
        const requestData = request.data;
        await axios.put("http://localhost/api/requests/" + id.toString(), {
            reason : requestData.reason,
            requestDate : requestData.requestDate,
            duration : requestData.duration,
            requester : requestData.requester,
            rejected : false,
            approved : true
        })
        getRequests()
    }

    const rejectClicked = async (id) => {
        const request = await axios.get("http://localhost/api/requests/" + id.toString())
        const requestData = request.data;
        await axios.put("http://localhost/api/requests/" + id.toString(), {
            reason : requestData.reason,
            requestDate : requestData.requestDate,
            duration : requestData.duration,
            requester : requestData.requester,
            rejected : true,
            approved : false
        })
        getRequests()
    }

    const unreviewedClicked = async (id) => {
        const request = await axios.get("http://localhost/api/requests/" + id.toString())
        const requestData = request.data;
        await axios.put("http://localhost/api/requests/" + id.toString(), {
            reason : requestData.reason,
            requestDate : requestData.requestDate,
            duration : requestData.duration,
            requester : requestData.requester,
            rejected : false,
            approved : false
        })
        getRequests()
    }

    const deleteClicked = async (id) => {
        await axios.delete("http://localhost/api/requests/" + id.toString())
        getRequests()
    }

    const getRequests = async () => {
        const request = await axios.get('http://localhost/api/requests' + sorting)
        setRequests(request.data);
    };

    const sortingChange = (e) => {
        const option = e.target.value;
        switch(option) {
            case "Most Recent": 
                setSorting("");
                break;
            case "Request Date Asc": 
                setSorting("/ascdate");
                break;
            case 'Request Date Desc': 
                setSorting("/descdate");
                break;
        }
    }

    const viewChange = (e) => {
        const newView = e.target.value;
        setView(newView);
    }

    return (
        <div className='admin-container'>
            <div className='admin-table-container'>
                <div className='dropdown-menu-container'>
                    <label>View By: </label>
                    <select onChange={(e) => viewChange(e)} className='view-dropdown-menu'>
                        <option>Unreviewed</option>
                        <option>Approved</option>
                        <option>Rejected</option>
                    </select>
                    <label>Sort By:</label>
                    <select onChange={(e) => sortingChange(e)} className='sort-dropdown-menu'>
                        <option>Most Recent</option>
                        <option>Request Date Asc</option>
                        <option>Request Date Desc</option>
                    </select> 
                </div>
                <table className='request-table'>
                    <tbody>
                        <tr>
                            <th>ID</th>
                            <th>Requested By</th>
                            <th>Requested Date</th>
                            <th>Duration</th>
                            <th>Reason</th>
                            <th>State</th>
                            <th>Control</th>
                        </tr>
                        <RequestContainer 
                        view={view}
                        requests={requests}
                        moreReasonClicked={moreReasonClicked}
                        approveClicked={approveClicked}
                        rejectClicked={rejectClicked}
                        unreviewedClicked={unreviewedClicked}
                        deleteClicked={deleteClicked}
                        />
                    </tbody>
                </table>
            </div>
            {displayMoreReason ? (
                <div id='readMorePanel'>
                    <button className='close-more-reason-btn' onClick={() => closeMoreReasonClicked()} type='button'>X</button>
                    <p id='read-more-box'></p>
                </div>
            ) : (
                <div>
                </div>
            )}
        </div>
    )
}

function RequestContainer({view, approveClicked, rejectClicked, unreviewedClicked, deleteClicked, requests, moreReasonClicked}) {
    try {
        const requestsToView =  []
        for(let i=0; i<requests.length;i++) {
            if (view === "Unreviewed") {
                if (!requests[i].approved && !requests[i].rejected) {
                    requestsToView.push(requests[i])
                }
            } else if (view == "Approved") {
                if (requests[i].approved && !requests[i].rejected) {
                    requestsToView.push(requests[i])
                }
            } else if (view == "Rejected") {
                if (!requests[i].approved && requests[i].rejected) {
                    requestsToView.push(requests[i])
                }
            }
        }
        return (
            requestsToView.map((requestObj) => {
                return (
                    <Request 
                    key={requestObj.id}
                    moreReasonClicked={moreReasonClicked}
                    request={requestObj}
                    approveClicked={approveClicked}
                    rejectClicked={rejectClicked}
                    deleteClicked={deleteClicked}
                    unreviewedClicked={unreviewedClicked}
                    />
                )
            })
        )
    } catch (e) {
        console.log(e);
        return (
            <div></div>
        )
    }
}

function Request({approveClicked, rejectClicked, unreviewedClicked, deleteClicked, request, moreReasonClicked}) {
    var reason = request.reason;
    var moreReason = false;
    if (request.reason.length > 250) {
        reason = ''
        const requestReason = request.reason;
        for (let i=0; i<200;i++) {
            reason += requestReason.split('')[i]
        }
        reason += '...'
        moreReason = true;
    }
    

    return (
        <tr>
            <td>{request.id}</td>
            <td>{request.requester}</td>
            <td>{request.requestDate}</td>
            <td>{request.duration}</td>
            {moreReason ? (
                <td className='fantastical'>
                    {reason}
                    <button className='read-more-btn' onClick={() => moreReasonClicked(request.reason)} type='button'>Read More</button>
                </td>
            ) : (
                <td>
                    {reason}
                </td>
            )
            }
            <State 
            request={request}
            />
            <td className='control-btn-container'>
                <button onClick={() => approveClicked(request.id)} className='control-btn' type='button'>APPROVE</button>
                <button onClick={() => rejectClicked(request.id)} id='reject-btn' className='control-btn' type='button'>REJECT</button>
                <button onClick={() => deleteClicked(request.id)} id='delete-btn' className='control-btn' type='button'>DELETE</button>
                <button onClick={() => unreviewedClicked(request.id)} id='unreview-btn' className='control-btn' type='button'>UNREVIEWED</button>
            </td>
        </tr>
    )
}

function State({request}) {
    if (!request.approved && !request.rejected) {
        return (
            <td className='approval-state'>UNREVIEWED</td>
        )
    } else if (request.approved && !request.rejected) {
        return (
            <td className='approval-state'>APPROVED</td>
        )
    } else if (!request.approved && request.rejected) {
        return (
            <td className='approval-state'>REJECTED</td>
        )
    } else {
        return (
            <td className='approval-state'>N/A</td>
        )
    }
}

export default AdminView;