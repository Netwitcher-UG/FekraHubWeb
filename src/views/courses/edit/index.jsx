import { Autocomplete, Button, Chip, Divider, Drawer, Grid, InputAdornment, TextField, Typography } from '@mui/material'
import { Box, Stack } from '@mui/system'
import React, { useEffect, useState } from 'react'

import styled from '@emotion/styled'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { editCourses } from 'src/store/apps/courses'
import CustomTextField from 'src/@core/components/mui/text-field'

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '24px',
  justifyContent: 'space-between',
  margin: '0px'
}))

const schema = yup.object().shape({
  Price: yup
    .number()
    .required('Price is required')
    .positive('Price must be a positive number')
    .min(1, 'Price must be at least 1'),

  Lessons: yup
    .number()
    .required('Lessons are required')
    .integer('Lessons must be an integer')
    .min(1, 'Lessons must be at least 1'),

  Capacity: yup
    .number()
    .required('Capacity is required')
    .integer('Capacity must be an integer')
    .min(1, 'Capacity must be at least 1'),
  Name: yup.string().required('Course Name is required').min(2, 'Course Name must be at least 2 characters'),
  TeacherId: yup.string().required('Teacher is required'),
  StartDate: yup.date().required('Start Date is required').nullable(),
  EndDate: yup.date().required('End Date is required').nullable().min(yup.ref('StartDate'))
})

export default function DrawerEdit({ open, handleCloseDrawer, dataDef, locationData }) {
  const [location, setLocation] = useState('')

  const { status, error, dataRooms, dataTeacher } = useSelector(state => state.courses)

  const dispatch = useDispatch()

  const defaultValues = {
    Name: dataDef?.name,
    Price: dataDef?.price,
    Lessons: dataDef?.lessons,
    Capacity: dataDef?.capacity,
    StartDate: dataDef?.startDate?.slice(0, 10),
    EndDate: dataDef?.endDate.slice(0, 10),
    TeacherId: dataDef?.teacher[0]?.id  || '',
    RoomId: dataDef?.room.id || '',
    LocationId:dataDef?.location?.id || ''
  }

  const {
    control,
    handleSubmit,
    resetField,
    formState: { errors, isDirty },
    reset
  } = useForm({
    // resolver: yupResolver(schema),
    defaultValues,
    mode: 'onBlur'
  })

  useEffect(() => {
    if (dataDef?.room) {
      setLocation(prevLocations => [...prevLocations, dataDef?.room]);
    }
  }, [dataDef?.room])

  const handleSaveData = data => {
    dispatch(editCourses({ ...data, id: dataDef.id }))
    handleCloseDrawer()
    reset()
    setLocation('')
  }

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
          Edit Courses
        </Typography>
        <Chip label={dataDef?.name} color='primary' />
      </Header>
      <Divider variant='middle' />
      <Stack padding={4} sx={{ gap: '8px' }}>
        <>
          <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12} sm={12} lg={12}>
              <Controller
                name='Name'
                rules={{ required: true }}
                defaultValue={dataDef?.name}
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={`${'Name'}`}
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
                name='Price'
                rules={{ required: true }}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='Price'
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
                name='Lessons'
                rules={{ required: true }}
                defaultValue=''
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={`${'Lessons'}`}
                    variant='outlined'
                    error={!!errors.Lessons}
                    helperText={errors.Lessons ? errors.Lessons.message : ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
              <Controller
                name='Capacity'
                rules={{ required: true }}
                defaultValue=''
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={`${'Capacity'}`}
                    variant='outlined'
                    error={!!errors.Capacity}
                    helperText={errors.Capacity ? errors.Capacity.message : ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
              <Controller
                name='StartDate'
                rules={{ required: true }}
                defaultValue=''
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={`${'StartDate'}`}
                    variant='outlined'
                    type='date'
                    error={!!errors.StartDate}
                    helperText={errors.StartDate ? errors.StartDate.message : ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
              <Controller
                name='EndDate'
                defaultValue=''
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={`${'EndDate'}`}
                    variant='outlined'
                    type='date'
                    error={!!errors.EndDate}
                    helperText={errors.EndDate ? errors.EndDate.message : ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
            <Controller
  name='TeacherId'
  control={control}
  render={({ field: { onChange, value, ref } }) => (
    <Autocomplete
      options={dataTeacher}
      getOptionLabel={option => option.firstName || ''}
      renderInput={params => (
        <CustomTextField
          {...params}
          label='Teacher'
          variant='outlined'
          placeholder='No teacher please select one'
          inputRef={ref}
          error={!!errors.TeacherId}
          helperText={errors.TeacherId ? errors.TeacherId.message : ''}
        />
      )}

      // Handle option selection
      onChange={(event, newValue) => {
        onChange(newValue ? newValue.id : '');
      }}
      value={dataTeacher.find(option => option.id === value) || null}
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
        const selectedId = value ? value.room : '';
        field.onChange(value.id); // Update the form state with the selected option's ID
        setLocation(selectedId);    // Optionally update local component state
      }}

      // Set the selected value
      value={locationData.find(option => option.id === field.value) || null}

      // Render the input field
      renderInput={params => (
        <CustomTextField
          fullWidth
          {...params}
          label='Select Location'
          variant='outlined'
          error={!!errors.LocationId}
          helperText={errors.LocationId ? errors.LocationId.message : ''}
        />
      )}
    />
  )}
/>


            </Grid>
            {location.length !== 0 ? (
              <Grid item xs={12} sm={12} lg={12}>
                <Controller
                  name='RoomId'
                  control={control}
                  render={({ field: { onChange, value, ref } }) => (
                    <Autocomplete
                      options={location}
                      getOptionLabel={option => option.name || ''}
                      renderInput={params => (
                        <CustomTextField
                          {...params}
                          label='Select Room'
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
          <Stack
            sx={{ p: theme => `${theme.spacing(3)} !important` }}
            direction={'row'}
            alignItems={'center'}
            justifyContent={'flex-start'}
            spacing={4}
          >
            <Button type='button' variant='contained' onClick={handleSubmit(handleSaveData)}>
              Update Courses
            </Button>
            <Button type='button' variant='outlined' onClick={handleCloseDrawer}>
              cancel
            </Button>
          </Stack>
        </>
      </Stack>
    </Drawer>
  )
}
