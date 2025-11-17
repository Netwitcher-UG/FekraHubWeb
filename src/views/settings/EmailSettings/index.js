import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Button, CircularProgress, Grid, InputAdornment, Skeleton } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import { fetchSchoolInfoEmailSender, updateSchoolInfoEmailSender } from 'src/store/apps/settings'

const EmailSettings = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { schoolInfoEmailSender, schoolInfoEmailSenderLoading, schoolInfoEmailSenderUpdating } = useSelector(
    state => state.settings
  )
  const [showPassword, setShowPassword] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      emailServer: '',
      emailPortNumber: '',
      fromEmail: '',
      password: ''
    }
  })

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchSchoolInfoEmailSender())
  }, [dispatch])

  // Update form when data is loaded
  useEffect(() => {
    if (schoolInfoEmailSender) {
      // Handle both direct data and wrapped data structures
      const data = schoolInfoEmailSender.data || schoolInfoEmailSender

      if (data && (data.emailServer || data.fromEmail)) {
        reset({
          emailServer: data.emailServer || '',
          emailPortNumber: data.emailPortNumber || '',
          fromEmail: data.fromEmail || '',
          password: data.password || ''
        })
      }
    }
  }, [schoolInfoEmailSender, reset])

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const onSubmit = async data => {
    try {
      await dispatch(
        updateSchoolInfoEmailSender({
          emailServer: data.emailServer,
          emailPortNumber: data.emailPortNumber,
          fromEmail: data.fromEmail,
          password: data.password
        })
      ).unwrap()
    } catch (error) {
      console.error('Error updating email settings:', error)
    }
  }

  if (schoolInfoEmailSenderLoading) {
    return (
      <Box sx={{ margin: '20px 0' }}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={6}>
            <Skeleton variant='text' width='100%' height={56} sx={{ mb: 1 }} />
            <Skeleton variant='rectangular' width='100%' height={56} sx={{ borderRadius: 1 }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Skeleton variant='text' width='100%' height={56} sx={{ mb: 1 }} />
            <Skeleton variant='rectangular' width='100%' height={56} sx={{ borderRadius: 1 }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Skeleton variant='text' width='100%' height={56} sx={{ mb: 1 }} />
            <Skeleton variant='rectangular' width='100%' height={56} sx={{ borderRadius: 1 }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Skeleton variant='text' width='100%' height={56} sx={{ mb: 1 }} />
            <Skeleton variant='rectangular' width='100%' height={56} sx={{ borderRadius: 1 }} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant='rectangular' width={200} height={40} sx={{ borderRadius: 1 }} />
          </Grid>
        </Grid>
      </Box>
    )
  }

  return (
    <Box sx={{ margin: '20px 0' }}>
      <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={5}>
          {/* Email Server */}
          <Grid item xs={12} sm={6}>
            <Controller
              name='emailServer'
              control={control}
              rules={{ required: t('Email Server is required') }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label={t('Email Server')}
                  placeholder='smtp.example.com'
                  error={!!errors.emailServer}
                  helperText={errors.emailServer?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Icon icon='tabler:server' />
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />
          </Grid>

          {/* Email Port Number */}
          <Grid item xs={12} sm={6}>
            <Controller
              name='emailPortNumber'
              control={control}
              rules={{
                required: t('Email Port Number is required'),
                pattern: {
                  value: /^[0-9]+$/,
                  message: t('Port number must be a valid number')
                }
              }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label={t('Email Port Number')}
                  placeholder='587'
                  type='number'
                  error={!!errors.emailPortNumber}
                  helperText={errors.emailPortNumber?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Icon icon='tabler:hash' />
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />
          </Grid>

          {/* From Email */}
          <Grid item xs={12} sm={6}>
            <Controller
              name='fromEmail'
              control={control}
              rules={{
                required: t('From Email is required'),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t('Invalid email address')
                }
              }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label={t('From Email')}
                  placeholder='info@example.com'
                  type='email'
                  error={!!errors.fromEmail}
                  helperText={errors.fromEmail?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Icon icon='tabler:mail' />
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />
          </Grid>

          {/* Password */}
          <Grid item xs={12} sm={6}>
            <Controller
              name='password'
              control={control}
              rules={{ required: t('Password is required') }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label={t('Password')}
                  placeholder={t('Enter password')}
                  type={showPassword ? 'text' : 'password'}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Icon icon='tabler:lock' />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position='end'>
                        <Icon
                          icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'}
                          onClick={handleClickShowPassword}
                          style={{ cursor: 'pointer' }}
                          fontSize='1.25rem'
                        />
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              disabled={schoolInfoEmailSenderUpdating}
              type='submit'
              variant='contained'
              sx={{ mb: 4 }}
              startIcon={schoolInfoEmailSenderUpdating ? <CircularProgress size={20} /> : <Icon icon='tabler:check' />}
            >
              {schoolInfoEmailSenderUpdating ? t('Saving...') : t('Save Changes')}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}

export default EmailSettings
