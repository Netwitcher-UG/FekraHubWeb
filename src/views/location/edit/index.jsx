import { Button, Chip, Divider, Drawer, Grid, Typography } from '@mui/material'
import { Box, Stack } from '@mui/system'
import React, { useEffect } from 'react'

import styled from '@emotion/styled'
import { Controller, useForm } from 'react-hook-form'
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

export default function DrawerEdit({ open, handleCloseDrawer, dataDef }) {
  const dispatch = useDispatch()

  const defaultValues = {
    name: dataDef?.name,
    street: dataDef?.street,
    streetNr: dataDef?.streetNr,
    zipCode: dataDef?.zipCode,
    city: dataDef?.city
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
    dispatch(editLocation({ ...data, id: dataDef.id }))
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
                name='name'
                defaultValue={dataDef?.name}
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={`${'name'}`}
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
                name='street'
                defaultValue=''
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={`${'street'}`}
                    variant='outlined'
                    error={!!errors.name}
                    helperText={errors.name ? errors.name.message : ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
              <Controller
                name='streetNr'
                defaultValue=''
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={`${'streetNr'}`}
                    variant='outlined'
                    error={!!errors.name}
                    helperText={errors.name ? errors.name.message : ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
              <Controller
                name='zipCode'
                defaultValue=''
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={`${'zipCode'}`}
                    variant='outlined'
                    error={!!errors.name}
                    helperText={errors.name ? errors.name.message : ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
              <Controller
                name='city'
                defaultValue=''
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={`${'city'}`}
                    variant='outlined'
                    error={!!errors.name}
                    helperText={errors.name ? errors.name.message : ''}
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