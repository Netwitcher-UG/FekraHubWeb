import { useState } from 'react'
import Link from 'next/link'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import CircularProgress from '@mui/material/CircularProgress'
import MuiCard from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import themeConfig from 'src/configs/themeConfig'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import AuthIllustrationV1Wrapper from 'src/views/pages/auth/AuthIllustrationV1Wrapper'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import { useAuth } from 'src/hooks/useAuth'
import 'react-datepicker/dist/react-datepicker.css'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import MenuItem from '@mui/material/MenuItem'
import toast from 'react-hot-toast'
// import VerifyEmailV1 from '../pages/auth/verify-email-v1'
import VerifyEmailV1 from 'src/@core/components/email-verification/verify-email'

const CustomDatePickerWrapper = styled(DatePickerWrapper)({
  '& .react-datepicker-popper': {
    zIndex: 1500
  }
})

const Card = styled(MuiCard)(({ theme }) => ({
  width: '100%'
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const RegisterV1 = () => {
  const auth = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [isregistedDone, setIsregistedDone] = useState(false)
  const theme = useTheme()

  const schema = yup.object().shape({
    username: yup.string().required('Username is required'),
    password: yup
      .string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d])[\s\S]{6,}$/,
        'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one non-alphabetic character'
      ),
    email: yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: yup.number().typeError('Must be a number').min(9, 'Must be at least 9 digits'),
    firstName: yup.string().required('Firstname is required'),
    lastname: yup.string().required('Lastname is required'),
    emergencyPhoneNumber: yup.number().typeError('Must be a number').min(9, 'Must be at least 9 digits'),
    birthplace: yup.string().required('Birthplace is required'),
    nationality: yup.string().required('Nationality is required'),
    street: yup.string().required('Street is required'),
    streetNr: yup.string().required('Street number is required'),
    city: yup.string().required('City is required'),
    job: yup.string().required('Job is required'),
    graduation: yup.string().required('Graduation is required'),
    birthday: yup.date().nullable().required('Birthday is required'),
    gender: yup.string().required('Gender is required')
  })

  const {
    watch,
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      password: '',
      email: '',
      phoneNumber: Number(''),
      firstName: '',
      lastname: '',
      emergencyPhoneNumber: Number(''),
      birthplace: '',
      nationality: '',
      street: '',
      streetNr: '',
      city: '',
      job: '',
      graduation: '',
      birthday: null,
      gender: ''
    }
  })
  const emailValue = watch('email')
  const onSubmit = async data => {
    const parsedDate = new Date(data?.birthday)
    const formattedDate = parsedDate?.toLocaleDateString('en-US')
    try {
      const formData = new FormData()
      formData.append('username', data.username)
      formData.append('password', data.password)
      formData.append('email', data.email)
      formData.append('phoneNumber', data.phoneNumber.toString())
      formData.append('firstName', data.firstName)
      formData.append('lastname', data.lastname)
      formData.append('emergencyPhoneNumber', data.emergencyPhoneNumber.toString())
      formData.append('birthplace', data.birthplace)
      formData.append('nationality', data.nationality)
      formData.append('street', data.street)
      formData.append('streetNr', data.streetNr)
      formData.append('city', data.city)
      formData.append('job', data.job)
      formData.append('graduation', data.graduation)
      formData.append('birthday', data.birthday ? formattedDate : '')

      formData.append('gender', data.gender)

      const response = await auth.register(formData)
      if (response?.status == 400) toast.error(response.data)
      else if (response?.status == 200) setIsregistedDone(true)
    } catch (error) {
      console.error('Error registering user:', error)
    }
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <>
      {!isregistedDone ? (
        <Box className='content-center' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <AuthIllustrationV1Wrapper sx={{ width: '80%' }}>
            <Card>
              <CardContent
                sx={{ p: `${theme.spacing(10.5)} ${theme.spacing(8)} ${theme.spacing(8)} !important`, width: '100%' }}
              >
                <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width={34} viewBox='0 0 32 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      fill={theme.palette.primary.main}
                      d='M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z'
                    />
                    <path
                      fill='#161616'
                      opacity={0.06}
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z'
                    />
                    <path
                      fill='#161616'
                      opacity={0.06}
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z'
                    />
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      fill={theme.palette.primary.main}
                      d='M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z'
                    />
                  </svg>
                  <Typography variant='h3' sx={{ ml: 2.5, fontWeight: 700 }}>
                    Register To {themeConfig.templateName}
                  </Typography>
                </Box>
                <Box sx={{ mb: 6 }}>
                  <Typography variant='h4' sx={{ mb: 1.5 }}>
                    Adventure starts here 🚀
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>Make your app management easy and fun!</Typography>
                </Box>

                <form
                  noValidate
                  autoComplete='off'
                  onSubmit={handleSubmit(onSubmit)}
                  style={{ width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}
                >
                  <Grid container spacing={5}>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='username'
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            autoFocus
                            fullWidth
                            id='username'
                            label='Username'
                            placeholder='John.doe'
                            error={!!errors.username}
                            helperText={errors.username?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='email'
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            fullWidth
                            type='email'
                            label='Email'
                            placeholder='john.doe@gmail.com'
                            error={!!errors.email}
                            helperText={errors.email?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='password'
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            fullWidth
                            label='Password'
                            placeholder='············'
                            id='auth-register-password'
                            type={showPassword ? 'text' : 'password'}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position='end'>
                                  <IconButton
                                    edge='end'
                                    onClick={handleClickShowPassword}
                                    onMouseDown={e => e.preventDefault()}
                                    aria-label='toggle password visibility'
                                  >
                                    <Icon fontSize='1.25rem' icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                                  </IconButton>
                                </InputAdornment>
                              )
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='phoneNumber'
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            fullWidth
                            label='Phone Number'
                            placeholder='Enter your phone number'
                            type='tel'
                            error={!!errors.phoneNumber}
                            helperText={errors.phoneNumber?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='firstName'
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            fullWidth
                            label='First Name'
                            placeholder='Enter your first name'
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='lastname'
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            fullWidth
                            label='Last Name'
                            placeholder='Enter your last name'
                            error={!!errors.lastname}
                            helperText={errors.lastname?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='gender'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <CustomTextField
                            select
                            fullWidth
                            label='Gender'
                            id='validation-gender-select'
                            aria-describedby='validation-gender-select'
                            error={!!errors.gender}
                            helperText={errors.gender?.message}
                            defaultValue=''
                            SelectProps={{
                              value: value,
                              onChange: e => onChange(e),
                              displayEmpty: true
                            }}
                          >
                            <MenuItem value='' disabled>
                              <em>Select Gender</em>
                            </MenuItem>
                            <MenuItem key={1} value={'male'}>
                              Male
                            </MenuItem>
                            <MenuItem key={2} value={'female'}>
                              Female
                            </MenuItem>
                          </CustomTextField>
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='emergencyPhoneNumber'
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            fullWidth
                            label='Emergency Phone Number'
                            placeholder='Enter your emergency phone number'
                            type='tel' // Restrict input to numbers
                            error={!!errors.emergencyPhoneNumber}
                            helperText={errors.emergencyPhoneNumber?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='birthday'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <Box>
                            <CustomDatePickerWrapper>
                              <DatePicker
                                selected={value}
                                onChange={onChange}
                                dateFormat='yyyy/MM/dd'
                                customInput={<CustomTextField label='Birthday' fullWidth />}
                                placeholderText='Birthday'
                                error={!!errors.birthday}
                                helperText={errors.birthday?.message}
                                popperProps={{
                                  modifiers: [
                                    {
                                      name: 'preventOverflow',
                                      options: {
                                        altBoundary: true,
                                        rootBoundary: 'viewport',
                                        tether: false,
                                        flip: {
                                          behavior: ['bottom']
                                        }
                                      }
                                    }
                                  ]
                                }}
                              />
                              {errors.birthday && (
                                <Typography fontSize={12.5} color={'error'}>
                                  {errors.birthday?.message}
                                </Typography>
                              )}
                            </CustomDatePickerWrapper>
                          </Box>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='birthplace'
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            fullWidth
                            label='Birthplace'
                            error={!!errors.birthplace}
                            helperText={errors.birthplace?.message}
                            placeholder='Enter your birthplace'
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='nationality'
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            fullWidth
                            label='Nationality'
                            placeholder='Enter your nationality'
                            error={!!errors.nationality}
                            helperText={errors.nationality?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='street'
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            fullWidth
                            label='Street'
                            error={!!errors.street}
                            helperText={errors.street?.message}
                            placeholder='Enter your street'
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='streetNr'
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            fullWidth
                            error={!!errors.streetNr}
                            helperText={errors.streetNr?.message}
                            label='Street Number'
                            placeholder='Enter your street number'
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='city'
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            fullWidth
                            label='City'
                            placeholder='Enter your city'
                            error={!!errors.city}
                            helperText={errors.city?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='job'
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            fullWidth
                            label='Job'
                            placeholder='Enter your job'
                            error={!!errors.job}
                            helperText={errors.job?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='graduation'
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            fullWidth
                            label='Graduation'
                            error={!!errors.graduation}
                            helperText={errors.graduation?.message}
                            placeholder='Enter your graduation'
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={24} sm={12}>
                      <Button fullWidth disabled={isSubmitting} type='submit' variant='contained' sx={{ mb: 4 }}>
                        {isSubmitting ? <CircularProgress size={25} /> : 'Sign up'}
                      </Button>
                    </Grid>
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', ml: 4 }}
                    >
                      <Typography sx={{ color: 'text.secondary', mr: 2 }}>Already have an account?</Typography>
                      <Typography
                        component={LinkStyled}
                        href='/login'
                        sx={{ fontSize: theme.typography.body1.fontSize }}
                      >
                        Sign in instead
                      </Typography>
                    </Box>
                    <Divider
                      sx={{
                        color: 'text.disabled',
                        '& .MuiDivider-wrapper': { px: 6 },
                        fontSize: theme.typography.body2.fontSize,
                        my: `${theme.spacing(6)} !important`
                      }}
                    ></Divider>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </AuthIllustrationV1Wrapper>
        </Box>
      ) : (
        <VerifyEmailV1 email={emailValue} resend={true} handleResend={() => auth.resendEmail(emailValue)} />
      )}
    </>
  )
}

RegisterV1.getLayout = page => <BlankLayout>{page}</BlankLayout>
RegisterV1.guestGuard = true
export default RegisterV1
