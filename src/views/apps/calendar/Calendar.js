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
  console.log("🚀 ~ store:", store)
  // ** State for merged events
  const [mergedArray, setMergedArray] = useState([])

  // ** Ref for FullCalendar instance
  const calendarRef = useRef(null)

  // ** Memoize merged events calculation to avoid unnecessary recalculations
  const mergedEvents = useMemo(() => {
    return [
      ...(store?.events?.events || []),  // Ensure events default to an empty array
      ...(store?.eventcourse || [])      // Ensure eventcourse defaults to an empty array
    ]
  }, [store?.events?.events, store?.eventcourse]) // Only recalculate when store data changes

  // ** Update state with merged events when store changes
  useEffect(() => {
    setMergedArray(mergedEvents)
  }, [mergedEvents])

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
  const formattedEvents = useMemo(() => {
    return mergedArray.length
      ? mergedArray.map(event => ({
          id: event.id,
          title: event.eventName || event.name,
          start: new Date(event.startDate || event.startDateTime),
          end: new Date(event.endDate || event.endDateTime),
          extendedProps: {
            calendar: event?.eventType?.id,
            description: event?.description,
            guests: event?.courseSchedule,
            backgroundColor: event.eventName ? 'ETC' : 'Holiday'
          }
        }))
      : []
  }, [mergedArray])

  // ** Memoized eventClick handler
  const handleEventClick = useCallback(
    ({ event: clickedEvent }) => {
      dispatch(handleSelectEvent(clickedEvent))
      handleAddEventSidebarToggle()
    },
    [dispatch, handleSelectEvent, handleAddEventSidebarToggle]
  )

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
  return store ? <FullCalendar {...calendarOptions} /> : null
}

export default Calendar
