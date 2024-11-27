
import React, { useState ,useRef } from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import { Paper, Stack } from "@mui/material";
import { Button, Typography } from "@mui/material";
import { formatDate } from "@fullcalendar/core";
import timeGridPlugin from "@fullcalendar/timegrid";
import { SchedulerRef } from "@aldabil/react-scheduler/types";
import interactionPlugin from "@fullcalendar/interaction";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";


import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';


import { Scheduler } from "@aldabil/react-scheduler";
import "./calendar.css";


function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}

function renderSidebarEvent(event) {
  return (
    <li key={event.id}>
      <b>
        {formatDate(event.start, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </b>
      <i>{event.title}</i>
    </li>
  );
}

const Calendar2 = () => {

  const localizer = momentLocalizer(moment);

  const calendarRef = useRef<SchedulerRef>(null);


  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Room 101: Meeting',
      start: new Date(2024, 9, 10, 10, 0),
      end: new Date(2024, 9, 10, 12, 0),
      roomId: '101',
    },
    {
      id: 2,
      title: 'Room 202: Workshop',
      start: new Date(2024, 9, 11, 14, 0),
      end: new Date(2024, 9, 11, 16, 0),
      roomId: '202',
    },
  ]);

  // غرف وهمية لتمثيل الصفوف
  const rooms = ['101', '202', '303'];

  const filteredEvents = events.map((event) => ({
    ...event,
    title: `Room ${event.roomId}: ${event.title}`,
  }));

  const moveEvent = ({ event, start, end }) => {
    const updatedEvents = events.map((evt) =>
      evt.id === event.id ? { ...evt, start, end } : evt
    );
    setEvents(updatedEvents);
  };



   const EVENTS = [
    {
      event_id: 1,
      title: "Event 1",
      start: new Date(new Date(new Date().setHours(9)).setMinutes(30)),
      end: new Date(new Date(new Date().setHours(10)).setMinutes(30)),
      admin_id: 1
    },
    {
      event_id: 2,
      title: "Event 2",
      start: new Date(new Date(new Date().setHours(10)).setMinutes(0)),
      end: new Date(new Date(new Date().setHours(11)).setMinutes(0)),
      admin_id: 2
    },
    {
      event_id: 3,
      title: "Event 3",
      start: new Date(
        new Date(new Date(new Date().setHours(9)).setMinutes(0)).setDate(
          new Date().getDate() - 1
        )
      ),
      end: new Date(new Date(new Date().setHours(10)).setMinutes(0)),
      admin_id: 1
    },
    {
      event_id: 4,
      title: "Event 4",
      start: new Date(
        new Date(new Date(new Date().setHours(9)).setMinutes(0)).setDate(
          new Date().getDate() - 2
        )
      ),
      end: new Date(
        new Date(new Date(new Date().setHours(10)).setMinutes(0)).setDate(
          new Date().getDate() - 2
        )
      ),
      admin_id: 2
    },
    {
      event_id: 5,
      title: "Event 5",
      start: new Date(
        new Date(new Date(new Date().setHours(10)).setMinutes(0)).setDate(
          new Date().getDate() - 2
        )
      ),
      end: new Date(
        new Date(new Date(new Date().setHours(11)).setMinutes(0)).setDate(
          new Date().getDate() + 10
        )
      ),
      admin_id: 4
    },
    {
      event_id: 6,
      title: "Event 6",
      start: new Date(new Date(new Date().setHours(11)).setMinutes(0)),
      end: new Date(new Date(new Date().setHours(12)).setMinutes(0)),
      admin_id: 2
    },
    {
      event_id: 7,
      title: "Event 7",
      start: new Date(
        new Date(new Date(new Date().setHours(11)).setMinutes(0)).setDate(
          new Date().getDate() - 1
        )
      ),
      end: new Date(
        new Date(new Date(new Date().setHours(12)).setMinutes(0)).setDate(
          new Date().getDate() - 1
        )
      ),
      admin_id: 3
    },
    {
      event_id: 8,
      title: "Event 8",
      start: new Date(
        new Date(new Date(new Date().setHours(13)).setMinutes(0)).setDate(
          new Date().getDate() - 1
        )
      ),
      end: new Date(
        new Date(new Date(new Date().setHours(14)).setMinutes(0)).setDate(
          new Date().getDate() - 1
        )
      ),
      admin_id: 4
    },
    {
      event_id: 9,
      title: "Event 11",
      start: new Date(
        new Date(new Date(new Date().setHours(13)).setMinutes(0)).setDate(
          new Date().getDate() + 1
        )
      ),
      end: new Date(
        new Date(new Date(new Date().setHours(15)).setMinutes(30)).setDate(
          new Date().getDate() + 1
        )
      ),
      admin_id: 1
    },
    {
      event_id: 10,
      title: "Event 9",
      start: new Date(
        new Date(new Date(new Date().setHours(15)).setMinutes(0)).setDate(
          new Date().getDate() + 1
        )
      ),
      end: new Date(
        new Date(new Date(new Date().setHours(16)).setMinutes(30)).setDate(
          new Date().getDate() + 1
        )
      ),
      admin_id: 2
    },
    {
      event_id: 11,
      title: "Event 10",
      start: new Date(
        new Date(new Date(new Date().setHours(11)).setMinutes(0)).setDate(
          new Date().getDate() - 1
        )
      ),
      end: new Date(
        new Date(new Date(new Date().setHours(15)).setMinutes(0)).setDate(
          new Date().getDate() - 1
        )
      ),
      admin_id: 1
    }
  ];
  
   const RESOURCES = [
    {
      admin_id: 1,
      title: "room1",
      mobile: "555666777",
      avatar: "https://picsum.photos/200/300",
      color: "#ab2d2d"
    },
    {
      admin_id: 2,
      title: "Sarah",
      mobile: "545678354",
      avatar: "https://picsum.photos/200/300",
      color: "#58ab2d"
    },
    {
      admin_id: 3,
      title: "Joseph",
      mobile: "543678433",
      avatar: "https://picsum.photos/200/300",
      color: "#a001a2"
    },
    {
      admin_id: 4,
      title: "Mera",
      mobile: "507487620",
      avatar: "https://picsum.photos/200/300",
      color: "#08c5bd"
    }
  ];
  const [weekendsVisible, setweekendsVisible] = useState(true);
  const [currentEvents, setcurrentEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const handleWeekendsToggle = () => {
    setweekendsVisible(!weekendsVisible);
  };

  let eventGuid = 0;
  function createEventId() {
    return String(eventGuid++);
  }



  const handleDateSelect = (selectInfo) => {
    let title = prompt("Please enter a new title for your event");
    let calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }
  };

  const handleEventClick = (clickInfo) => {
    if (
      confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove();
    }
  };

  const handleEvents = (events) => {
    setcurrentEvents(events);
  };

  return (
    <Stack direction={"row"}>
      {/* <Paper className="demo-app-sidebar">
         
       
       
          <h2 style={{ textAlign: "center" }}>All Events ({currentEvents.length})</h2>
          <ul>{currentEvents.map(renderSidebarEvent)}</ul>
         
      </Paper> */}

      <div className="demo-app-main">

{/* 
 <Calendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        defaultView="week"
        resizable
        selectable
        onEventDrop={moveEvent} // السحب والإفلات
        onEventResize={moveEvent} // تغيير حجم الحدث
        style={{ height: 500 }}
      /> */}






   
{/*         
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={weekendsVisible}
          // initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
          select={handleDateSelect}
          eventContent={renderEventContent} 
          eventClick={handleEventClick}
          eventsSet={handleEvents} 
      
        /> */}

 <Scheduler
        ref={calendarRef}
        events={EVENTS}
        view="day"

        resourceViewMode="vertical"
        resources={RESOURCES}
        resourceFields={{
          idField: "admin_id",
          textField: "title",
          subTextField: "mobile",
          avatarField: "title",
          colorField: "color"
        }}
        fields={[
          {
            name: "admin_id",
            type: "select",
            default: RESOURCES[0].admin_id,
            options: RESOURCES.map((res) => {
              return {
                id: res.admin_id,
                text: `${res.title} (${res.mobile})`,
                value: res.admin_id //Should match "name" property
              };
            }),
            config: { label: "Assignee", required: true }
          }
        ]}
        viewerExtraComponent={(fields, event) => {
          return (
            <div>
              {fields.map((field, i) => {
                if (field.name === "admin_id") {
                  const admin = field.options.find(
                    (fe) => fe.id === event.admin_id
                  );
                  return (
                    <Typography
                      key={i}
                      style={{ display: "flex", alignItems: "center" }}
                      color="textSecondary"
                      variant="caption"
                      noWrap
                    >
                      <PersonRoundedIcon /> {admin.text}
                    </Typography>
                  );
                } else {
                  return "";
                }
              })}
            </div>
          );
        }}
      /> 
      </div>
    </Stack>
  );
};

export default Calendar2;
