import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'
import {
  Autocomplete,
  InputAdornment,
  Slide,
  Stack
  //  TextField
} from '@mui/material'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { addCourses, FetchCourseScheduleDaysOfWeek } from 'src/store/apps/courses'
import { fetchLocation } from 'src/store/apps/location'
import Icon from 'src/@core/components/icon'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Box } from '@mui/system'
import { useTranslation } from 'react-i18next'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { setHours, setMinutes } from 'date-fns'

const CustomCloseButton = styled(IconButton)(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

const AddCourses = ({ dataRooms, dataTeacher }) => {
  const { t } = useTranslation()

  const schema = yup.object().shape({
    course: yup.object().shape({
      price: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .required(t('Price is required'))
        .positive(t('Price must be a positive number'))
        .min(1, t('Price must be at least 1')),
      lessons: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .required(t('Lessons are required'))
        .integer(t('Lessons must be an integer'))
        .min(1, t('Lessons must be at least 1')),
      capacity: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .required(t('Capacity is required'))
        .integer(t('Capacity must be an integer'))
        .min(1, t('Capacity must be at least 1')),
      roomId: yup.string().required(t('Room ID is required')),
      name: yup.string().required(t('Course Name is required')).min(2, t('Course Name must be at least 2 characters')),
      startDate: yup
        .date()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .required(t('Start Date is required'))
        .nullable(),
      endDate: yup
        .date()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .required(t('End Date is required'))
        .nullable()
        .min(yup.ref('startDate'), t('End Date cannot be before Start Date'))
    }),

    courseSchedule: yup.array().of(
      yup.object().shape({
        dayOfWeek: yup
          .string()
          .test(
            'day-of-week-required',
            t('Day of the Week is required if start or end time is provided'),
            function (value) {
              const { startTime, endTime } = this.parent
              return !(startTime || endTime) || Boolean(value)
            }
          ),
        startTime: yup.string().nullable(),
        endTime: yup
          .string()
          .nullable()
          .test('end-after-start', t('End Time cannot be before Start Time'), function (value) {
            const { startTime } = this.parent
            return !startTime || !value || value >= startTime
          })
      })
    )
  })

  // console.log('🚀 ~ AddCourses ~ dataTeacher:', dataTeacher)
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0) // Step control
  const [location, setLocation] = useState('')
  // console.log('🚀 ~ AddCourses ~ location:', location)
  const [roomOptions, setRoomOptions] = useState([])

  const dispatch = useDispatch()
  const { data: DataLocation } = useSelector(state => state.location)
  const { DaysOfWeeks } = useSelector(state => state.courses)
  // console.log('🚀 ~ AddCourses ~ DaysOfWeeks:', DaysOfWeeks)

  useEffect(() => {
    dispatch(fetchLocation(''))
    dispatch(FetchCourseScheduleDaysOfWeek(''))
  }, [dispatch])

  const defaultValues = {
    LocationId: '',
    courseSchedule: [{ dayOfWeek: '', endTime: '', startTime: '' }],
    course: {
      roomId: '',
      name: '',
      price: 0,
      lessons: '',
      capacity: '',
      startDate: '',
      endDate: ''
    }
  }

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid }
  } = useForm({ defaultValues, mode: 'onBlur', resolver: yupResolver(schema) })

  // console.log('🚀 ~ AddCourses ~ errors:', isValid)
  const handleNextStep = () => {
    if (step === 0) {
      const selectedRooms = dataRooms.filter(room => room.LocationId === location)
      setRoomOptions(selectedRooms)
    }
    setStep(prev => prev + 1)
  }
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'courseSchedule'
  })

  const handleSaveData = data => {
    console.log('🚀 ~ handleSaveData ~ data:', data)
    dispatch(addCourses(data))

    handleClose()
  }
  const handleClose = () => {
    setOpen(false)
    setStep(0)
    setLocation('')
    setRoomOptions([])
    reset()
  }

  return (
    <div>
      <Button onClick={() => setOpen(true)} variant='contained'>
        <Icon icon='tabler:plus' />
        {t('Add Courses')}
      </Button>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogTitle>
          <Typography variant='h4'>{t('Add Courses')}</Typography>
          <CustomCloseButton aria-label='close' onClick={handleClose}>
            <Icon icon='tabler:x' />
          </CustomCloseButton>
        </DialogTitle>
        <DialogContent>
          {step === 0 && (
            <Grid container>
              <Grid item xs={12} sm={12} lg={12} md={12} sx={{ width: '700px' }}>
                <Controller
                  name='LocationId'
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      fullWidth
                      options={DataLocation}
                      getOptionLabel={option => option.name || ''}
                      onChange={(event, value) => {
                        const selectedId = value ? value : ''
                        field.onChange(selectedId)
                        setLocation(selectedId)
                      }}
                      renderInput={params => (
                        <CustomTextField
                          fullWidth
                          {...params}
                          label={t('Select Location')}
                          variant='outlined'
                          error={!!errors.LocationId}
                          helperText={errors.LocationId ? errors.LocationId.message : ''}
                        />
                      )}
                    />
                  )}
                />
              </Grid>
            </Grid>
          )}
          {step === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name='course.roomId'
                  control={control}
                  render={({ field: { onChange, value, ref } }) => (
                    <Autocomplete
                      options={location.room}
                      getOptionLabel={option => option.name || ''}
                      renderInput={params => (
                        <CustomTextField
                          {...params}
                          label={t('Select Room')}
                          variant='outlined'
                          inputRef={ref}
                          error={!!errors.course?.roomId}
                          helperText={errors.course?.roomId ? errors.course?.roomId.message : ''}
                        />
                      )}
                      onChange={(event, newValue) => {
                        onChange(newValue ? newValue.id : '')
                      }}
                      value={location.room.find(room => room.id === value) || null}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name='TeacherId'
                  control={control}
                  render={({ field: { onChange, value, ref } }) => (
                    <Autocomplete
                      multiple
                      options={dataTeacher}
                      getOptionLabel={option => option.firstName || ''}
                      renderInput={params => (
                        <CustomTextField
                          {...params}
                          label={t('Teacher')}
                          variant='outlined'
                          inputRef={ref}
                          error={!!errors.TeacherId}
                          helperText={errors.TeacherId ? errors.TeacherId.message : ''}
                        />
                      )}
                      onChange={(event, newValue) => {
                        onChange(newValue.map(option => option.id))
                      }}
                      value={dataTeacher.filter(t => value?.includes(t.id)) || []}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name='course.name'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      label={t('Course Name')}
                      variant='outlined'
                      fullWidth
                      error={!!errors.course?.name}
                      helperText={errors.course?.name ? errors.course.name.message : ''}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name='course.price'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      label={t('Price')}
                      type='number'
                      variant='outlined'
                      fullWidth
                      error={!!errors.course?.price}
                      helperText={errors.course?.price ? errors.course.price.message : ''}
                      InputProps={{
                        endAdornment: <InputAdornment position='end'>€</InputAdornment>
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name='course.lessons'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      label={t('Lessons')}
                      type='number'
                      variant='outlined'
                      fullWidth
                      error={!!errors.course?.lessons}
                      helperText={errors.course?.lessons ? errors.course.lessons.message : ''}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name='course.capacity'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      label={t('Capacity')}
                      variant='outlined'
                      type='number'
                      fullWidth
                      error={!!errors.course?.capacity}
                      helperText={errors.course?.capacity ? errors.course.capacity.message : ''}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <DatePickerWrapper>
                  <Controller
                    name='course.startDate'
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value ? new Date(field.value) : null}
                        dateFormat='dd-MM-yyyy'
                        id='date-picker-months'
                        onChange={date => {
                          field.onChange(date)
                        }}
                        isClearable
                        placeholderText={t('Click to select a date')}
                        customInput={
                          <CustomTextField 
                            label={t('Start Date')} 
                            fullWidth 
                            error={!!errors.course?.startDate}
                            helperText={errors.course?.startDate?.message}
                          />
                        }
                      />
                    )}
                  />
                </DatePickerWrapper>
              </Grid>
              <Grid item xs={12}>
                <DatePickerWrapper>
                  <Controller
                    name='course.endDate'
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value ? new Date(field.value) : null}
                        dateFormat='dd-MM-yyyy'
                        id='date-picker-months'
                        onChange={date => {
                          field.onChange(date)
                        }}
                        isClearable
                        placeholderText={t('Click to select a end date')}
                        customInput={
                          <CustomTextField 
                            label={t('End Date')} 
                            fullWidth 
                            error={!!errors.course?.endDate}
                            helperText={errors.course?.endDate?.message}
                          />
                        }
                      />
                    )}
                  />
                </DatePickerWrapper>
              </Grid>
            </Grid>
          )}
          {step === 2 && (
            <>
              {fields.map((field, index) => (
                <Grid container spacing={2} key={field.id}>
                  <Grid item xs={12}>
                    <Controller
                      name={`courseSchedule.${index}.dayOfWeek`}
                      control={control}
                      render={({ field: { onChange, value, ref } }) => (
                        <Autocomplete
                          options={DaysOfWeeks}
                          getOptionLabel={option => option || ''}
                          renderInput={params => (
                            <CustomTextField
                              {...params}
                              label={t('Day of the Week')}
                              variant='outlined'
                              inputRef={ref}
                              error={!!errors.courseSchedule?.[index]?.dayOfWeek}
                              helperText={errors.courseSchedule?.[index]?.dayOfWeek?.message}
                            />
                          )}
                          onChange={(event, newValue) => {
                            onChange(newValue ? newValue : '')
                          }}
                          value={DaysOfWeeks.find(t => t === value) || null}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <DatePickerWrapper>
                      <Controller
                        name={`courseSchedule.${index}.startTime`}
                        control={control}
                        render={({ field }) => (
                          <DatePicker
                            selected={field.value ? new Date(`1970-01-01T${field.value}`) : null}
                            onChange={date => {
                              if (date) {
                                const timeString = date.toLocaleTimeString('en-US', { 
                                  hour12: false,
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                                field.onChange(timeString)
                              } else {
                                field.onChange('')
                              }
                            }}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="HH:mm"
                            isClearable
                            placeholderText="Select time"
                            customInput={
                              <CustomTextField
                                fullWidth
                                label={`${t('Start Time')} ${index + 1}`}
                                error={!!errors.courseSchedule?.[index]?.startTime}
                                helperText={errors.courseSchedule?.[index]?.startTime?.message}
                              />
                            }
                          />
                        )}
                      />
                    </DatePickerWrapper>
                  </Grid>

                  <Grid item xs={12}>
                    <DatePickerWrapper>
                      <Controller
                        name={`courseSchedule.${index}.endTime`}
                        control={control}
                        render={({ field }) => (
                          <DatePicker
                            selected={field.value ? new Date(`1970-01-01T${field.value}`) : null}
                            onChange={date => {
                              if (date) {
                                const timeString = date.toLocaleTimeString('en-US', { 
                                  hour12: false,
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                                field.onChange(timeString)
                              } else {
                                field.onChange('')
                              }
                            }}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="HH:mm"
                            isClearable
                            placeholderText="Select time"
                            customInput={
                              <CustomTextField
                                fullWidth
                                label={`${t('End Time')} ${index + 1}`}
                                error={!!errors.courseSchedule?.[index]?.endTime}
                                helperText={errors.courseSchedule?.[index]?.endTime?.message}
                              />
                            }
                          />
                        )}
                      />
                    </DatePickerWrapper>
                  </Grid>

                  <Grid item xs={12}>
                    <Button sx={{ marginLeft: '16px' }} variant='text' color='error' onClick={() => remove(index)}>
                      {t('Remove')}
                    </Button>
                  </Grid>
                </Grid>
              ))}

              <Button variant='outlined' sx={{ marginY: '24px' }} onClick={() => append({ EmailServer: '' })}>
                {t('Add New course Schedule')}
              </Button>
            </>
          )}
        </DialogContent>
        <DialogActions>
          {step > 0 && (
            <Button onClick={() => setStep(prev => prev - 1)} color='primary'>
              {t('Back')}
            </Button>
          )}
          {step < 2 ? (
            <Button onClick={handleNextStep} disabled={location.length === 0} color='primary'>
              {t('Next')}
            </Button>
          ) : (
            <Button onClick={handleSubmit(handleSaveData)} disabled={!isValid} color='primary'>
              {!isValid ? t('please have required fields') : t('save')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default AddCourses
