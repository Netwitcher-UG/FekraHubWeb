import { Autocomplete, Button, Chip, Divider, Drawer, Grid, Typography } from '@mui/material'
import { Box, Stack } from '@mui/system'
import React, { useEffect } from 'react'

import styled from '@emotion/styled'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import CustomTextField from 'src/@core/components/mui/text-field'
import Translations from 'src/layouts/components/Translations'
import { editLocation, fetchLocation } from 'src/store/apps/location'
import { editRoom } from 'src/store/apps/courses'
import { useTranslation } from 'react-i18next'

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '24px',
  justifyContent: 'space-between',
  margin: '0px'
}))

export default function DrawerEdit({ open, handleCloseDrawer, dataDef }) {
  console.log("🚀 ~ DrawerEdit ~ dataDef:", dataDef)
  const { data: dataTeacher, status, error } = useSelector(state => state.location)

  const dispatch = useDispatch()
  const { t } = useTranslation()
  const defaultValues = {
    name: dataDef?.name,
    locationID: dataDef?.locationId
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
    dispatch(editRoom({ ...data, id: dataDef.id }))
    handleCloseDrawer()
    reset()
  }

  useEffect(() => {
    dispatch(fetchLocation(''))
  }, [dispatch])

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
          <Translations text={t('Edit Room')} />
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
                name='locationID'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <Autocomplete
                    options={dataTeacher?.map(teacher => ({ value: teacher.id, label: teacher.name }))}
                    fullWidth
                    id='autocomplete-UserId'
                    getOptionLabel={option => option.label}
                    value={
                      value ? { value, label: dataTeacher.find(teacher => teacher.id === value)?.name || '' } : null
                    }
                    onChange={(event, newValue) => {
                      onChange(newValue ? newValue.value : '')
                    }}
                    renderInput={params => (
                      <CustomTextField
                        {...params}
                        fullWidth
                        sx={{ mb: 4 }}
                        placeholder=''
                        label={t('Location')}
                        id='validation-billing-select'
                        aria-describedby='validation-billing-select'
                        error={Boolean(errors.locationID)}
                        helperText={errors.locationID?.message || ''}
                      />
                    )}
                  />
                )}
              />
            </Grid>
          </Grid>
        </>
      </Stack>
      <Stack
        sx={{ p: theme => `${theme.spacing(3)} !important`, height: '100%' }}
        direction={'row'}
        alignItems={'end'}
        justifyContent={'flex-start'}
        spacing={4}
      >
        <Button disabled={!isDirty} type='button' variant='contained' onClick={handleSubmit(handleSaveData)}>
          <Translations text={t('Edit Room')} />
        </Button>
        <Button type='button' variant='outlined' onClick={handleCloseDrawer}>
          <Translations text={t('Cancel')} />
        </Button>
      </Stack>
    </Drawer>
  )
}
