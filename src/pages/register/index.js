import { useState, useMemo } from 'react'
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
import { Autocomplete } from '@mui/material'
import countryList from 'react-select-country-list'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'

const getValidationSchema = t =>
  yup.object().shape({
    password: yup
      .string()
      .required(t('Password is required'))
      .min(6, t('Password must be at least 6 characters'))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d])[\s\S]{6,}$/,
        t(
          'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one non-alphabetic character'
        )
      ),
    email: yup.string().email(t('Invalid email')).required(t('Email is required')),
    firstName: yup.string().required(t('Firstname is required')),
    lastname: yup.string().required(t('Lastname is required')),
    phoneNumber: yup
      .string()
      .required(t('Phone Number is required'))
      .matches(/^\d{10,}$/, t('Phone Number must be at least 10 digits')), // At least 10 digits
    emergencyPhoneNumber: yup
      .string()
      .required(t('Emergency Phone Number is required'))
      .matches(/^\d{10,}$/, t('Emergency Phone Number must be at least 10 digits')),
    birthplace: yup.string().required(t('Birthplace is required')),
    nationality: yup.string().required(t('Nationality is required')),
    street: yup.string().required(t('Street is required')),
    streetNr: yup.string().required(t('Street number is required')),
    zipCode: yup.string().required(t('ZipCode is required')),
    city: yup.string().required(t('City is required')),
    job: yup.string().required(t('Job is required')),
    graduation: yup.string().required(t('Graduation is required')),
    birthday: yup.date().nullable().required(t('Birthday is required')),
    gender: yup.string().required(t('Gender is required'))
  })
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
  const countryOptions = useMemo(() => countryList().getData(), [])
  const theme = useTheme()
  const { t } = useTranslation()
  const schema = useMemo(() => getValidationSchema(t), [t])

  const {
    watch,
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      // username: '',
      password: '',
      email: '',
      phoneNumber: null,
      firstName: '',
      lastname: '',
      emergencyPhoneNumber: null,
      birthplace: '',
      nationality: '',
      street: '',
      streetNr: '',
      city: '',
      job: '',
      graduation: '',
      birthday: null,
      gender: '',
      zipCode: ''
    }
  })
  const emailValue = watch('email')
  const onSubmit = async data => {
    const parsedDate = new Date(data?.birthday)
    const formattedDate = parsedDate?.toLocaleDateString('en-US')
    try {
      const formData = new FormData()
      // formData.append('username', data.username)
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
      formData.append('zipCode', data.zipCode)
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
                  <Image width={34} height={40} src={'/images/favicon.png'} />
                  <Typography variant='h3' sx={{ ml: 2.5, fontWeight: 700 }}>
                    {t('Register To')} {themeConfig.templateName}
                  </Typography>
                </Box>
                <Box sx={{ mb: 6 }}>
                  <Typography variant='h4' sx={{ mb: 1.5 }}>
                    {t('Adventure starts here')} 🚀
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    {t('Make your school management easy and fun!')}
                  </Typography>
                </Box>

                <form
                  noValidate
                  autoComplete='off'
                  onSubmit={handleSubmit(onSubmit)}
                  style={{ width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}
                >
                  <Grid container spacing={5}>
                    {/* <Grid item xs={12} sm={6}>
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
                    </Grid> */}
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='email'
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            fullWidth
                            type='email'
                            label={t('Email')}
                            placeholder={t('Enter your email')}
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
                            label={t('Password')}
                            placeholder={t('············')}
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
                                    aria-label={t('Toggle password visibility')}
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
                            label={t('Phone Number')}
                            placeholder={t('Enter your phone number')}
                            type='number'
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
                            label={t('First Name')}
                            placeholder={t('Enter your first name')}
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
                            label={t('Last Name')}
                            placeholder={t('Enter your last name')}
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
                            label={t('Gender')}
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
                            <MenuItem value='' sx={{ display: 'none' }}>
                              <em>{t('Select Gender')}</em>
                            </MenuItem>
                            <MenuItem key={1} value={'male'}>
                              {t('Male')}
                            </MenuItem>
                            <MenuItem key={2} value={'female'}>
                              {t('Female')}
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
                            label={t('Emergency Phone Number')}
                            placeholder={t('Enter your emergency phone number')}
                            type='number' // Restrict input to numbers
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
                                dateFormat='dd.MM.yyyy'
                                showYearDropdown
                                showMonthDropdown
                                customInput={<CustomTextField label={t('Birthday')} fullWidth />}
                                placeholderText={t('Select a date')}
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
                            label={t('Birthplace')}
                            error={!!errors.birthplace}
                            helperText={errors.birthplace?.message}
                            placeholder={t('Enter your birthplace')}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='nationality'
                        control={control}
                        render={({ field }) => {
                          const selectedCountry = countryOptions.find(country => country.label === field.value)

                          return (
                            <Autocomplete
                              options={countryOptions.map(country => ({ value: country.label, label: country.label }))}
                              getOptionLabel={option => option.label || ''}
                              value={
                                selectedCountry ? { value: selectedCountry.label, label: selectedCountry.label } : null
                              }
                              onChange={(event, newValue) => {
                                field.onChange(newValue ? newValue.value : '')
                              }}
                              renderInput={params => (
                                <CustomTextField
                                  {...params}
                                  fullWidth
                                  placeholder={t('Country / nationality')}
                                  label={t('Select Country / nationality')}
                                  variant='outlined'
                                  error={!!errors.nationality}
                                  helperText={errors.nationality?.message}
                                />
                              )}
                            />
                          )
                        }}
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
                            label={t('Street')}
                            error={!!errors.street}
                            helperText={errors.street?.message}
                            placeholder={t('Enter your street')}
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
                            label={t('Street Number')}
                            placeholder={t('Enter your street number')}
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
                            label={t('City')}
                            placeholder={t('Enter your city')}
                            error={!!errors.city}
                            helperText={errors.city?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='zipCode'
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            fullWidth
                            error={!!errors.zipCode}
                            helperText={errors.zipCode?.message}
                            label={t('Zipcode')}
                            placeholder={t('Enter your zipcode')}
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
                            label={t('Job')}
                            placeholder={t('Enter your job')}
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
                            label={t('Graduation')}
                            error={!!errors.graduation}
                            helperText={errors.graduation?.message}
                            placeholder={t('Enter your graduation')}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={24} sm={12}>
                      <Button fullWidth disabled={isSubmitting} type='submit' variant='contained' sx={{ mb: 4 }}>
                        {isSubmitting ? <CircularProgress size={25} /> : t('Sign up')}
                      </Button>
                    </Grid>
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', ml: 4 }}
                    >
                      <Typography sx={{ color: 'text.secondary', mr: 2 }}>{t('Already have an account?')}</Typography>
                      <Typography
                        component={LinkStyled}
                        href='/login'
                        sx={{ fontSize: theme.typography.body1.fontSize }}
                      >
                        {t('Sign in instead')}
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
