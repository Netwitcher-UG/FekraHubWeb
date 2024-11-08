// ** React Import
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

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
import { ShowErrorToast } from 'src/@core/utils/showErrorToast'
import { AbilityContext } from 'src/layouts/components/acl/Can'

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
  const ability = useContext(AbilityContext)
  console.log('🚀 ~ ability:', ability)
  // ** Initialize calendarApi and ensure cleanup on unmount
  useEffect(() => {
    // Assuming you have the start and end dates available
    const arg = {
      startStr: new Date(), // Replace with your actual start date
      endStr: new Date(new Date().setMonth(new Date().getMonth() + 1)) // Example: 1 month ahead
    }
    handleDatesSet(arg)
  }, [store.selectedCalendars])

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

  const handleDatesSet = arg => {
    const fromYearMonth = `${new Date(arg.startStr).getFullYear()}-${String(
      new Date(arg.startStr).getMonth() + 1
    ).padStart(2, '0')}`
    const toYearMonth = `${new Date(arg.endStr).getFullYear()}-${String(new Date(arg.endStr).getMonth() + 1).padStart(
      2,
      '0'
    )}`

    dispatch(
      fetchCourseForCalender({
        url: ability.can('manage', 'Event')
          ? '/api/Courses/CourseEventForCalender'
          : '/api/Courses/CourseEventForCalender',
        selectedCalendars: store.selectedCalendars,
        from: fromYearMonth,
        to: toYearMonth
      })
    )
  }

  const calendarOptions = {
    events: store?.eventcourse
      ? store.eventcourse?.map((event, index) => ({
          id: index,
          title: event.eventName,
          start: new Date(event.startDateTime ? event.startDateTime : event.startDate),
          end: new Date(event.endDateTime ? event.endDateTime : event.endDate),
          extendedProps: {
            calendar: event?.eventType?.id,
            description: event?.description,
            id: event?.id,
            eventType: event?.eventType?.typeTitle,
            guests: event?.courseSchedule,
            backgroundColor: event?.isEvent
              ? event?.eventType?.typeTitle === 'Feiertag'
                ? 'Family'
                : 'Etc'
              : 'Holiday'
          }
        }))
      : [],
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, bootstrap5Plugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      start: 'sidebarToggle, prev, next, title',
      end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
    },
    views: {
      week: {
        titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
      }
    },

    /*
          Enable dragging and resizing event
          ? Docs: https://fullcalendar.io/docs/editable
        */
    editable: true,

    /*
          Enable resizing event from start
          ? Docs: https://fullcalendar.io/docs/eventResizableFromStart
        */
    eventResizableFromStart: false,

    /*
            Automatically scroll the scroll-containers during event drag-and-drop and date selecting
            ? Docs: https://fullcalendar.io/docs/dragScroll
          */
    dragScroll: true,

    /*
            Max number of events within a given day
            ? Docs: https://fullcalendar.io/docs/dayMaxEvents
          */
    dayMaxEvents: 2,
    datesSet: handleDatesSet,

    /*
            Determines if day names and week names are clickable
            ? Docs: https://fullcalendar.io/docs/navLinks
          */
    navLinks: true,
    eventClassNames({ event: calendarEvent }) {
      // @ts-ignore
      const colorName = calendarsColor[calendarEvent._def.extendedProps.backgroundColor]

      return [
        // Background Color
        `bg-${colorName}`
      ]
    },
    eventClick({ event: clickedEvent }) {
      if (clickedEvent._def.extendedProps.backgroundColor === 'Holiday' || !ability.can('create', 'Event')) {
        ShowErrorToast('  cannot edit ')
      } else {
        dispatch(handleSelectEvent(clickedEvent))
        handleAddEventSidebarToggle()
      }

      // * Only grab required field otherwise it goes in infinity loop
      // ! Always grab all fields rendered by form (even if it get `undefined`) otherwise due to Vue3/Composition API you might get: "object is not extensible"
      // event.value = grabEventDataFromEventApi(clickedEvent)
      // isAddNewEventSidebarActive.value = true
    },
    customButtons: {
      sidebarToggle: {
        icon: 'bi bi-list',
        click() {
          handleLeftSidebarToggle()
        }
      }
    },
    dateClick(info) {
      const ev = { ...blankEvent }
      ev.start = info.date
      ev.end = info.date
      ev.allDay = true

      // @ts-ignore
      dispatch(handleSelectEvent(ev))
      handleAddEventSidebarToggle()
    },
    eventContent: function (arg) {
      return (
        <>
          <b>{arg.event.title}</b>
          <div>{arg.event.extendedProps?.eventType ? ' / ' + arg.event.extendedProps?.eventType : null}</div>
        </>
      )
    },
    /*
            Handle event drop (Also include dragged event)
            ? Docs: https://fullcalendar.io/docs/eventDrop
            ? We can use `eventDragStop` but it doesn't return updated event so we have to use `eventDrop` which returns updated event
          */

    /*
            Handle event resize
            ? Docs: https://fullcalendar.io/docs/eventResize
          */

    ref: calendarRef,

    // Get direction from app state (store)
    direction
  }
  // Render FullCalendar if store data is available
  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Typography variant='h4' sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ backgroundColor: '#28C76F', width: '15px', height: '15px', borderRadius: '50%' }} />
            <Typography variant='body1' sx={{ ml: 1 }}>
              Course
            </Typography>
          </Box>
          <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ backgroundColor: '#03bef7', width: '15px', height: '15px', borderRadius: '50%' }} />
            <Typography variant='body1' sx={{ ml: 1 }}>
              Events
            </Typography>
          </Box>
          <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ backgroundColor: '#FF9F43', width: '15px', height: '15px', borderRadius: '50%' }} />
            <Typography variant='body1' sx={{ ml: 1 }}>
              feiertag
            </Typography>
          </Box>
        </Typography>
      </Box>

      <FullCalendar {...calendarOptions} />
    </>
  )
}

export default Calendar
