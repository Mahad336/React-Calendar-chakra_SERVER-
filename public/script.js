"use strict";

let renderedEvents = [];
let hourSelector = [];
let halfHourSelector = [];
let allDayEventsSelector;
let data;
let events;
let eventsAllDay;
const eventModal = document.querySelector("#editEvent");
const allDayEventModal = document.querySelector("#editAllDayEvent");

//Assign id to every time set (e.g 1:00, 1:30, 2:00, 2:30)

function init() {
  allDayEventsSelector = document.querySelector(".all-day-task");
  for (let i = 0; i < 24; i++) {
    document.querySelectorAll(`.half-top`)[i].setAttribute("id", `full-${i}`);
    hourSelector.push(document.querySelector(`#full-${i}`));
    document
      .querySelectorAll(`.half-bottom-2`)
      [i].setAttribute("id", `half-${i}`);
    halfHourSelector.push(document.querySelector(`#half-${i}`));
  }

  async function getEvents() {
    const endPoint = "/events";
    try {
      const result = await fetch(endPoint, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      data = await result.json();
      events = data.data.events;
      eventsAllDay = data.data.dayEvents;
      events.sort((a, b) =>
        a.endAt - a.startAt < b.endAt - b.startAt ? 1 : -1
      );

      for (let i = 0; i < events.length; i++) {
        setEvent(
          events[i].startAt,
          events[i].endAt,
          events[i].title,
          events[i].location,
          events[i]._id
        );
      }
      for (let i = 0; i < eventsAllDay.length; i++) {
        setAllDayEvent(
          eventsAllDay[i].title,
          eventsAllDay[i].location,
          eventsAllDay[i]._id
        );
      }
    } catch (err) {
      console.log("Error ", err);
    }
  }

  getEvents();
}

//Renders an event to the web-page
const setEvent = (sTime, eTime, title, location, id) => {
  const startTime = parseFloat(sTime);
  const endTime = parseFloat(eTime);

  let newEvent;
  if (startTime < Math.ceil(startTime)) {
    newEvent = halfHourSelector[Math.floor(startTime)].appendChild(
      createContent(startTime, endTime, title, location, id)
    );
  } else {
    newEvent = hourSelector[Math.floor(startTime)].appendChild(
      createContent(startTime, endTime, title, location, id)
    );
  }

  newEvent.classList.add("event");
  const height = (endTime - startTime) * 100 - 3;
  if (height <= 50) {
    startTime < Math.ceil(startTime)
      ? newEvent.classList.add("event-half-bot")
      : newEvent.classList.add("event-half-top");
    newEvent.classList.remove("event");
  }

  newEvent.addEventListener("click", () => {
    let eventData = events.filter((event) => event._id === id);
    eventData = eventData[0];

    const editForm = document.querySelector("#editForm");
    editForm.title.value = eventData.title;
    editForm.location.value = eventData.location;
    editForm.startTime.value = eventData.startAt;
    editForm.endTime.value = eventData.endAt;

    editForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = eventData._id;
      const title = editForm.title.value;
      const location = editForm.location.value;
      const startAt = editForm.startTime.value;
      const endAt = editForm.endTime.value;

      try {
        const result = await fetch("/events/update", {
          method: "PUT",
          body: JSON.stringify({ id, title, location, startAt, endAt }),
          headers: { "Content-Type": "application/json" },
        });
        window.location.href = "/display-events";
      } catch (error) {
        console.log(error);
      }
    });

    const deleteEvent = document.querySelector("#delete");
    deleteEvent.addEventListener("click", async (e) => {
      e.preventDefault();
      const id = eventData._id;
      const endpoint = `/events/delete/${id}`;

      fetch(endpoint, { method: "DELETE" })
        .then((response) => response.json())
        .then((data) => (window.location.href = data.redirect))
        .catch((error) => {
          console.log(error);
        });
    });

    eventModal.style.display = "block";
  });

  newEvent.style.height = height + "px";
  renderedEvents.push(newEvent);
  align();
  newEvent.style.height = height + 2 + "px";
};

//Aligns the rendered events to consume equal width if they are overlapping eachother

