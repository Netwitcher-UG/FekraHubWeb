import { Button, Chip, Divider, Drawer, Grid, Typography } from '@mui/material'
import { Box, Stack } from '@mui/system'
import React, { useEffect } from 'react'

import styled from '@emotion/styled'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch } from 'react-redux'
import CustomTextField from 'src/@core/components/mui/text-field'
import Translations from 'src/layouts/components/Translations'
import { editLocation } from 'src/store/apps/location'

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '24px',
  justifyContent: 'space-between',
  margin: '0px'
}))
const schema = yup.object().shape({
  locationMdl: yup.object().shape({
  name: yup.string().required('name is required'),
  street: yup.string().required('street is required'),
  streetNr: yup.string().required('streetNr is required'),
  zipCode: yup.string().required('zipCode is required'),
  city: yup.string().required('city is required')
  })
})

export default function DrawerEdit({ open, handleCloseDrawer, dataDef }) {
  console.log("🚀 ~ DrawerEdit ~ dataDef:", dataDef)
  const dispatch = useDispatch()

  const defaultValues = {
    locationMdl:{
      name: dataDef?.name,
      street: dataDef?.street,
      streetNr: dataDef?.streetNr,
      zipCode: dataDef?.zipCode,
      city: dataDef?.city,
    },
    rooms:dataDef?.room
  }

  const {
    control,
    handleSubmit,
    resetField,
    formState: { errors, isDirty },
    setValue,
    reset
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onBlur'
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'rooms'
  });

  const handleSaveData = data => {
    setValue('id',dataDef.id)
    dispatch(editLocation({ formData:data, id: dataDef.id }))
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
            fontWeight: '800',
            fontSize: '22px'
          }}
        >
          <Translations text={'Edit Location'} />
        </Typography>
        <Chip label={dataDef?.name} color='primary' />
      </Header>
      <Divider variant='middle' />
      <Stack padding={4} sx={{ gap: '8px' }}>
        <>
          <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12} sm={12} lg={12}>
              <Controller
                name='locationMdl.name'
                defaultValue={dataDef?.name}
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={`${'name'}`}
                    variant='outlined'
                    error={!!errors.locationMdl?.name}
                    helperText={errors.locationMdl?.name ? errors.locationMdl.name.message : ''}
                  />
                )}
              />
              <Typography>{errors.locationMdl?.name ? errors.locationMdl.name.message : ''}</Typography>
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
              <Controller
                name='locationMdl.street'
                defaultValue=''
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={`${'street'}`}
                    variant='outlined'
                    error={!!errors.locationMdl?.street}
                    helperText={errors.locationMdl?.street ? errors.locationMdl?.street.message : ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
              <Controller
                name='locationMdl.streetNr'
                defaultValue=''
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={`${'streetNr'}`}
                    variant='outlined'
                    error={!!errors.locationMdl?.streetNr}
                    helperText={errors.locationMdl?.streetNr ? errors.locationMdl?.streetNr?.message : ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
              <Controller
                name='locationMdl.zipCode'
                defaultValue=''
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={`${'zipCode'}`}
                    variant='outlined'
                    error={!!errors.locationMdl?.zipCode}
                    helperText={errors.locationMdl?.zipCode ? errors.locationMdl?.zipCode?.message : ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
              <Controller
                name='locationMdl.city'
                defaultValue=''
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={`${'city'}`}
                    variant='outlined'
                    error={!!errors.locationMdl?.city}
                    helperText={errors.locationMdl?.city ? errors.locationMdl?.city.message : ''}
                  />
                )}
              />
            </Grid>

            {fields.map((field, index) => (
  <>
   <Controller
    name={`rooms.${index}.id`}
    control={control}
    defaultValue={field.id} // Make sure the ID value is provided
    render={({ field }) => <input type="hidden" {...field} />}
  />
    <Grid item xs={8} sm={8} lg={8} key={field.id}>
      <Controller
        name={`rooms.${index}.name`}
        control={control}
        render={({ field }) => (
          <CustomTextField
            {...field}
            fullWidth
            type="text"
            label={`Room ${index + 1}`}
            error={!!errors.rooms?.[index]}
            helperText={errors.rooms?.[index]?.message}
          />
        )}
      />
    </Grid>


  </>
))}

          </Grid>
          <Stack
            sx={{ p: theme => `${theme.spacing(3)} !important` }}
            direction={'row'}
            alignItems={'center'}
            justifyContent={'flex-start'}
            spacing={4}
          >
            <Button disabled={!isDirty} type='button' variant='contained' onClick={handleSubmit(handleSaveData)}>
              <Translations text={'Edit Location'} />
            </Button>
            <Button type='button' variant='outlined' onClick={handleCloseDrawer}>
              <Translations text={'cancel'} />
            </Button>
          </Stack>
        </>
      </Stack>
    </Drawer>
  )
}
