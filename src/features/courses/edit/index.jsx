import {
  Autocomplete,
  Avatar,
  Button,
  Checkbox,
  Chip,
  Divider,
  Drawer,
  Grid,
  Radio,
  TextField,
  Typography
} from '@mui/material'
import { Box, Stack } from '@mui/system'
import React, { useEffect } from 'react'

import styled from '@emotion/styled'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { editCourses } from 'src/store/apps/courses'

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '24px',
  justifyContent: 'space-between',
  margin: '0px'
}))

export default function DrawerEdit({ open, handleCloseDrawer, dataDef }) {
  console.log('🚀 ~ DrawerEdit ~ data:', dataDef?.room?.name)
  const { status, error, dataRooms, dataTeacher } = useSelector(state => state.courses)

  const dispatch = useDispatch()

  const defaultValues = {
    Name: dataDef?.name,
    Price: dataDef?.price,
    Lessons: dataDef?.lessons,
    Capacity: dataDef?.capacity,
    StartDate: dataDef?.startDate?.slice(0, 10),
    EndDate: dataDef?.endDate.slice(0, 10),
    UserId: dataDef?.userId || '',
    RoomId: dataDef?.room?.id || ''
  }

  const {
    control,
    handleSubmit,
    resetField,
    formState: { errors, isDirty },
    reset
  } = useForm({
    // resolver: yupResolver(Schema),
    defaultValues,
    mode: 'onBlur'
  })

  const handleSaveData = data => {
    console.log('🚀 ~ handleSaveData ~ data:', data)
    dispatch(editCourses({ ...data, id: dataDef.id }))
    handleCloseDrawer()
    reset()
  }

  return (
    <Drawer
      open={open}
      anchor='lift'
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
            color: '#3B3B3B',
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
                defaultValue={dataDef?.name}
                control={control}
                render={({ field }) => (
                  <TextField
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
                defaultValue=''
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={`${'Price'}`}
                    variant='outlined'
                    error={!!errors.name}
                    helperText={errors.name ? errors.name.message : ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
              <Controller
                name='Lessons'
                defaultValue=''
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={`${'Lessons'}`}
                    variant='outlined'
                    error={!!errors.name}
                    helperText={errors.name ? errors.name.message : ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
              <Controller
                name='Capacity'
                defaultValue=''
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={`${'Capacity'}`}
                    variant='outlined'
                    error={!!errors.name}
                    helperText={errors.name ? errors.name.message : ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
              <Controller
                name='StartDate'
                defaultValue=''
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={`${'StartDate'}`}
                    variant='outlined'
                    error={!!errors.name}
                    helperText={errors.name ? errors.name.message : ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
              <Controller
                name='EndDate'
                defaultValue=''
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={`${'EndDate'}`}
                    variant='outlined'
                    error={!!errors.name}
                    helperText={errors.name ? errors.name.message : ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
              <Controller
                name='UserId'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Autocomplete
                    options={dataTeacher?.map(teacher => ({ value: teacher.id, label: teacher.firstName })) || []}
                    fullWidth
                    id='autocomplete-UserId'
                    getOptionLabel={option => option.label}
                    value={
                      value
                        ? { value, label: dataTeacher.find(teacher => teacher.id === value)?.firstName || '' }
                        : null
                    }
                    onChange={(event, newValue) => {
                      onChange(newValue ? newValue.value : undefined)
                    }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        fullWidth
                        sx={{ mb: 4 }}
                        placeholder=''
                        label='User'
                        id='validation-billing-select'
                        aria-describedby='validation-billing-select'
                        error={Boolean(errors.UserId)}
                        helperText={errors.UserId?.message || ''}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
              <Controller
                name='RoomId'
                control={control}
                // rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <Autocomplete
                    options={dataRooms?.map(room => ({ value: room.id, label: room.name })) || []}
                    fullWidth
                    id='autocomplete-RoomId'
                    getOptionLabel={option => option.label}
                    value={value ? { value, label: dataRooms.find(room => room.id === value)?.name || '' } : null}
                    onChange={(event, newValue) => {
                      onChange(newValue ? newValue.value : defaultValues.RoomId)
                    }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        fullWidth
                        sx={{ mb: 4 }}
                        placeholder=''
                        label='Room'
                        id='validation-billing-select'
                        aria-describedby='validation-billing-select'
                        error={Boolean(errors.RoomId)}
                        helperText={errors.RoomId?.message || ''}
                      />
                    )}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Stack
            sx={{ p: theme => `${theme.spacing(3)} !important` }}
            direction={'row'}
            alignItems={'center'}
            justifyContent={'flex-start'}
            spacing={4}
          >
            <Button disabled={!isDirty} type='button' variant='contained' onClick={handleSubmit(handleSaveData)}>
              Add Courses
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
