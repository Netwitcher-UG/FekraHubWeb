import { Autocomplete, Button, Chip, Divider, Drawer, Grid, InputAdornment, TextField, Typography } from '@mui/material'
import { Box, Stack } from '@mui/system'
import React, { useEffect, useState } from 'react'

import styled from '@emotion/styled'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { editCourses, FetchCourseScheduleDaysOfWeek } from 'src/store/apps/courses'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useTranslation } from 'react-i18next'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '24px',
  justifyContent: 'space-between',
  margin: '0px'
}))

export default function DrawerEdit({ open, handleCloseDrawer, dataDef, locationData }) {
  // console.log('🚀 ~ DrawerEdit ~ dataDef:', dataDef)
  const { t } = useTranslation()

  const schema = yup.object().shape({
    course: yup.object().shape({
      Price: yup
        .number()
        .required(t('Price is required'))
        .positive(t('Price must be a positive number'))
        .min(1, t('Price must be at least 1')),
      Lessons: yup
        .number()
        .required(t('Lessons are required'))
        .integer(t('Lessons must be an integer'))
        .min(1, t('Lessons must be at least 1')),
      Capacity: yup
        .number()
        .required(t('Capacity is required'))
        .integer(t('Capacity must be an integer'))
        .min(1, t('Capacity must be at least 1')),
      Name: yup.string().required(t('Course Name is required')).min(2, t('Course Name must be at least 2 characters')),
      StartDate: yup.date().required(t('Start Date is required')).nullable(),
      EndDate: yup.date().required(t('End Date is required')).nullable()
    })

    // Additional validation for other fields can go here
  })

  const [location, setLocation] = useState('')

  const { status, error, dataRooms, dataTeacher } = useSelector(state => state.courses)
  const { DaysOfWeeks } = useSelector(state => state.courses)

  const dispatch = useDispatch()

  const defaultValues = {
    course: {
      Name: dataDef?.name,
      Price: dataDef?.price,
      Lessons: dataDef?.lessons,
      Capacity: dataDef?.capacity,
      StartDate: dataDef?.startDate?.slice(0, 10),
      EndDate: dataDef?.endDate.slice(0, 10),
      RoomId: dataDef?.room.id || ''
    },
    TeacherId: dataDef?.teacher.map(teacher => teacher.id) || '',
    LocationId: dataDef?.location?.id || '',
    courseSchedule: dataDef?.courseSchedule || ''
  }
  const [date, setDate] = useState(new Date(dataDef?.startDate))
  const [end_date, setEndDate] = useState(new Date(dataDef?.endDate))

  const {
    control,
    handleSubmit,
    resetField,
    formState: { errors, isDirty },
    reset
  } = useForm({
    // resolver: yupResolver(schema),
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (dataDef?.room) {
      setLocation(prevLocations => [...prevLocations, dataDef?.room])
    }
    dispatch(FetchCourseScheduleDaysOfWeek(''))
  }, [dataDef?.room, dispatch])

  const handleSaveData = data => {
    dispatch(editCourses({ ...data, id: dataDef.id }))
    handleCloseDrawer()
    reset()
    setLocation('')
  }

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'courseSchedule'
  })

  return (
    <Drawer
      open={open}
      anchor='left'
      variant='temporary'
      onClose={handleCloseDrawer}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
      PaperProps={{
        sx: {
          width: { xs: 300, sm: 400 }
        }
      }}
    >
      <Header>
        <Typography
          sx={{
            fontWeight: '800',
            fontSize: '22px'
          }}
        >
          {t('Edit Courses')}
        </Typography>
        <Chip label={dataDef?.name} color='primary' />
      </Header>
      <Divider variant='middle' />
      <Stack padding={4} sx={{ gap: '8px' }}>
        <>
          <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12} sm={12} lg={12}>
              <Controller
                name='course.Name'
                rules={{ required: true }}
                defaultValue={dataDef?.name}
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={`${t('Name')}`}
                    variant='outlined'
                    error={!!errors.Name}
                    helperText={errors.Name ? errors.Name.message : ''}
                  />
                )}
              />
              <Typography>{errors.Name ? errors.Name.message : ''}</Typography>
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
              <Controller
                name='course.Price'
                rules={{ required: true }}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('Price')}
                    type='number'
                    variant='outlined'
                    fullWidth
                    error={!!errors.Price}
                    helperText={errors.Price ? errors.Price.message : ''}
                    InputProps={{
                      endAdornment: <InputAdornment position='end'>€</InputAdornment>
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
              <Controller
                name='course.Lessons'
                rules={{ required: true }}
                defaultValue=''
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={`${t('Lessons')}`}
                    variant='outlined'
                    error={!!errors.Lessons}
                    helperText={errors.Lessons ? errors.Lessons.message : ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
              <Controller
                name='course.Capacity'
                rules={{ required: true }}
                defaultValue=''
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={`${t('Capacity')}`}
                    variant='outlined'
                    error={!!errors.Capacity}
                    helperText={errors.Capacity ? errors.Capacity.message : ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
              <DatePickerWrapper>
                <Controller
                  name='course.startDate'
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      selected={date}
                      dateFormat='dd-MM-yyyy'
                      id='date-picker-months'
                      onChange={date => {
                        setDate(date)
                        field.onChange(date)
                      }}
                      placeholderText='Click to select a date'
                      customInput={<CustomTextField label='Basic' fullWidth />}
                    />
                  )}
                />
              </DatePickerWrapper>
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
              <DatePickerWrapper>
                <Controller
                  name='course.endDate'
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      selected={end_date}
                      dateFormat='dd-MM-yyyy'
                      id='date-picker-months'
                      onChange={date => {
                        setEndDate(date)
                        field.onChange(date)
                      }}
                      placeholderText='Click to select a end date'
                      customInput={<CustomTextField label='Basic' fullWidth />}
                    />
                  )}
                />
              </DatePickerWrapper>
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
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
            <Grid item xs={12} sm={12} lg={12}>
              <Controller
                name='LocationId'
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    fullWidth
                    options={locationData}
                    // Handle how to display the selected option
                    getOptionLabel={option => option.name || ''}
                    // Customize equality check
                    isOptionEqualToValue={(option, value) => option.id === value}
                    // Handle selection changes
                    onChange={(event, value) => {
                      const selectedId = value ? value.room : ''
                      field.onChange(value.id) // Update the form state with the selected option's ID
                      setLocation(selectedId) // Optionally update local component state
                    }}
                    // Set the selected value
                    value={locationData.find(option => option.id === field.value) || null}
                    // Render the input field
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
            <Grid item xs={12} sm={12} lg={12}>
              {location.length !== 0 ? (
                <Grid item xs={12} sm={12} lg={12}>
                  <Controller
                    name='course.RoomId'
                    control={control}
                    render={({ field: { onChange, value, ref } }) => (
                      <Autocomplete
                        options={location}
                        getOptionLabel={option => option.name || ''}
                        renderInput={params => (
                          <CustomTextField
                            {...params}
                            label={t('Select Room')}
                            variant='outlined'
                            inputRef={ref}
                            error={!!errors.RoomId}
                            helperText={errors.RoomId ? errors.RoomId.message : ''}
                          />
                        )}
                        onChange={(event, newValue) => {
                          onChange(newValue ? newValue.id : '')
                        }}
                        value={location.find(room => room.id === value) || null}
                      />
                    )}
                  />
                </Grid>
              ) : (
                ''
              )}
            </Grid>
            <Box sx={{ marginLeft: '12px', width: '100%' }}>
              {fields.map((field, index) => (
                <Box key={field.id} sx={{ marginY: '24px' }}>
                  <Grid item xs={12} sm={12} lg={12}>
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
                              sx={{ marginBottom: '12px' }}
                              error={!!errors.courseSchedule?.[index]?.EmailServer}
                              helperText={errors.courseSchedule?.[index]?.EmailServer?.message}
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
                  <Controller
                    name={`courseSchedule.${index}.startTime`}
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        type='time'
                        label={`${t('Start Time')} ${index + 1}`}
                        sx={{ marginBottom: '12px' }}
                        error={!!errors.courseSchedule?.[index]?.startTime}
                        helperText={errors.courseSchedule?.[index]?.startTime?.message}
                      />
                    )}
                  />

                  <Controller
                    name={`courseSchedule.${index}.endTime`}
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        type='time'
                        sx={{ marginBottom: '12px' }}
                        label={`${t('End Time')} ${index + 1}`}
                        error={!!errors.courseSchedule?.[index]?.endTime}
                        helperText={errors.courseSchedule?.[index]?.endTime?.message}
                      />
                    )}
                  />

                  <Button variant='text' color='error' onClick={() => remove(index)}>
                    {t('Remove')}
                  </Button>
                </Box>
              ))}

              <Button variant='outlined' sx={{ marginY: '14px' }} onClick={() => append({ EmailServer: '' })}>
                {t('Add New course Schedule')}
              </Button>
            </Box>
          </Grid>
          <Stack
            sx={{ p: theme => `${theme.spacing(3)} !important` }}
            direction={'row'}
            alignItems={'center'}
            justifyContent={'flex-start'}
            spacing={4}
          >
            <Button type='button' variant='contained' onClick={handleSubmit(handleSaveData)}>
              {t('Update Courses')}
            </Button>
            <Button type='button' variant='outlined' onClick={handleCloseDrawer}>
              {t('Cancel')}
            </Button>
          </Stack>
        </>
      </Stack>
    </Drawer>
  )
}
