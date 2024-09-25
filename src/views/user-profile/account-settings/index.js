import { forwardRef, useMemo, useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import useBgColor from 'src/@core/hooks/useBgColor'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import { useDispatch } from 'react-redux'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import InputAdornment from '@mui/material/InputAdornment'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useTranslation } from 'react-i18next'
import CustomTextField from 'src/@core/components/mui/text-field'
import Translations from 'src/layouts/components/Translations'
import Icon from 'src/@core/components/icon'
import { updateCredentials } from 'src/store/apps/account'
import toast from 'react-hot-toast'
// Validation schema for password and confirm password
const getPasswordValidationSchema = t =>
  yup.object().shape({
    Password: yup
      .string()
      .required(t('Password is required'))
      .matches(/[a-z]/, t('Password must contain at least one lowercase letter'))
      .matches(/[A-Z]/, t('Password must contain at least one uppercase letter'))
      .matches(/[0-9]/, t('Password must contain at least one number'))
      .matches(/[\W_]/, t('Password must contain at least one non-alphanumeric character')),
    ConfirmPassword: yup
      .string()
      .oneOf([yup.ref('Password'), null], t('Passwords must match'))
      .required(t('Confirm Password is required'))
  })

const AccountSettingsPage = ({ data }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const bgColors = useBgColor()
  // Email form schema and form management
  const emailSchema = useMemo(
    () =>
      yup.object({
        Email: yup.string().email(t('Email is invalid')).required(t('Email is required'))
      }),
    [t]
  )

  const {
    control: emailControl,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors, isSubmitting: isSubmittingEmail },
    reset: resetEmail
  } = useForm({
    resolver: yupResolver(emailSchema),
    defaultValues: {
      Email: ''
    }
  })

  useEffect(() => {
    if (!data) return
    resetEmail({
      Email: data?.email
    })
    // }
  }, [data, resetEmail])

  // Password form schema and form management
  const passwordSchema = useMemo(() => getPasswordValidationSchema(t), [t])

  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: isSubmittingPassword },
    reset: resetPassword
  } = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: {
      Password: '',
      ConfirmPassword: ''
    }
  })

  const [showPassword, setShowPassword] = useState(false)
  const [editField, setEditField] = useState('') // To handle which field is in edit mode

  // Submit handler for email
  const onSubmitEmail = async data => {
    const response = await dispatch(updateCredentials(data))

    if (response?.payload?.status == 400) toast.error(response?.payload?.data)
    else if (response?.payload?.status == 200) {
      toast.success(<Translations text={'Email updated successfully '} />, 1000)
      setEditField('')
    } else toast.error(response?.payload?.data || 'something went wrong try again !')
  }

  // Submit handler for password
  const onSubmitPassword = async data => {
    const response = await dispatch(updateCredentials(data))

    if (response?.payload?.status == 400) toast.error(response?.payload?.data)
    else if (response?.payload?.status == 200) {
      toast.success(<Translations text={'Password updated successfully '} />, 1000)
      setEditField('')
    } else toast.error(response?.payload?.data || 'something went wrong try again !')
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Card sx={{ pb: 4 }}>
      {/* Form for email */}
      <form onSubmit={handleEmailSubmit(onSubmitEmail)}>
        <CardContent>
          <Grid container spacing={5} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <Typography variant='body' sx={{ fontWeight: 600 }}>
                <Translations text='Account credentials' />
              </Typography>
              <Divider sx={{ my: 2 }} />
            </Grid>

            {/* Email Field */}
            <Grid item xs={12} sm={8}>
              <Controller
                name='Email'
                control={emailControl}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    disabled={editField !== 'email'}
                    type='email'
                    label={<Translations text={'Email'} />}
                    placeholder='carterleonard@gmail.com'
                    error={Boolean(emailErrors.Email)}
                    helperText={emailErrors.Email?.message}
                  />
                )}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={4}
              sx={{ display: 'flex', flexWrap: 'wrap', alignContent: 'flex-end', justifyContent: 'flex-end' }}
            >
              {editField !== 'email' ? (
                <IconButton onClick={() => setEditField('email')}>
                  <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'>
                    <path
                      fill='currentColor'
                      d='M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z'
                    ></path>
                  </svg>
                </IconButton>
              ) : (
                <Box>
                  <Button disabled={isSubmittingEmail} type='submit' sx={{ mr: 2 }} variant='contained'>
                    {isSubmittingEmail ? <CircularProgress size={22} /> : <Translations text={'Save'} />}
                  </Button>
                  <Button
                    disabled={isSubmittingEmail}
                    type='button'
                    color='secondary'
                    variant='tonal'
                    onClick={() => {
                      setEditField('') // Use a semicolon here
                      resetEmail({
                        Email: data?.email
                      })
                    }}
                  >
                    <Translations text={'Cancel'} />
                  </Button>
                </Box>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </form>

      {/* Form for password */}
      <form onSubmit={handlePasswordSubmit(onSubmitPassword)}>
        <CardContent>
          <Grid container spacing={5} sx={{ mt: 2 }}>
            {/* Password Field */}
            <Grid item xs={12} sm={8}>
              <Controller
                name='Password'
                control={passwordControl}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    disabled={editField !== 'password'}
                    label={<Translations text='Password' />}
                    type={showPassword ? 'text' : 'password'}
                    placeholder='············'
                    error={Boolean(passwordErrors.Password)}
                    helperText={passwordErrors.Password?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowPassword}
                            onMouseDown={e => e.preventDefault()}
                            aria-label='toggle password visibility'
                          >
                            <Icon icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={4}
              sx={{ display: 'flex', flexWrap: 'wrap', alignContent: 'flex-end', justifyContent: 'flex-end' }}
            >
              {editField !== 'password' ? (
                <IconButton onClick={() => setEditField('password')}>
                  <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'>
                    <path
                      fill='currentColor'
                      d='M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z'
                    ></path>
                  </svg>
                </IconButton>
              ) : (
                <Box>
                  <Button disabled={isSubmittingPassword} type='submit' sx={{ mr: 2 }} variant='contained'>
                    {isSubmittingPassword ? <CircularProgress size={22} /> : <Translations text={'Save'} />}
                  </Button>
                  <Button
                    disabled={isSubmittingPassword}
                    type='button'
                    color='secondary'
                    variant='tonal'
                    onClick={() => {
                      setEditField('')
                      resetPassword()
                    }}
                  >
                    <Translations text={'Cancel'} />
                  </Button>
                </Box>
              )}
            </Grid>
            {/* Confirm Password Field */}
            {editField === 'password' && (
              <Grid item xs={12} sm={8}>
                <Controller
                  name='ConfirmPassword'
                  control={passwordControl}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      disabled={editField !== 'password'}
                      label={<Translations text='Confirm Password' />}
                      type={showPassword ? 'text' : 'password'}
                      placeholder='············'
                      error={Boolean(passwordErrors.ConfirmPassword)}
                      helperText={passwordErrors.ConfirmPassword?.message}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onClick={handleClickShowPassword}
                              onMouseDown={e => e.preventDefault()}
                              aria-label='toggle password visibility'
                            >
                              <Icon icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Grid>
            )}
          </Grid>
        </CardContent>
      </form>
      <Grid sx={{ mx: 8, mt: 2 }}>
        <Alert icon={false} sx={{ py: 3, ...bgColors.warningLight, '& .MuiAlert-message': { p: 0 } }}>
          <Typography variant='body2' sx={{ mb: 2, color: 'primary.warning' }}>
            <strong>{t('Warning')}:</strong>
            {/* First part of the warning message */}
            {t('When changing email a confirmation link will be sent to your email.')}{' '}
            {/* Second part of the warning message */}
            {t(
              'Please make sure that the new email is valid and working, otherwise you will not be able to access the app!'
            )}
          </Typography>
        </Alert>
      </Grid>
    </Card>
  )
}

export default AccountSettingsPage
