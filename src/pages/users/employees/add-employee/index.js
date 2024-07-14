// ** React Imports
import { forwardRef } from 'react'
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
import Alert from '@mui/material/Alert'
import useBgColor from 'src/@core/hooks/useBgColor'
import { useDispatch } from 'react-redux'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import DatePicker from 'react-datepicker'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { addEmployee } from 'src/store/apps/users'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { Box } from '@mui/material'
import { boxSizing } from '@mui/system'

// Validation Schema
const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  email: yup.string().email('Email is invalid').required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[\W_]/, 'Password must contain at least one non-alphanumeric character'),
  //   password2: yup
  //     .string()
  //     .required('Confirm Password is required')
  //     .oneOf([yup.ref('password'), null], 'Passwords must match'),
  firstName: yup.string(),
  lastname: yup.string(),
  //   country: yup.string(),
  //   language: yup.array().of(yup.string()),
  birthday: yup.date().nullable(),
  nationality: yup.string(),
  phoneNumber: yup.number().typeError('Must be a number'),
  emergencyPhoneNumber: yup.number().typeError('Must be a number'),
  streetNr: yup.string(),
  city: yup.string(),
  job: yup.string(),
  graduation: yup.string(),
  gender: yup.string(),
  Role: yup.string().required('Role is required')
})

const CustomInput = forwardRef((props, ref) => {
  return <CustomTextField fullWidth {...props} inputRef={ref} label='Birth Date' autoComplete='off' />
})

const FormLayoutsSeparator = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastname: '',
      nationality: '',
      birthplace: '',
      birthday: null,
      phoneNumber: Number(''),
      emergencyPhoneNumber: Number(''),
      street: '',
      streetNr: '',
      city: '',
      job: '',
      graduation: '',
      gender: '',
      Role: ''
    }
  })

  const dispatch = useDispatch()
  const bgColors = useBgColor()
  const onSubmit = async data => {
    const parsedDate = new Date(data?.birthday)
    const formattedDate = parsedDate?.toLocaleDateString('en-US')
    const sentData = {
      ...data,
      birthday: formattedDate
    }

    const response = await dispatch(addEmployee(sentData))

    if (response?.payload?.status == 400) toast.error(response?.payload?.data)
    else if (response?.payload?.status == 200) {
      toast.success('Employee added successfully ', 1000)
      reset()
    } else toast.error(response?.payload?.data)
  }

  return (
    <Card>
      <CardHeader title='Add Employee' />
      <Divider sx={{ m: '0 !important' }} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                1. Account Details
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
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
                    label='Password'
                    type='password'
                    placeholder='············'
                    id='auth-register-password'
                    error={Boolean(errors.password)}
                    helperText={errors.password?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={() => field.onChange(!field.value)}
                            onMouseDown={e => e.preventDefault()}
                            aria-label='toggle password visibility'
                          >
                            <Icon fontSize='1.25rem' icon={field.value ? 'tabler:eye' : 'tabler:eye-off'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <Controller
                name='password2'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Confirm Password'
                    type='password'
                    error={Boolean(errors.password2)}
                    helperText={errors.password2?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={() => field.onChange(!field.value)}
                            onMouseDown={e => e.preventDefault()}
                            aria-label='toggle password visibility'
                          >
                            <Icon fontSize='1.25rem' icon={field.value ? 'tabler:eye' : 'tabler:eye-off'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
            </Grid> */}
            <Grid item xs={12}>
              <Divider sx={{ mb: '0 !important' }} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                2. Personal Info
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='Role'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Role'
                    id='validation-gender-select'
                    aria-describedby='validation-gender-select'
                    defaultValue=''
                    error={Boolean(errors.Role)}
                    helperText={errors.Role?.message}
                    SelectProps={{
                      value: value,
                      onChange: e => onChange(e),
                      displayEmpty: true
                    }}
                  >
                    <MenuItem value='' disabled>
                      <em>Select Role</em>
                    </MenuItem>
                    <MenuItem key={1} value={'Admin'}>
                      Admin
                    </MenuItem>
                    <MenuItem key={2} value={'Secretariat'}>
                      Secretory
                    </MenuItem>
                    <MenuItem key={3} value={'Teacher'}>
                      Teacher
                    </MenuItem>
                  </CustomTextField>
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
                    label='Last Name'
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
                    label='Gender'
                    id='validation-gender-select'
                    aria-describedby='validation-gender-select'
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
            {/* <Grid item xs={12} sm={6}>
              <Controller
                name='country'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    label='Country'
                    defaultValue=''
                    error={Boolean(errors.country)}
                    helperText={errors.country?.message}
                  >
                    <MenuItem value='UK'>UK</MenuItem>
                    <MenuItem value='USA'>USA</MenuItem>
                    <MenuItem value='Australia'>Australia</MenuItem>
                    <MenuItem value='Germany'>Germany</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid> */}
            {/* <Grid item xs={12} sm={6}>
              <Controller
                name='language'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    label='Language'
                    SelectProps={{
                      multiple: true,
                      value: field.value,
                      onChange: e => field.onChange(e.target.value)
                    }}
                    error={Boolean(errors.language)}
                    helperText={errors.language?.message}
                  >
                    <MenuItem value='English'>English</MenuItem>
                    <MenuItem value='French'>French</MenuItem>
                    <MenuItem value='Spanish'>Spanish</MenuItem>
                    <MenuItem value='Portuguese'>Portuguese</MenuItem>
                    <MenuItem value='Italian'>Italian</MenuItem>
                    <MenuItem value='German'>German</MenuItem>
                    <MenuItem value='Arabic'>Arabic</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid> */}
            <Grid item xs={12} sm={6}>
              <DatePickerWrapper>
                <Controller
                  name='birthday'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <DatePicker
                      selected={value}
                      onChange={onChange}
                      dateFormat='yyyy/MM/dd'
                      showYearDropdown
                      showMonthDropdown
                      customInput={<CustomTextField label='Birthday' fullWidth />}
                      placeholderText='Birthday'
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
                  )}
                />
              </DatePickerWrapper>
              {errors.birthday && <Typography color='error'>{errors.birthday.message}</Typography>}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='birthplace'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Birthplace' placeholder='Enter your birthplace' />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='nationality'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Nationality' placeholder='Enter your nationality' />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name=''
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Street' placeholder='Enter your street' />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='streetNr'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Street Number' placeholder='Enter your street number' />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='city'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='City' placeholder='Enter your city' />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='job'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Job' placeholder='Enter your job' />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='graduation'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Graduation' placeholder='Enter your graduation' />
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
                    label='Phone No.'
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
                    label='Emergency Phone Number'
                    placeholder='Enter your emergency phone number'
                    type='tel' // Restrict input to numbers
                    error={!!errors.emergencyPhoneNumber}
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
              {isSubmitting ? <CircularProgress size={22} /> : 'Submit'}
            </Button>
            <Button disabled={isSubmitting} type='button' color='secondary' variant='tonal' onClick={() => reset()}>
              Reset
            </Button>
          </Box>
          <Box>
            {/* <Alert icon={false} sx={{ py: 3, ...bgColors.primaryLight, '& .MuiAlert-message': { p: 0 } }}>
              <Typography variant='body2' sx={{ mb: 2, color: 'primary.main' }}>
                <strong>Note: </strong>confirmation email will be sent to the registerd parents to activate thier
                account !
              </Typography>
            </Alert> */}
          </Box>
        </CardActions>
      </form>
    </Card>
  )
}

export default FormLayoutsSeparator
