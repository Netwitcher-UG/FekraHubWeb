import { Autocomplete, Button, Chip, Divider, Drawer, Grid, Typography } from '@mui/material'
import { Box, Stack } from '@mui/system'
import React, { useEffect, useState, useMemo } from 'react'

import styled from '@emotion/styled'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { updateChildInfo } from 'src/store/apps/students'
import CustomTextField from 'src/@core/components/mui/text-field'
import countryList from 'react-select-country-list'
import toast from 'react-hot-toast'

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '24px',
  justifyContent: 'space-between',
  margin: '0px'
}))

const schema = yup.object().shape({
  Street: yup.string().required('Street is required'),
  StreetNr: yup.string().required('Street number is required'),
  City: yup.string().required('City is required'),
  ZipCode: yup.string().required('ZipCode is required')
})

export default function DrawerEdit({ open, handleCloseDrawer, dataDef }) {
  const dispatch = useDispatch()
  const countryOptions = useMemo(() => countryList().getData(), [])
  const defaultValues = {
    Nationality: dataDef?.nationality || '',
    Street: dataDef?.street || '',
    StreetNr: dataDef?.streetNr || '',
    ZipCode: dataDef?.zipCode || '',
    City: dataDef?.city || ''
  }

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onBlur'
  })
  const handleSaveData = async data => {
    if (data.Nationality == '') data = { ...data, Nationality: dataDef?.nationality }

    const updatedData = { ...data, studentId: dataDef?.id }
    const response = await dispatch(updateChildInfo(updatedData))
    if (response?.payload?.status == 200) {
      toast.success('Updated Successfully !')
      handleCloseDrawer()
      reset()
    } else toast.error('Somthing happened please try again !')
  }

  useEffect(() => {
    reset(defaultValues)
  }, [dataDef, reset])

  const [nationality, setNationality] = useState(null)

  useEffect(() => {
    if (dataDef?.nationality) {
      setNationality({ label: dataDef.nationality, value: dataDef.nationality })
    }
  }, [dataDef])

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
          Edit Info
        </Typography>
        <Chip label={`${dataDef?.firstName} ${dataDef?.lastName}`} color='primary' />
      </Header>
      <Divider variant='middle' />
      <Stack padding={4} sx={{ gap: '8px' }}>
        <>
          <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12} sm={12} lg={12}>
              <Controller
                name='Nationality'
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    disableClearable={true}
                    options={countryOptions.map(country => ({
                      value: country.label,
                      label: country.label
                    }))}
                    getOptionLabel={option => option.label || ''}
                    value={nationality}
                    onChange={(event, newValue) => {
                      setNationality(newValue)
                      field.onChange(newValue ? newValue.label : '')
                    }}
                    renderInput={params => (
                      <CustomTextField
                        {...params}
                        fullWidth
                        placeholder='Country / nationality'
                        label='Select Country / nationality'
                        variant='outlined'
                        error={!!errors.Nationality}
                        helperText={errors.Nationality ? errors.Nationality.message : ''}
                      />
                    )}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={12} lg={12}>
              <Controller
                name='Street'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    defaultValue={dataDef?.street}
                    fullWidth
                    label='Street'
                    error={!!errors.Street}
                    helperText={errors.Street?.message}
                    placeholder='Enter your street'
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
              <Controller
                name='StreetNr'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    defaultValue={dataDef?.streetNr}
                    fullWidth
                    label='StreetNr'
                    error={!!errors.StreetNr}
                    helperText={errors.StreetNr?.message}
                    placeholder='Enter your StreetNr'
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
              <Controller
                name='ZipCode'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    defaultValue={dataDef?.zipCode}
                    fullWidth
                    label='ZipCode'
                    error={!!errors.ZipCode}
                    helperText={errors.ZipCode?.message}
                    placeholder='Enter your ZipCode'
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
              <Controller
                name='City'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    defaultValue={dataDef?.city}
                    fullWidth
                    label='City'
                    error={!!errors.City}
                    helperText={errors.City?.message}
                    placeholder='Enter your City'
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
            <Button disabled={isSubmitting} type='button' variant='contained' onClick={handleSubmit(handleSaveData)}>
              Save
            </Button>
            <Button disabled={isSubmitting} type='button' variant='outlined' onClick={handleCloseDrawer}>
              cancel
            </Button>
          </Stack>
        </>
      </Stack>
    </Drawer>
  )
}
