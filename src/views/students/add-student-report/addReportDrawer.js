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
import { t } from 'i18next'
import { Box, Stack } from '@mui/system'
import CustomTextField from 'src/@core/components/mui/text-field'
import React, { useEffect } from 'react'
import Translations from 'src/layouts/components/Translations'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import { fetchReportKeys, addReport } from 'src/store/apps/reports'

import styled from '@emotion/styled'
import { useDispatch, useSelector } from 'react-redux'
import CircularProgress from '@mui/material/CircularProgress'

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '24px',
  justifyContent: 'space-between',
  margin: '0px'
}))

const CustomDatePickerWrapper = styled(DatePickerWrapper)({
  '& .react-datepicker-popper': {
    zIndex: 1500
  }
})

export default function AddReportDrawer({ open, handleCloseDrawer, rowData }) {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchReportKeys())
  }, [dispatch])

  const { reportKeys } = useSelector(state => state.reports)

  const schema = yup.object().shape({
    creationDate: yup.date().required(<Translations text={'Date is required'} />),
    ...reportKeys.reduce((acc, key) => {
      acc[key] = yup.string().required(<Translations text={`${key} is required`} />)
      return acc
    }, {})
  })

  const defaultValues = {
    creationDate: null,
    ...reportKeys.reduce((acc, key) => {
      acc[key] = ''
      return acc
    }, {})
  }

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

  const onSubmit = async data => {
    const reportData = [
      {
        creationDate: data.creationDate,
        studentId: rowData?.id,
        data: JSON.stringify(
          reportKeys.reduce((acc, key) => {
            acc[key] = data[key]
            return acc
          }, {})
        )
      }
    ]

    const response = await dispatch(addReport(reportData))
    if (response?.payload?.status == 200) {
      handleCloseDrawer()
      toast.success(<Translations text={'Report submitted successfully '} />)
    } else if (response?.payload?.status == 400) toast.error(<Translations text={response?.payload?.data} />)
    else toast.error(<Translations text={'Something went wrong try again !'} />)
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
        <Typography
          sx={{
            fontWeight: '800',
            fontSize: '22px'
          }}
        >
          Submit a report for student : {rowData.firstName} {rowData.lastName}
        </Typography>
      </Header>
      <Divider variant='middle' />
      <Stack padding={4} sx={{ gap: '8px' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12} sm={12} lg={12}>
              <Controller
                name='creationDate'
                control={control}
                render={({ field }) => (
                  <Box sx={{ mb: 4 }}>
                    <CustomDatePickerWrapper>
                      <DatePicker
                        selected={field.value}
                        onChange={field.onChange}
                        dateFormat='yyyy/MM/dd'
                        customInput={
                          <CustomTextField
                            label={<Translations text={'Date'} />}
                            fullWidth
                            error={Boolean(errors.creationDate)}
                            helperText={errors.creationDate?.message}
                          />
                        }
                        placeholderText={t('Date')}
                      />
                    </CustomDatePickerWrapper>
                  </Box>
                )}
              />
            </Grid>
          </Grid>
          <Typography
            sx={{
              fontSize: '15px',
              m: 2
            }}
          >
            Report Info
          </Typography>
          <Divider variant='middle' />

          <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ mt: 2, mb: 4 }}>
            {' '}
            {reportKeys.map(key => (
              <Grid item xs={12} sm={12} lg={12} key={key}>
                <Controller
                  name={key}
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      label={<Translations text={key} />}
                      fullWidth
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
            <Button color='primary' sx={{ m: 2 }} variant='contained' type='submit'>
              {isSubmitting ? <CircularProgress size={25} color='secondary' /> : 'Submit report'}
            </Button>
            <Button
              type='button'
              color='secondary'
              variant='outlined'
              disabled={isSubmitting}
              onClick={handleCloseDrawer}
            >
              Close
            </Button>
          </Grid>
        </form>
      </Stack>
    </Drawer>
  )
}
