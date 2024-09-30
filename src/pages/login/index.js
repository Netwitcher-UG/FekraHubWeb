// ** React Imports
import { useState, useMemo } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel from '@mui/material/FormControlLabel'
import { useTranslation } from 'react-i18next'
import { Grid } from '@mui/material'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import useBgColor from 'src/@core/hooks/useBgColor'
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'

const LoginIllustration = styled('img')(({ theme }) => ({
  maxHeight: '100vh', // Adjust max height to fit the viewport
  objectFit: 'contain', // Ensure the image scales properly
  width: '100%', // Allow image to scale based on its aspect ratio
  [theme.breakpoints.down('md')]: {
    display: 'none' // Hide image on small screens
  }
}))

const RightWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  boxShadow: '0px 0px 20px rgba(128, 128, 128, 0.2)', // Soft shadow effect
  [theme.breakpoints.up('md')]: {
    maxWidth: 450 // Adjust width for medium screens
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 600 // Adjust width for large screens
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: '100%' // Limit to half the screen on extra-large screens
  }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`,
  '&:hover': {
    textDecoration: 'underline' // Add underline on hover for accessibility
  }
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    color: theme.palette.text.secondary
  }
}))
const getValidationSchema = t =>
  yup.object().shape({
    email: yup.string().email(t('Email must be valid')).required(t('Email is required')),
    password: yup.string().required(t('Password is required'))
  })

const defaultValues = {
  password: '',
  email: ''
}

const LoginPage = () => {
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false)
  const [badRequestError, setBadRequestError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { t } = useTranslation()
  const schema = useMemo(() => getValidationSchema(t), [t])
  // ** Hooks
  const auth = useAuth()
  const theme = useTheme()
  const bgColors = useBgColor()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // ** Vars
  const { skin } = settings

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = async data => {
    const { email, password } = data
    setEmailNotConfirmed(false)
    setBadRequestError('')
    await auth.login({ email, password, setEmailNotConfirmed, setBadRequestError }, () => {
      setError('email', {
        type: 'manual',
        message: t('Email or Password is invalid')
      })
    })
  }
  const imageSource = skin === 'bordered' ? 'auth-v2-login-illustration-bordered' : 'auth-v2-login-illustration'

  return (
    <Box className='content-right' sx={{ backgroundColor: 'background.paper' }}>
      {!hidden ? <LoginIllustration alt={t('login-illustration')} src={`/images/logos/loginpage.png`} /> : null}
      <RightWrapper>
        <Box
          sx={{
            p: [6, 12],
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} width={'100%'}>
              <img src='/images/logos/logo.svg' alt='logo' width={150} height={150} />
            </Box>
            <Box sx={{ my: 6 }}>
              <Typography variant='h3' sx={{ mb: 1.5 }}>
                {t('Welcome to')} {`${themeConfig.templateName}`}! 👋🏻
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>{t('Please sign-in to your account')}</Typography>
            </Box>
            {emailNotConfirmed && (
              // <Alert icon={false} sx={{ py: 3, mb: 6, ...bgColors.primaryLight, '& .MuiAlert-message': { p: 0 } }}>
              //   <Typography variant='body2' sx={{ mb: 2, color: 'warning.main' }}>
              //     {t('Your account is not activated! The confirmation link was resent to your email please check it')}
              //   </Typography>
              // </Alert>
              <Grid item xs={12} sm={6} sx={{ m: 4 }}>
                <Alert severity='warning'>
                  {' '}
                  {t('Your account is not activated! The confirmation link was resent to your email please check it')}
                </Alert>
              </Grid>
            )}
            {badRequestError != '' && (
              <Grid item xs={12} sm={6} sx={{ m: 4 }}>
                <Alert severity='error'> {t(badRequestError)}</Alert>
              </Grid>
            )}
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ mb: 4 }}>
                <Controller
                  name='email'
                  control={control}
                  // rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      autoFocus
                      label={t('Email')}
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      placeholder={t('Email')}
                      error={Boolean(errors.email)}
                      {...(errors.email && { helperText: errors.email.message })}
                    />
                  )}
                />
              </Box>
              <Box sx={{ mb: 1.5 }}>
                <Controller
                  name='password'
                  control={control}
                  // rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      onBlur={onBlur}
                      label={t('Password')}
                      placeholder='........'
                      onChange={onChange}
                      id='auth-login-v2-password'
                      error={Boolean(errors.password)}
                      {...(errors.password && { helperText: errors.password.message })}
                      type={showPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onMouseDown={e => e.preventDefault()}
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              <Icon fontSize='1.25rem' icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Box>
              <Box
                sx={{
                  mb: 1.75,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                {/* <FormControlLabel
                  label={t('Remember Me')}
                  control={<Checkbox checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />}
                /> */}
                <Typography component={LinkStyled} href='/forgot-password'>
                  {t('Forgot Password?')}
                </Typography>
              </Box>
              <Button fullWidth disabled={isSubmitting} type='submit' variant='contained' sx={{ mb: 4 }}>
                {isSubmitting ? <CircularProgress size={25} /> : t('Login')}
              </Button>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Typography sx={{ color: 'text.secondary', mr: 2 }}>{t('Do not have an account?')}</Typography>
                <Typography href='/register' component={LinkStyled}>
                  {t('Register')}
                </Typography>
              </Box>
              {/* <Divider
                sx={{
                  color: 'text.disabled',
                  '& .MuiDivider-wrapper': { px: 6 },
                  fontSize: theme.typography.body2.fontSize,
                  my: theme => `${theme.spacing(6)} !important`
                }}
              >
                {t('or')}
              </Divider>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconButton href='/' component={Link} sx={{ color: '#497ce2' }} onClick={e => e.preventDefault()}>
                  <Icon icon='mdi:facebook' />
                </IconButton>
                <IconButton href='/' component={Link} sx={{ color: '#1da1f2' }} onClick={e => e.preventDefault()}>
                  <Icon icon='mdi:twitter' />
                </IconButton>
                <IconButton
                  href='/'
                  component={Link}
                  onClick={e => e.preventDefault()}
                  sx={{ color: theme => (theme.palette.mode === 'light' ? '#272727' : 'grey.300') }}
                >
                  <Icon icon='mdi:github' />
                </IconButton>
                <IconButton href='/' component={Link} sx={{ color: '#db4437' }} onClick={e => e.preventDefault()}>
                  <Icon icon='mdi:google' />
                </IconButton>
              </Box> */}
            </form>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  )
}
LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>
LoginPage.guestGuard = true

export default LoginPage
