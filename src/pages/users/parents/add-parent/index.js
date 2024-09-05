// ** React Imports
import { forwardRef, useMemo, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import InputAdornment from '@mui/material/InputAdornment'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import CircularProgress from '@mui/material/CircularProgress'
import { Autocomplete } from '@mui/material'
import Alert from '@mui/material/Alert'
import useBgColor from 'src/@core/hooks/useBgColor'
import countryList from 'react-select-country-list'
import { useRouter } from 'next/router'
import Translations from 'src/layouts/components/Translations'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import DatePicker from 'react-datepicker'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useAuth } from 'src/hooks/useAuth'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { Box } from '@mui/material'
// import { boxSizing } from '@mui/system'
import { useTranslation } from 'react-i18next'
// Validation Schema

const CustomInput = forwardRef((props, ref) => {
  return <CustomTextField fullWidth {...props} inputRef={ref} label='Birth Date' autoComplete='off' />
})
const getValidationSchema = t =>
  yup.object().shape({
    email: yup.string().email(t('Email is invalid')).required(t('Email is required')),
    password: yup
      .string()
      .required(t('Password is required'))
      .matches(/[a-z]/, t('Password must contain at least one lowercase letter'))
      .matches(/[A-Z]/, t('Password must contain at least one uppercase letter'))
      .matches(/[0-9]/, t('Password must contain at least one number'))
      .matches(/[\W_]/, t('Password must contain at least one non-alphanumeric character')),
    firstName: yup.string().required(t('First Name is required')),
    lastname: yup.string().required(t('Last Name is required')),
    birthday: yup.date().nullable().required(t('Birthday is required')),
    nationality: yup.string().required(t('Nationality is required')),
    phoneNumber: yup
      .string()
      .required(t('Phone Number is required'))
      .matches(/^\d{10,}$/, t('Phone Number must be at least 10 digits')),
    emergencyPhoneNumber: yup
      .string()
      .required(t('Emergency Phone Number is required'))
      .matches(/^\d{10,}$/, t('Emergency Phone Number must be at least 10 digits')),
    street: yup.string().required(t('Street is required')),
    zipCode: yup.string().required(t('Zip Code is required')),
    streetNr: yup.string().required(t('Street Number is required')),
    city: yup.string().required(t('City is required')),
    job: yup.string().required(t('Job is required')),
    graduation: yup.string().required(t('Graduation is required')),
    gender: yup.string().required(t('Gender is required')),
    birthplace: yup.string().required(t('Birthplace is required'))
  })