const align = () => {
  let time, time1, time2;
  for (let i = 0; i < renderedEvents.length; i++) {
    for (let j = i + 1; j < renderedEvents.length; j++) {
      if (elementsOverlap(renderedEvents[i], renderedEvents[j])) {
        time1 = renderedEvents[i].parentElement.children[0].innerText;
        time2 = renderedEvents[j].children[0].innerText;
        time = getFloatTime(time1, time2);

        document
          .getElementById(renderedEvents[i].parentElement.id)
          .appendChild(renderedEvents[j]);
        renderedEvents[j].style.marginTop =
          (time[1] - time[0]) * 100 - 9 + "px";
      }
    }
  }
};

//Gets time in text from a renderedEvent and converts it into float for Mathematical calculations

const getFloatTime = (time1, time2) => {
  const time = [];
  time1 = time1.substring(0, time1.indexOf(" "));
  time2 = time2.substring(0, time2.indexOf(" "));
  time1.includes(":30")
    ? time.push(parseFloat(time1.replace(":30", ".5")))
    : time.push(parseFloat(time1));
  time2.includes(":30")
    ? time.push(parseFloat(time2.replace(":30", ".5")))
    : time.push(parseFloat(time2));
  return time;
};

//Generates All Day events

const setAllDayEvent = (eventName, eventLocation, id) => {
  let newEvent;
  const content = document.createElement("div");
  content.id = id;
  const time = document.createElement("p");
  const title = document.createElement("h5");
  const location = document.createElement("span");

  time.innerText = "All Day";
  title.innerText = eventName;
  location.innerText = eventLocation;
  content.append(time, title, location);
  newEvent = allDayEventsSelector.appendChild(content);
  newEvent.classList.add("event-all-day");

  newEvent.addEventListener("click", () => {
    let eventData = eventsAllDay.filter((event) => event._id === id);
    eventData = eventData[0];

    const editForm = document.querySelector("#editAllDayForm");
    editForm.title.value = eventData.title;
    editForm.location.value = eventData.location;

    editForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = eventData._id;
      const title = editForm.title.value;
      const location = editForm.location.value;

      try {
        const result = await fetch("/events/updateAllDayEvent", {
          method: "PUT",
          body: JSON.stringify({ id, title, location }),
          headers: { "Content-Type": "application/json" },
        });
        window.location.href = "/display-events";
      } catch (error) {
        console.log(error);
      }
    });

    const deleteEvent = document.querySelector("#deleteAllDay");
    deleteEvent.addEventListener("click", async (e) => {
      console.log("Heree ===>");
      e.preventDefault();
      const id = eventData._id;

      const endpoint = `/events/deleteAllDayEvent/${id}`;

      fetch(endpoint, { method: "DELETE" })
        .then((response) => response.json())
        .then((data) => (window.location.href = data.redirect))
        .catch((error) => {
          console.log(error);
        });
    });

    allDayEventModal.style.display = "block";
  });
};

//Generates content to display on an event

const createContent = (
  startTime,
  endTime,
  eventName,
  eventLocation,
  eventID
) => {
  const content = document.createElement("div");
  content.id = eventID;
  const time = document.createElement("p");
  const title = document.createElement("h5");
  const location = document.createElement("span");

  const convertStartTime = startTime.toString();
  const convertEndTime = endTime.toString();

  if (convertStartTime.includes(".")) {
    startTime < 12
      ? (time.innerText = `${convertStartTime.replace(".5", ":30")} AM`)
      : (time.innerText = `${convertStartTime.replace(".5", ":30")} PM`);
  } else if (convertStartTime.includes(".")) {
    startTime < 12
      ? (time.innerText = `${convertEndTime.replace(".5", ":30")} AM`)
      : (time.innerText = `${convertEndTime.replace(".5", ":30")} PM`);
  } else
    startTime < 12
      ? (time.innerText = `${startTime}:00 AM`)
      : (time.innerText = `${startTime}:00 PM`);

  title.innerText = eventName;
  location.innerText = eventLocation;
  content.append(time, title, location);
  return content;
};

//Checks if two events are overlapping each-other

const elementsOverlap = (el1, el2) => {
  const event1 = el1.getBoundingClientRect();
  const event2 = el2.getBoundingClientRect();

  return !(
    event1.top > event2.bottom ||
    event1.bottom < event2.top ||
    event1.right < event2.left ||
    event1.left > event2.right
  );
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == eventModal) {
    eventModal.style.display = "none";
  }
  if (event.target == allDayEventModal) {
    allDayEventModal.style.display = "none";
  }
};

init();
