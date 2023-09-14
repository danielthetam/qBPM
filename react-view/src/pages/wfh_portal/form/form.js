import React from 'react';
import ReactDOM from 'react-dom/client';
import './form.css';
import axios from "axios";

function parseDate(num) {
  if (num < 10) {
    return "0" + num.toString();
  } else {
    return num.toString();
  }
}

function Form() {
  const defaultDate = new Date()
  const request = React.useRef({
    reason : "",
    requestDate: Number(defaultDate.getFullYear().toString() + parseDate(defaultDate.getMonth() + 1) + parseDate(defaultDate.getDate())),
    eid: 0,
    numOfDays: 1,
  })

  const setDate = (pickedDate) => {
    request.current["requestDate"] = Number(pickedDate);
  }

  const setReason = (newReason) => {
    request.current["reason"] = newReason;
  }

  const setRequester = (newName) => {
    request.current["eid"] = Number(newName);
  }

  const setDuration = (newDuration) => {
    request.current["numOfDays"] = newDuration;
  }

  const createDate = () => {
    return Number(defaultDate.getFullYear().toString() + parseDate(defaultDate.getMonth() + 1) + parseDate(defaultDate.getDate()))
  }

  const onSubmit = async (e) => {
    if (request.current["requester"] === "" || request.current["reason"] === "") {
      e.preventDefault();
      document.getElementById('warning-dialog').innerHTML = "Please fill up all fields";
      document.getElementById('warning-dialog').classList.add("warning-dialog");
    } else if (request.current["requestDate"] < createDate()) {
      e.preventDefault();
      document.getElementById('warning-dialog').innerHTML = "Date requested cannot be earlier than current date. ";
      document.getElementById('warning-dialog').classList.add("warning-dialog");
    } else {
      await axios.post("http://localhost/api/requests", request.current);
      window.location.reload();
    }
  }

  return (
    <div className='main-container'>
    <form onSubmit={(e)=>onSubmit(e)} className='application-form'>
      <div className="full-pattern"></div>
      <div className="full-pattern-2"></div>
      <div className="cross-pattern"></div>
      <div className="diagonal-pattern"></div>
      <div className='form-container'>
        <div className='left-side'>
          <div className='name-container'>
            <label>Your Employee EID</label>
            <input 
            onChange={(e) => setRequester(e.currentTarget.value)} 
            type="text" 
            className='name'>
            </input>
          </div>

          <Calendar 
          setDate={setDate}
          />
          <div className='duration-container'>
            <label>Duration</label>
            <input 
            onChange={(e) => setDuration(Number(e.currentTarget.value))} 
            defaultValue={1} 
            type="number" 
            min={1}
            className='duration'>
            </input>
          </div>
        </div>

        <div className='right-side'>
          <div className='reason-container'>
            <label>Reason</label>
            <textarea 
            onChange={(e) => setReason(e.currentTarget.value)} 
            className='reason'>
            </textarea>
          </div>
          <div className='button-container'>
            <button 
            type='button' 
            onClick={() => window.location.reload()} 
            className='clear-btn'>Clear</button>
            <button 
            type='submit'
            className='submit-btn'>Submit</button>
          </div>
        </div> 
      </div>
      <p id="warning-dialog"></p>
    </form>
    </div>
  )
}

function Calendar({setDate}) {
  const d = new Date();
  const [currentMonth, setCurrentMonth] = React.useState(d.getMonth() + 1);
  const [currentYear, setCurrentYear] = React.useState(d.getFullYear());

  function increaseCurrentMonth() {
    if (currentMonth < 12) {
      setCurrentMonth(currentMonth + 1);
    }
    else {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    }
  }

  function decreaseCurrentMonth() {
    if (currentMonth > 1) {
      setCurrentMonth(currentMonth - 1);
    }
    else {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    }
  }
  let leapYear = false;

  if (currentYear % 4 === 0) {
    if (currentYear % 100 === 0) {
      if (currentYear % 400 === 0) {
        leapYear = true;
      }
    }
    else {
      leapYear = true;
    }
  }
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  let newCurrentMonth = currentMonth.toString();
  if (currentMonth < 10) {
    newCurrentMonth = "0" + currentMonth.toString();
  }
  return (
    <div className='entire-calendar-container'>
      <div className='heading-container'>
        <h3 className='heading'>{currentYear}</h3>
        <div className='month-control-container'>
          <button className="next-month-btn" type='button' onClick={() => decreaseCurrentMonth()}>&#60;</button>
          <h2 className='heading'>{months[currentMonth - 1]}</h2>
          <button className="next-month-btn" type='button' onClick={() => increaseCurrentMonth()}>&#62;</button>
        </div>
      </div>
       {/* why () => works but  normal doesn't? */}
      <div className='month-display-container'>
        <ul className='month-container'>
          <Days 
          setDate={setDate}
          leapYear={leapYear}
          date={new Date(currentYear + "-" + newCurrentMonth + "-" + "01")}
          />
        </ul>
      </div>
    </div>
  )
}