const FormLayoutsSeparator = () => {
  const { t } = useTranslation()

  const schema = useMemo(() => getValidationSchema(t), [t])
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      // username: '',
      email: '',
      password: '',
      firstName: '',
      lastname: '',
      nationality: '',
      birthplace: '',
      birthday: null,
      phoneNumber: '',
      emergencyPhoneNumber: '',
      street: '',
      streetNr: '',
      city: '',
      job: '',
      graduation: '',
      gender: '',
      zipCode: ''
    }
  })
  const auth = useAuth()
  const bgColors = useBgColor()
  const router = useRouter()
  const countryOptions = useMemo(() => countryList().getData(), [])
  const [showPassword, setShowPassword] = useState(false)
  const onSubmit = async data => {
    const parsedDate = new Date(data?.birthday)
    const formattedDate = parsedDate?.toLocaleDateString('en-US')
    const sentData = {
      ...data,
      birthday: formattedDate
    }
    const response = await auth.register(sentData)
    if (response?.status == 400) toast.error(response.data)
    else if (response?.status == 200) {
      toast.success(<Translations text={'Parent added successfully and confirm email was sent to the parent '} />, 1000)
      reset()
      router.push('/users/parents')
    } else toast.error(response.data)
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Card>
      <CardHeader title={<Translations text={'Add New Parent'} />} />
      <Divider sx={{ m: '0 !important' }} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                1. <Translations text='Account Details' />
              </Typography>
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <Controller
                name='username'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Username'
                    placeholder='carterLeonard'
                    error={Boolean(errors.username)}
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
                    label={<Translations text={'Email'} />}
                    placeholder='carterleonard@gmail.com'
                    error={Boolean(errors.email)}
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
                    label={<Translations text='Password' />}
                    type={showPassword ? 'text' : 'password'}
                    placeholder='············'
                    id='auth-register-password'
                    error={Boolean(errors.password)}
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
            <Grid item xs={12}>
              <Divider sx={{ mb: '0 !important' }} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                2. <Translations text={'Personal Info'} />
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='firstName'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={<Translations text={'First Name'} />}
                    placeholder='Leonard'
                    error={Boolean(errors.firstName)}
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
                    label={<Translations text={'Last Name'} />}
                    placeholder='Carter'
                    error={Boolean(errors.lastname)}
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
                    label={<Translations text={'Gender'} />}
                    id='validation-gender-select'
                    aria-describedby='validation-gender-select'
                    defaultValue=''
                    error={Boolean(errors.gender)}
                    helperText={errors.gender?.message}
                    SelectProps={{
                      value: value,
                      onChange: e => onChange(e),
                      displayEmpty: true
                    }}
                  >
                    <MenuItem value='' sx={{ display: 'none' }}>
                      <em>
                        <Translations text={'Select Gender'} />
                      </em>
                    </MenuItem>
                    <MenuItem key={1} value={'male'}>
                      <Translations text={'Male'} />
                    </MenuItem>
                    <MenuItem key={2} value={'female'}>
                      <Translations text={'Female'} />
                    </MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePickerWrapper>
                <Controller
                  name='birthday'
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      showYearDropdown
                      showMonthDropdown
                      dateFormat='dd.MM.yyyy'
                      placeholderText={t('Birthday')}
                      customInput={
                        <CustomTextField
                          {...field}
                          error={Boolean(errors.birthday)}
                          label={<Translations text={'Birthday'} />}
                          fullWidth
                          helperText={errors.birthday?.message}
                        />
                      }
                      id='form-layouts-separator-date'
                      onChange={date => field.onChange(date)}
                    />
                  )}
                />
              </DatePickerWrapper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='birthplace'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={<Translations text={'Birth Place'} />}
                    placeholder={t('Enter your birthplace')}
                    error={Boolean(errors.birthplace)}
                    helperText={errors.birthplace?.message}
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
                      value={selectedCountry ? { value: selectedCountry.label, label: selectedCountry.label } : null}
                      onChange={(event, newValue) => {
                        field.onChange(newValue ? newValue.value : '')
                      }}
                      renderInput={params => (
                        <CustomTextField
                          {...params}
                          fullWidth
                          placeholder={t('Country / nationality')}
                          label={<Translations text={'Select Country / nationality'} />}
                          error={Boolean(errors.nationality)}
                          helperText={errors.nationality?.message}
                          variant='outlined'
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
                    label={<Translations text={'Street'} />}
                    placeholder={t('Enter your street')}
                    error={Boolean(errors.street)}
                    helperText={errors.street?.message}
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
                    label={<Translations text={'Street Number'} />}
                    placeholder={t('Enter your street number')}
                    error={Boolean(errors.streetNr)}
                    helperText={errors.streetNr?.message}
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
                    label={<Translations text={'City'} />}
                    placeholder={t('Enter your city')}
                    error={Boolean(errors.city)}
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
                    error={Boolean(errors.zipCode)}
                    helperText={errors.zipCode?.message}
                    fullWidth
                    label={<Translations text={'Zip Code'} />}
                    placeholder={t('Enter your Zipcode')}
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
                    label={<Translations text={'Job'} />}
                    placeholder={t('Enter your job')}
                    error={Boolean(errors.job)}
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
                    label={<Translations text={'Graduation'} />}
                    placeholder={t('Enter your graduation')}
                    error={Boolean(errors.graduation)}
                    helperText={errors.graduation?.message}
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
                    type='number'
                    label={<Translations text={'Phone Number'} />}
                    placeholder='123-456-7890'
                    error={Boolean(errors.phoneNumber)}
                    helperText={errors.phoneNumber?.message}
                  />
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
                    label={<Translations text={'Emergency Phone Number'} />}
                    placeholder={t('Enter your emergency phone number')}
                    type='number'
                    error={Boolean(errors.emergencyPhoneNumber)}
                    helperText={errors.emergencyPhoneNumber?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider sx={{ m: '0 !important' }} />
        <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Button disabled={isSubmitting} type='submit' sx={{ mr: 2 }} variant='contained'>
              {isSubmitting ? <CircularProgress size={22} /> : <Translations text={'Submit'} />}
            </Button>
            <Button disabled={isSubmitting} type='button' color='secondary' variant='tonal' onClick={() => reset()}>
              <Translations text={'Reset'} />
            </Button>
          </Box>
          <Box>
            <Alert icon={false} sx={{ py: 3, ...bgColors.primaryLight, '& .MuiAlert-message': { p: 0 } }}>
              <Typography variant='body2' sx={{ mb: 2, color: 'primary.main' }}>
                <strong>
                  <Translations text={'Note: '} />
                </strong>
                <Translations
                  text={'confirmation email will be sent to the registerd parents to activate thier account !'}
                />
              </Typography>
            </Alert>
          </Box>
        </CardActions>
      </form>
    </Card>
  )
}

export default FormLayoutsSeparator
