// ** React Imports
import { useState, useEffect, forwardRef, useCallback, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Switch from '@mui/material/Switch'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import DatePicker from 'react-datepicker'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { useSelector } from 'react-redux'
import { fetchEventsTypes } from 'src/store/apps/calendar'
import { fetchCourses, fetchCourseSchedule } from 'src/store/apps/courses'
import { FormateDateTime } from 'src/@core/utils/DateTimeFormat'
import { FormateDate } from 'src/@core/utils/DateFormate'
import { Autocomplete } from '@mui/material'

const defaultState = {
  url: '',
  title: '',
  guests: [],
  allDay: false,
  description: '',
  endDate: new Date(),
  calendar: 1,
  course: 1,
  startDate: new Date()
}

const AddEventSidebar = props => {
  // ** Props
  const {
    store,
    dispatch,
    addEvent,
    updateEvent,
    drawerWidth,
    calendarApi,
    deleteEvent,
    handleSelectEvent,
    addEventSidebarOpen,
    handleAddEventSidebarToggle
  } = props

  // ** States
  const [values, setValues] = useState(defaultState)

  const {
    control,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: { title: '', description: '' } })

  const handleSidebarClose = async () => {
    setValues(defaultState)
    clearErrors()
    dispatch(handleSelectEvent(null))
    handleAddEventSidebarToggle()
  }

  const { types } = useSelector(state => state.calendar)
  const { data: CourseSchedule } = useSelector(state => state.courses)

  useEffect(() => {
    dispatch(fetchEventsTypes())
  }, [dispatch])

  const onSubmit = data => {
    let startDate, endDate

    if (values.allDay) {
      startDate = FormateDate(values.startDate)
      endDate = FormateDate(values.endDate)
    } else {
      startDate = FormateDateTime(values.startDate)
      endDate = FormateDateTime(values.endDate)
    }

    const modifiedEvent = {
      eventName: data.title,
      endDate: endDate,
      scheduleId: values.guests && values.guests.length ? values.guests : undefined,
      startDate: startDate,
      typeID: values.calendar,
      description: data.description
    }

    if (store.selectedEvent === null || (store.selectedEvent !== null && !store.selectedEvent.title.length)) {
      dispatch(addEvent(modifiedEvent))
    } else {
      dispatch(updateEvent({ id: store.selectedEvent.extendedProps.id, ...modifiedEvent }))
    }
    calendarApi.refetchEvents()
    handleSidebarClose()
  }

  const handleDeleteEvent = () => {
    if (store.selectedEvent) {
      dispatch(deleteEvent(store.selectedEvent.id))
    }

    // calendarApi.getEventById(store.selectedEvent.id).remove()
    handleSidebarClose()
  }

  const handleStartDate = date => {
    if (date > values.endDate) {
      setValues({ ...values, startDate: new Date(date) })
    }
  }
  const handleEndDate = date => {
    setValues({ ...values, endDate: new Date(date) })
  }

  const resetToStoredValues = useCallback(() => {
    if (store.selectedEvent !== null) {
      const event = store.selectedEvent
      setValue('title', event.title || '')
      setValue('description', event.extendedProps.description || '')
      setValues({
        title: event.title || '',
        description: event.extendedProps.description || '',
        guests: event.extendedProps.guests ? event.extendedProps.guests.map(guest => guest.id) : [],
        calendar: event.extendedProps.calendar || 'Business',
        endDate: event.end !== null ? event.end : event.start,
        startDate: event.start !== null ? event.start : new Date()
      })
    }
  }, [setValue, store.selectedEvent])

  const resetToEmptyValues = useCallback(() => {
    setValue('title', '')
    setValue('description', '')
    setValues(defaultState)
  }, [setValue])
  useEffect(() => {
    const resetFunction = store.selectedEvent !== null ? resetToStoredValues : resetToEmptyValues
    resetFunction()
  }, [store.selectedEvent, resetToStoredValues, resetToEmptyValues])

  const PickersComponent = forwardRef(({ ...props }, ref) => {
    return (
      <CustomTextField
        inputRef={ref}
        fullWidth
        {...props}
        label={props.label || ''}
        sx={{ width: '100%' }}
        error={props.error}
      />
    )
  })

  const RenderSidebarFooter = () => {
    if (store.selectedEvent === null || (store.selectedEvent !== null && !store.selectedEvent.title.length)) {
      return (
        <Fragment>
          <Button type='submit' variant='contained' sx={{ mr: 4 }}>
            Add
          </Button>
          <Button variant='tonal' color='secondary' onClick={resetToEmptyValues}>
            Reset
          </Button>
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          <Button type='submit' variant='contained' sx={{ mr: 4 }}>
            Update
          </Button>
          <Button variant='tonal' color='secondary' onClick={resetToStoredValues}>
            Reset
          </Button>
        </Fragment>
      )
    }
  }

  return (
    <Drawer
      anchor='right'
      open={addEventSidebarOpen}
      onClose={handleSidebarClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: ['100%', drawerWidth] } }}
    >
      <Box
        className='sidebar-header'
        sx={{
          p: 6,
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant='h5'>
          {store.selectedEvent !== null && store.selectedEvent.title.length ? 'Update Event' : 'Add Event'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {store.selectedEvent !== null && store.selectedEvent.title.length ? (
            <IconButton
              size='small'
              onClick={handleDeleteEvent}
              sx={{ color: 'text.primary', mr: store.selectedEvent !== null ? 1 : 0 }}
            >
              <Icon icon='tabler:trash' fontSize='1.25rem' />
            </IconButton>
          ) : null}
          <IconButton
            size='small'
            onClick={handleSidebarClose}
            sx={{
              p: '0.375rem',
              borderRadius: 1,
              color: 'text.primary',
              backgroundColor: 'action.selected',
              '&:hover': {
                backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.16)`
              }
            }}
          >
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </IconButton>
        </Box>
      </Box>
      <Box className='sidebar-body' sx={{ p: theme => theme.spacing(0, 6, 6) }}>
        <DatePickerWrapper>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
            <Controller
              name='title'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  label='Title'
                  value={value}
                  sx={{ mb: 4 }}
                  onChange={onChange}
                  placeholder='Event Title'
                  error={Boolean(errors.title)}
                  {...(errors.title && { helperText: 'This field is required' })}
                />
              )}
            />
            <CustomTextField
              select
              fullWidth
              sx={{ mb: 4 }}
              label='Type'
              SelectProps={{
                value: values.calendar,
                onChange: e => setValues({ ...values, calendar: e.target.value })
              }}
            >
              {types.map((type, index) => (
                <MenuItem
                  sx={{
                    color: type.typeTitle === 'Feiertag' ? 'FF9F43' : '#03bef7', // Text color
                    backgroundColor: type.typeTitle === 'Feiertag' ? '#FF9F43' : '#E3F7FF' // Background color
                  }}
                  key={index}
                  value={type.id}
                >
                  {type.typeTitle}
                </MenuItem>
              ))}
            </CustomTextField>

            <Autocomplete
              multiple // Enables multiple selection
              options={CourseSchedule} // List of course schedules
              getOptionLabel={option => option.name || ''} // Label shown for each option
              isOptionEqualToValue={(option, value) => option.id === value.id} // Proper comparison for selected value
              value={CourseSchedule?.filter(course => values.guests.includes(course.id)) || []} // Finds selected values
              onChange={(event, newValue) => {
                const selectedIds = newValue.map(option => option.id) // Extracts selected course IDs
                setValues({ ...values, guests: selectedIds }) // Updates state with selected course IDs
              }}
              renderInput={params => (
                <CustomTextField
                  {...params}
                  fullWidth
                  sx={{ mb: 4 }}
                  label='Select Course' // Label for the Autocomplete input field
                  variant='outlined'
                />
              )}
            />

            <Box sx={{ mb: 4 }}>
              <DatePicker
                selectsStart
                id='event-start-date'
                endDate={values.endDate}
                timeFormat='HH:mm'
                selected={values.startDate}
                startDate={values.startDate}
                showTimeSelect={!values.allDay}
                dateFormat={!values.allDay ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd'}
                customInput={<PickersComponent label='Start Date' registername='startDate' />}
                onChange={date => setValues({ ...values, startDate: new Date(date) })}
                onSelect={handleStartDate}
              />
            </Box>
            <Box sx={{ mb: 4 }}>
              <DatePicker
                selectsEnd
                id='event-end-date'
                endDate={values.endDate}
                selected={values.endDate}
                minDate={values.startDate}
                startDate={values.startDate}
                showTimeSelect={!values.allDay}
                timeFormat='HH:mm'
                dateFormat={!values.allDay ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd HH:mm'}
                customInput={<PickersComponent label='End Date' registername='endDate' />}
                onChange={date => setValues({ ...values, endDate: new Date(date) })}
                onSelect={handleEndDate}
              />
            </Box>

            <Controller
              name='description'
              control={control}
              rules={{ required: true }} // Required rule
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  rows={4}
                  multiline
                  fullWidth
                  sx={{ mb: 6.5 }}
                  label='Description'
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.description)} // Show error state
                  helperText={errors.description ? 'This field is required' : ''} // Show helper text
                />
              )}
            />

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <RenderSidebarFooter />
            </Box>
          </form>
        </DatePickerWrapper>
      </Box>
    </Drawer>
  )
}

export default AddEventSidebar
