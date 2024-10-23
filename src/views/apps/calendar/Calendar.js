// ** React Import
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

// ** Full Calendar & it's Plugins
import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import bootstrap5Plugin from '@fullcalendar/bootstrap5'
import interactionPlugin from '@fullcalendar/interaction'

// ** Third Party Style Import
import 'bootstrap-icons/font/bootstrap-icons.css'
import { Box, Typography } from '@mui/material'
import { fetchCourseForCalender } from 'src/store/apps/calendar'

const blankEvent = {
  title: '',
  start: '',
  end: '',
  allDay: false,
  url: '',
  extendedProps: {
    calendar: '',
    guests: [],
    location: '',
    description: ''
  }
}

const Calendar = ({
  store,
  dispatch,
  direction,
  updateEvent,
  calendarsColor,
  setCalendarApi,
  handleSelectEvent,
  handleLeftSidebarToggle,
  handleAddEventSidebarToggle
}) => {

  const calendarRef = useRef(null)


console.log(store?.eventcourse.length);

  // ** Initialize calendarApi and ensure cleanup on unmount
  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi()
    if (calendarApi) {
      setCalendarApi(calendarApi)
    }

    return () => {
      if (calendarApi) {
        calendarApi.destroy() // Clean up on unmount
      }
    }
  }, [setCalendarApi])

  // ** Memoize event mapping for better performance
  const formattedEvents = store?.eventcourse.length
  ? store?.eventcourse.map(event => ({
      id: event.id,
      title: event.eventName,
      start: new Date(event.startDate),
      end: new Date(event.endDate),
      extendedProps: {
        calendar: event?.eventType ? event?.eventType?.id : ' ',
        description: event?.description ? event?.description : 'course view',
        guests: event?.courseSchedule,
        backgroundColor: event?.isEvent  ?   'ETC' :'Holiday'
      }
    }))
  : [];

  // ** Memoized eventClick handler
  const handleEventClick = useCallback(
    ({ event: clickedEvent }) => {
      dispatch(handleSelectEvent(clickedEvent))
      handleAddEventSidebarToggle()
    },
    [dispatch, handleSelectEvent, handleAddEventSidebarToggle]
  )

  const handleDatesSet = (arg) => {
      const fromYearMonth = `${new Date (arg.startStr).getFullYear()}-${String(new Date (arg.startStr).getMonth() + 1).padStart(2, '0')}`;
      const toYearMonth = `${new Date (arg.endStr).getFullYear()}-${String(new Date (arg.endStr).getMonth() + 1).padStart(2, '0')}`;


    dispatch(fetchCourseForCalender({
      selectedCalendars: '',
      from: fromYearMonth,
      to: toYearMonth
  }));
  };
  // ** Memoized dateClick handler
  const handleDateClick = useCallback(
    info => {
      const newEvent = { ...blankEvent, start: info.date, end: info.date, allDay: true }
      dispatch(handleSelectEvent(newEvent))
      handleAddEventSidebarToggle()
    },
    [dispatch, handleSelectEvent, handleAddEventSidebarToggle]
  )

  // ** Memoized eventDrop and eventResize handlers
  const handleEventDrop = useCallback(
    ({ event: droppedEvent }) => dispatch(updateEvent(droppedEvent)),
    [dispatch, updateEvent]
  )

  const handleEventResize = useCallback(
    ({ event: resizedEvent }) => dispatch(updateEvent(resizedEvent)),
    [dispatch, updateEvent]
  )

  // ** Memoize calendar options to avoid unnecessary recalculations
  const calendarOptions = useMemo(() => ({
    events: formattedEvents,
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, bootstrap5Plugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      start: 'sidebarToggle, prev, next, title',
      end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
    },
    views: {
      week: { titleFormat: { year: 'numeric', month: 'long', day: 'numeric' } }
    },
    editable: true,
    eventResizableFromStart: true,
    dragScroll: true,
    dayMaxEvents: 4,
    navLinks: true,

    eventClassNames({ event: calendarEvent }) {
      const colorName = calendarsColor[calendarEvent._def.extendedProps.backgroundColor]
      return [`bg-${colorName}`]
    },
    eventClick: handleEventClick,
    dateClick: handleDateClick,
    eventDrop: handleEventDrop,
    datesSet: handleDatesSet,
    eventResize: handleEventResize,
    customButtons: {
      sidebarToggle: {
        icon: 'bi bi-list',
        click: handleLeftSidebarToggle
      }
    },
    ref: calendarRef,
    direction
  }), [
    formattedEvents,

    calendarsColor,
    handleEventClick,
    handleDateClick,
    handleEventDrop,
    handleEventResize,
    handleLeftSidebarToggle,
    direction
  ])

  // Render FullCalendar if store data is available
  return <>
    <Box sx={{  mb: 2 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>

          <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ backgroundColor: '#28C76F', width: '15px', height: '15px', borderRadius: '50%' }} />
            <Typography variant="body1" sx={{ ml: 1 }}>Course</Typography>
          </Box>
          <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ backgroundColor: '#03bef7', width: '15px', height: '15px', borderRadius: '50%' }} />
            <Typography variant="body1" sx={{ ml: 1 }}>Events</Typography>
          </Box>
          <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ backgroundColor: '#FF9F43', width: '15px', height: '15px', borderRadius: '50%' }} />
            <Typography variant="body1" sx={{ ml: 1 }}>info</Typography>
          </Box>
        </Typography>
      </Box>

   <FullCalendar {...calendarOptions} />
   </>

}

export default Calendar
