function redirect(url, safe) {
  if (!safe) {
    window.location.href = url;
  } else {
    window.location.replace(url);
  }
}

function Menu() {
    return (
        <div className='home-menu-container'>
              <button title="Home" onClick={() => redirect("/")} className='home-homebtn'>
            <i className="material-icons">home</i>
            </button>
            <button title="Your Tasks" className='home-tasksbtn' onClick={() => redirect("/tasks")}>
              <i className="material-icons">task</i>
            </button>
            <button title="Work From Home Request Portal" onClick={() => redirect("/wfh-form")} className='home-wfhpbtn'>
              <i className="material-icons">work</i>
            </button>
            <button onClick={() => redirect("/employees/" + sessionStorage.getItem("eid"))} title="Your Profile" className='home-profilebtn'>
              <i className="material-icons">person</i>
            </button>
            <button onClick={() => redirect("/employees")} title="Our Employees" className='home-employeesbtn'>
              <i className="material-icons">people</i>
            </button>
            {sessionStorage.getItem("admin") == "true" ?
              <button onClick={() => redirect("/registry")} title="Registry" className='home-registrybtn'>
              <i className="material-icons">person_add</i>
              </button> : <div></div>
            }
            <button title="Log Out" onClick={() => {
              sessionStorage.clear();
              window.location.reload();
            }} className='home-logoutbtn'>
            <i className="material-icons">logout</i>
            </button>
        </div>
    )
}

export default Menu;