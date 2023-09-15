import React from 'react';
import './tasks.css'
import axios from 'axios';
import {API_URL} from '../../index.js';


// The display view for when a wfh task is opened
function WFHTaskDisplay({displayWFHDisplay, setDisplayWFHDisplay}) {
    // contains task input content as a dict
    const [taskContent, setTaskContent] = React.useState({})
    // States whether the request obj exists in the task input, if not, it's the task for HR team to assign department manager
    const [nullRequest, setNullRequest] = React.useState(true);
    // If the user is opening the task for his own work from home request, eid is same, don't render the control buttons
    const [eidSame, setEidSame] = React.useState(false);


    // PUT MAPPING, the url to update the task with the given input from user
    const taskOutputUrl = API_URL + "/proxy/tasks/output?taskInstanceId=" + displayWFHDisplay[1] + "&containerId=" + displayWFHDisplay[2]

    React.useEffect(() => {
        // get task input values
        axios.get(API_URL + '/proxy/tasks/input?taskInstanceId=' +
            displayWFHDisplay[1]  + "&" +
            "containerId=" + displayWFHDisplay[2]
        )
        .then((response) => {
            var response = response.data
            var newTaskContent = {}

            var employeeObj = response["employee"]
            var employeeInput = employeeObj[Object.keys(employeeObj)[0]]
            for (const [key, value] of Object.entries(employeeInput)) {
                newTaskContent[key] = value;
            }
            
            var requestObj = response["request"]
            if (requestObj != null) {
                var requestInput = requestObj[Object.keys(requestObj)[0]]
                for (const [key, value] of Object.entries(requestInput)) {
                    newTaskContent[key] = value;
                }
                setNullRequest(false);
            }
            if (employeeInput["eid"] == sessionStorage.getItem("eid")) {
                setEidSame(true)
            }
            setTaskContent(newTaskContent)
        }
        )
    }, [])

    // Handles 'approve and reject' tasks
    function handleApprovals(e) {
        var btnValue = e.target.value
        var taskName = displayWFHDisplay[3]
        if (taskName == "Manual Filtering") {
            if (btnValue == "reject") {
                axios.put(taskOutputUrl, {"hasBeenValidated" : false}).then(() => {window.location.reload()})
            } else if (btnValue == "approve") {
                axios.put(taskOutputUrl, {"hasBeenValidated" : true}).then(() => {window.location.reload()})
            }

        } else if (taskName == "Department Manager Approval") {
            if (btnValue == "reject") {
                axios.put(taskOutputUrl, {"hasBeenApproved" : false}).then(() => {window.location.reload()})
            } else if (btnValue == "approve") {
                axios.put(taskOutputUrl, {"hasBeenApproved" : true}).then(() => {window.location.reload()})
            }
        }
    }

    // Handles manager assignment task
    function handleAssignment() {
        var assignmentInput = document.getElementById("tasks-manager-assignment").value
        axios.put(taskOutputUrl, {"manager" : assignmentInput}).then(() => {window.location.reload()})
    }

    return (
        <div className="tasks-task-view">
            <button className="tasks-close-task-btn" onClick={() => setDisplayWFHDisplay([false])}>x</button>
            <div className="tasks-task-view-content">
                <h1>Request Content</h1>
                <label>Employee Identification</label>
                <a className="tasks-a" href={'/employees/' + taskContent.eid}><p>{taskContent.eid}</p></a>
                <label>Employee Name</label>
                <p>{taskContent.name}</p>
                <label>Employee Email</label>
                <p>{taskContent.email}</p>
                { !nullRequest ?
                    <div>
                        <label>Request Reason</label>
                        <p>{taskContent.reason}</p>
                        <label>Request Date</label>
                        <p>{taskContent.reqDt}</p>
                        <label>Request Number of Days</label>
                        <p>{taskContent.numOfDays}</p> 

                        {!eidSame ?
                        <div className="tasks-control-btn-container">
                            <input type="button" value="approve" onClick={(e) => handleApprovals(e)} className="tasks-approve-btn"></input>
                            <input type="button" value="reject" onClick={(e) => handleApprovals(e)} className="tasks-reject-btn"></input>
                        </div> : <div></div>
                        } 

                    </div> 
                    :
                    <div>
                        <h1>Fill Information</h1>
                        <input id="tasks-manager-assignment" placeholder="Manager EID" type="text"></input>
                        <br></br>
                        <button className="tasks-manager-assignment-btn" onClick={() => handleAssignment()}>SUBMIT</button>
                    </div>
                }
            </div>
        </div>
    )

}

// Displays each task as a node in the list of tasks
function TaskNode({taskData, setDisplayWFHDisplay, wfhPortalProcessId}) {
    return (
        <div className="tasks-task-node">
            <div className="tasks-content-container">
                <h3>{taskData.name}</h3>
                <p>{taskData.subject}</p>
                <p className="task-id">ID: {taskData.id}</p>
            </div>
            { taskData.process == wfhPortalProcessId ? // If it's a WFH task or any task we're coded to handle with, allow user to open it
            <button className="tasks-open-task-btn" onClick={() => {setDisplayWFHDisplay([true, taskData.id, taskData.container, taskData.name])}}>open</button>
            :
            <div></div>
            }
        </div>
        )
}

function Tasks() {
    const [taskDataState, setTaskDataState] = React.useState([]) // Contains a list of tasks as dicts
    // BOOL that states whether we should display WFHTaskDisplay
    const [displayWFHDisplay, setDisplayWFHDisplay] = React.useState([false]) 

    const wfhPortalProcessId = "WFHRequest-Portal.request-portal";

    React.useEffect(() => {
        axios.get(API_URL + '/proxy/tasks?eid=' + sessionStorage.getItem("eid")).then((response) => {
                var taskList = response.data["task-summary"]
                var taskData = []
                for (let i=0; i<taskList.length; i++) {
                    var task = taskList[i]
                    taskData.push({
                        "name" : task["task-name"],
                        "subject" : task["task-subject"],
                        "process" : task["task-proc-def-id"],
                        "container" : task["task-container-id"],
                        "id" : task["task-id"],
                        "form" : task["task-form"]
                    })
                }

                setTaskDataState(taskData)
            }
        )
    }, [displayWFHDisplay])

    return (
        <div className="tasks-page-container">
            {!displayWFHDisplay[0] ? 
                <div></div> 
                : 
                <WFHTaskDisplay 
                displayWFHDisplay={displayWFHDisplay}
                setDisplayWFHDisplay={setDisplayWFHDisplay}
                />
            }
            <h1>Your Tasks</h1>
            <div className="tasks-all-tasks">
                <div className="tasks-wfh-tasks">
                    <h2>Work From Home Request Portal</h2>
                    {
                        taskDataState.map((task) => {
                            if (task.process == wfhPortalProcessId) {
                                var taskData = task
                                delete taskDataState[taskDataState.indexOf(task)]
                                return (
                                    <TaskNode
                                    taskData={taskData}
                                    setDisplayWFHDisplay={setDisplayWFHDisplay}
                                    wfhPortalProcessId={wfhPortalProcessId}
                                    />
                                )
                            } 
                        })
                    }
                </div>

                <div className="tasks-other-tasks">
                    <h2>Other Tasks</h2>
                    {
                        taskDataState.map((task) => {
                            return (
                                <TaskNode
                                taskData={task}
                                setDisplayWFHDisplay={setDisplayWFHDisplay}
                                wfhPortalProcessId={wfhPortalProcessId}
                                />
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}


export default Tasks;