import { Button, Chip, Divider, Drawer, Grid, Typography, CircularProgress } from '@mui/material'
import { t } from 'i18next'
import { Box, Stack } from '@mui/system'
import CustomTextField from 'src/@core/components/mui/text-field'
import React, { useEffect, useState } from 'react'
import { updateReport } from 'src/store/apps/reports'
import Translations from 'src/layouts/components/Translations'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'

import styled from '@emotion/styled'
import { useDispatch } from 'react-redux'

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3),
  justifyContent: 'space-between'
}))

const HeaderText = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start'
}))

const StudentName = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.25rem',
  marginBottom: theme.spacing(0.5)
}))

const DateChip = styled(Chip)(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: 500
}))

const date = new Date()
const month = date.toLocaleString('default', { month: 'long' })
const year = date.getFullYear()

export default function EditReportDrawer({ open, handleCloseDrawer, rowData }) {
  const dispatch = useDispatch()

  const parsedReportData = JSON.parse(rowData.data)

  const schema = yup.object().shape(
    Object.keys(parsedReportData).reduce((acc, key) => {
      acc[key] = yup.string().required(`${key} ${t('is required')}`)
      return acc
    }, {})
  )

  const defaultValues = {}
  Object.keys(parsedReportData).forEach(key => {
    defaultValues[key] = parsedReportData[key]
  })

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const watchedValues = useWatch({ control })

  const [isChanged, setIsChanged] = useState(false)

  useEffect(() => {
    const hasChanged = Object.keys(parsedReportData).some(key => watchedValues[key] !== defaultValues[key])
    setIsChanged(hasChanged)
  }, [watchedValues, defaultValues, parsedReportData])

  const onSubmit = async data => {
    const updatedReport = {
      data: JSON.stringify(data),
      id: rowData.id
    }
    const response = await dispatch(updateReport(updatedReport))
    if (response?.payload?.status == 200) {
      handleCloseDrawer()
      toast.success(<Translations text={t('Report updated successfully')} />)
    } else if (response?.payload?.status == 400) toast.error(<Translations text={response?.payload?.data} />)
    else toast.error(<Translations text={t('Something went wrong try again !')} />)
  }

  return (
    <Drawer
      open={open}
      anchor='left'
      variant='temporary'
      onClose={handleCloseDrawer}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 350, sm: 500 } } }}
      PaperProps={{
        sx: {
          width: { xs: 350, sm: 500 }
        }
      }}
    >
      <Header>
        <HeaderText>
          <StudentName>{t('Updating report for')}:</StudentName>
        </HeaderText>
        <Typography variant='h6' component='span'>
          {rowData?.student?.firstName} {rowData?.student?.lastName}
        </Typography>
        {/* <DateChip label={`${month} / ${year}`} color='info' /> */}
      </Header>

      <Divider variant='middle' />
      <Stack padding={4} sx={{ gap: '8px' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            {Object.keys(parsedReportData).map(key => (
              <Grid item xs={12} sm={12} lg={12} key={key}>
                <Controller
                  name={key}
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      label={<Translations text={t(key)} />}
                      fullWidth
                      defaultValue={parsedReportData[key]}
                      error={Boolean(errors[key])}
                      helperText={errors[key]?.message}
                    />
                  )}
                />
              </Grid>
            ))}
          </Grid>

          <Divider variant='middle' />
          <Grid sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              disabled={isSubmitting || !isChanged}
              color='primary'
              sx={{ m: 2 }}
              variant='contained'
              type='submit'
            >
              {isSubmitting ? <CircularProgress size={25} color='secondary' /> : t('Update report')}
            </Button>
            <Button
              type='button'
              color='secondary'
              variant='outlined'
              disabled={isSubmitting}
              onClick={handleCloseDrawer}
            >
              {t('Close')}
            </Button>
          </Grid>
        </form>
      </Stack>
    </Drawer>
  )
}
