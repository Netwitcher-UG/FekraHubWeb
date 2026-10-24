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
import DatePicker, { registerLocale } from 'react-datepicker'
import de from 'date-fns/locale/de'
import en from 'date-fns/locale/en-US'
import { fetchReportKeys, addReport } from 'src/store/apps/reports'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from 'react-redux'
import CircularProgress from '@mui/material/CircularProgress'
import { useTranslation } from 'react-i18next'

registerLocale('de', de)
registerLocale('en', en)

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

const getCurrentMonthEnd = () => {
  const now = new Date()

  return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
}

const CustomDatePickerWrapper = styled(DatePickerWrapper)({
  '& .react-datepicker-popper': {
    zIndex: 2000
  }
})

export default function AddReportDrawer({ open, handleCloseDrawer, rowData }) {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchReportKeys())
  }, [dispatch])

  const { reportKeys } = useSelector(state => state.reports)
  const { t, i18n } = useTranslation()
  const dateLocale = i18n.language === 'de' ? 'de' : 'en'
  const schema = yup.object().shape({
    reportDate: yup.date().required(t('Date is required')).max(getCurrentMonthEnd(), t('Date is required')),
    ...reportKeys.reduce((acc, key) => {
      acc[key] = yup.string().required(<Translations text={`${key} ${t('is required')}`} />)
      return acc
    }, {})
  })

  const defaultValues = {
    reportDate: new Date(),
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
    watch,
    setError,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (open) {
      setValue('reportDate', new Date())
    }
  }, [open, setValue])

  const selectedReportDate = watch('reportDate')
  const chipDate = selectedReportDate instanceof Date ? selectedReportDate : new Date()
  const monthLabel = chipDate.toLocaleString(dateLocale === 'de' ? 'de-DE' : 'en-US', { month: 'long' })
  const yearLabel = chipDate.getFullYear()

  const onSubmit = async data => {
    const reportData = [
      {
        studentId: rowData?.id,
        data: JSON.stringify(
          reportKeys.reduce((acc, key) => {
            acc[key] = data[key]
            return acc
          }, {})
        )
      }
    ]

    const response = await dispatch(
      addReport({
        data: reportData,
        month: data.reportDate.getMonth() + 1,
        year: data.reportDate.getFullYear()
      })
    )
    if (response?.payload?.status == 200) {
      handleCloseDrawer()
      toast.success(<Translations text={'Report submitted successfully '} />)
    } else if (response?.payload?.status == 400) {
      const errorMessage = response?.payload?.data?.message || response?.payload?.data
      toast.error(typeof errorMessage === 'string' ? errorMessage : <Translations text={'Something went wrong try again !'} />)
    } else toast.error(<Translations text={'Something went wrong try again !'} />)
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
          <StudentName>
            <Translations text={'Submitting report for :'} />
          </StudentName>
          <Typography variant='h6' component='span'>
            {rowData.firstName} {rowData.lastName}
          </Typography>
        </HeaderText>
        <DateChip label={`${monthLabel} / ${yearLabel}`} color='info' />
      </Header>

      <Divider variant='middle' />
      <Stack padding={4} sx={{ gap: '8px' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ p: 4, borderRadius: 1, backgroundColor: 'action.hover' }}>
            <Typography
              variant='body2'
              sx={{ mb: 3, color: 'primary.main', fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase' }}
            >
              <Translations text={'Month'} />
              <Box component='span' sx={{ color: 'error.main' }}>
                {' '}
                *
              </Box>
            </Typography>
            <Controller
              name='reportDate'
              control={control}
              render={({ field }) => (
                <CustomDatePickerWrapper>
                  <DatePicker
                    selected={field.value}
                    onChange={field.onChange}
                    showMonthYearPicker
                    dateFormat='MMMM / yyyy'
                    maxDate={getCurrentMonthEnd()}
                    locale={dateLocale}
                    onChangeRaw={event => event.preventDefault()}
                    customInput={
                      <CustomTextField
                        fullWidth
                        error={Boolean(errors.reportDate)}
                        helperText={errors.reportDate?.message}
                      />
                    }
                    placeholderText={t('Month')}
                  />
                </CustomDatePickerWrapper>
              )}
            />
          </Box>

          <Divider sx={{ my: 5 }} />

          <Box sx={{ p: 4, mb: 4, borderRadius: 1, backgroundColor: 'action.hover' }}>
            <Typography
              variant='body2'
              sx={{ mb: 4, color: 'primary.main', fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase' }}
            >
              <Translations text={'Report Info'} />
              <Box component='span' sx={{ color: 'error.main' }}>
                {' '}
                *
              </Box>
            </Typography>
            <Grid container rowSpacing={4}>
              {reportKeys.map(key => (
                <Grid item xs={12} key={key}>
                  <Controller
                    name={key}
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        required
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
          </Box>
          {reportKeys.length > 0 && (
            <>
              <Divider variant='middle' />
              <Grid sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button disabled={isSubmitting} color='primary' sx={{ m: 2 }} variant='contained' type='submit'>
                  {isSubmitting ? <CircularProgress size={25} color='secondary' /> : t('Submit report')}
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
            </>
          )}
        </form>
      </Stack>
    </Drawer>
  )
}