function Days({leapYear, date, setDate}) {
  function zeller(month, day, year) {
    
    if (month < 3) {month += 12; year -= 1;}
    
    var z = (day + 
              parseInt(((month + 1) * 13) / 5) + 
              year + 
              parseInt(year / 4) -  
              parseInt(year / 100) +  
              parseInt(year / 400)
              ) % 7;
        
    return z;
  }
  const days = ["Sa", "Su", "Mo", "Tu", "We", "Th", "Fr"];

  // CALCULATING NUMBER OF DAYS
  const month = date.getMonth() + 1;
  var numOfDays = 0;
  if (month == 2) { // different set of numbers if month is february
    if (leapYear) {
      numOfDays = 29;
    } else {
      numOfDays = 28;
    }
  } else if (month > 7) {
    if (month % 2 == 0) {
      numOfDays = 31;
    } else {
      numOfDays = 30;
    }
  } else {
    if (month % 2 == 0) {
      numOfDays = 30;
    } else {
      numOfDays = 31;
    }
  }

  const firstDayOfMonth = zeller(month, 1, date.getFullYear());
  // getting the first 7 days of the month in the days(array) position
  // e.g, startDays = [[6, false], [7, false], [1, true], [2, true], [3, true], [4, true], [5, true]]
  // [dateOfDay, whetherButtonShouldHaveAnEmptyButtonAbove]
  const daysOfDays = []
  const daysOfDays2 = []
  var daysLeft = 8 - firstDayOfMonth;
  var day = 1;
  for (let i=1; i<8; i++) {
    if (i >= (firstDayOfMonth+1)) {
      daysOfDays.push([day, false]);
      day++;
    }
  }
  for (daysLeft; daysLeft<8;daysLeft++) {
    daysOfDays2.push([daysLeft, true]);
  }
  const startDays = daysOfDays2.concat(daysOfDays);

  return (
    days.map((theDay) => 
      {
        return (
          <li className='day-container'>
            <p className='day-title'>{theDay}</p>
            <EmptyDays
            firstDay={startDays[days.indexOf(theDay)]}
            />
            <ActualDays 
            setDate={setDate}
            firstDay={startDays[days.indexOf(theDay)]}
            numOfDays={numOfDays}
            currentDate={date}
            />
          </li>
        )
      }
    )
  );
}

function EmptyDays({firstDay}) {
  if (firstDay[1]) {
    return (
      <button type='button' className='empty-btn'></button>
    )
  }
}

function ActualDays({setDate, firstDay, numOfDays, currentDate}) {
  var pickedDate = 0;

  const days = [firstDay[0]]
  var currentDay = firstDay[0];
  for (let i=0;i<6;i++) {
    if ((currentDay + 7) > numOfDays) {
      break;
    } else {
      currentDay += 7;
      days.push(currentDay)
    }
  }
  var allWithClass;
  React.useEffect(() => {
    allWithClass = Array.from(
      document.getElementsByClassName('day-btn')
    );
    allWithClass.map((elem) => {
      elem.className = 'day-btn';
    })
  })
  function newDate(event) {
    pickedDate = currentDate.getFullYear().toString() + parseDate(currentDate.getMonth() + 1) + parseDate(event.currentTarget.innerHTML);
    setDate(pickedDate);

    allWithClass.map((elem) => {
      elem.className = 'day-btn';
    })

    event.currentTarget.classList.toggle('day-btn-chosen');
  }
  return (
    days.map((day) => {
      return (
        <button onClick={(event) => newDate(event)} type='button' className='day-btn'>{day}</button>
      )
    })
  )
}

export default Form;