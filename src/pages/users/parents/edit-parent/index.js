// ** React Imports
import { forwardRef, useMemo, useState, useEffect, useContext } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { useForm, Controller } from 'react-hook-form'
import CustumWarningDialog from 'src/@core/components/custom-warning'
import { useAuth } from 'src/hooks/useAuth'
// ** MUI Imports
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import { changeUserStatus, changeParentStatus } from 'src/store/apps/users'
import FormControlLabel from '@mui/material/FormControlLabel'
// import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import useBgColor from 'src/@core/hooks/useBgColor'
import { useDispatch } from 'react-redux'
import countryList from 'react-select-country-list'
import { Autocomplete } from '@mui/material'
// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import { useRouter } from 'next/router'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import InputAdornment from '@mui/material/InputAdornment'
// ** Third Party Imports
import DatePicker from 'react-datepicker'
import { yupResolver } from '@hookform/resolvers/yup'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { editParent } from 'src/store/apps/users'
import { useTranslation } from 'react-i18next'
import Translations from 'src/layouts/components/Translations'
import { styled } from '@mui/material/styles'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
import Alert from '@mui/material/Alert'

// Validation Schema
const getValidationSchema = t =>
  yup.object().shape({
    email: yup.string().email(t('Email is invalid')).required(t('Email is required')),
    firstName: yup.string().required(t('First Name is required')),
    lastName: yup.string().required(t('Last Name is required')),
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
    streetNr: yup.string().required(t('Street Number is required')),
    city: yup.string().required(t('City is required')),
    zipCode: yup.string().required(t('Zip Code is required')), // Fixed typo here
    job: yup.string().required(t('Job is required')),
    graduation: yup.string().required(t('Graduation is required')),
    gender: yup.string().required(t('Gender is required')),
    birthplace: yup.string().required(t('Birthplace is required'))
  })

const CustomCloseButton = styled(IconButton)(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))

const EditParentDialog = ({ open, setOpen, profileData, paramsQuery }) => {
  const ability = useContext(AbilityContext)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const handleCloseDialog = () => {
    setIsDialogOpen(false)
  }
  const { t } = useTranslation() // Fetch t function from useTranslation
  const handleClose = () => setOpen(false)
  const [showPassword, setShowPassword] = useState(false)
  const schema = useMemo(() => getValidationSchema(t), [t])
  const auth = useAuth()
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
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
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }
  useEffect(() => {
    if (!profileData) return
    reset({
      birthday: profileData?.birthday ? new Date(profileData.birthday) : null,
      birthplace: profileData?.birthplace,
      email: profileData?.email,
      firstName: profileData?.firstName,
      lastName: profileData?.lastName,
      nationality: profileData?.nationality,
      phoneNumber: Number(profileData?.phoneNumber),
      emergencyPhoneNumber: Number(profileData?.emergencyPhoneNumber),
      street: profileData?.street,
      streetNr: profileData?.streetNr,
      city: profileData?.city,
      job: profileData?.job,
      graduation: profileData?.graduation,
      gender: profileData?.gender?.toLowerCase(),
      zipCode: profileData?.zipCode
    })
    // }
  }, [profileData, reset, open])

  const dispatch = useDispatch()
  const bgColors = useBgColor()
  const countryOptions = useMemo(() => countryList().getData(), [])
  const router = useRouter()
  const onSubmit = async data => {
    const response = await dispatch(editParent({ id: profileData?.id, data: data, paramsQuery: paramsQuery }))

    if (response?.payload?.status == 400) toast.error(response?.payload?.data)
    else if (response?.payload?.status == 200) {
      toast.success(<Translations text={'Parent info updated successfully '} />, 1000)
      handleClose()
    } else toast.error(response?.payload?.data || 'something went wrong try again !')
  }
  const [isActive, setIsActive] = useState(profileData?.activeUser || false)
  useEffect(() => {
    setIsActive(profileData?.activeUser)
  }, [profileData])
  const handleSwitchChange = event => {
    setIsDialogOpen(true)
  }
  const handleChageUserState = async status => {
    const response = await dispatch(
      changeParentStatus({ params: `${profileData?.id}?activate=${status}`, paramsQuery: paramsQuery })
    )

    if (response?.payload?.status == 400) toast.error(response?.payload?.data)
    else if (response?.payload?.status == 200) {
      setIsActive(status)
      handleCloseDialog()
      handleClose()
      toast.success(<Translations text={`Parent ${status ? 'activated' : 'deactivated'}  successfully`} />, 1000)
    } else toast.error(response?.payload?.data || 'something went wrong try again !')
  }
  return (
    <Dialog
      maxWidth='md'
      fullWidth
      open={open}
      scroll='body'
      onClose={handleClose}
      aria-labelledby='customized-dialog-title'
      sx={{ '& .MuiDialog-paper': { width: '80%', maxWidth: 'none', overflow: 'visible' } }}
    >
      <DialogTitle id='customized-dialog-title' sx={{ p: 4 }}>
        <Typography variant='h4' sx={{ fontWeight: '900' }}>
          {t('Edit Parent Info')}
        </Typography>
        <CustomCloseButton aria-label='close' onClick={handleClose}>
          <Icon icon='tabler:x' fontSize='1.25rem' />
        </CustomCloseButton>
      </DialogTitle>
      <Divider sx={{ m: '0 !important' }} />
      {ability.can('delete', 'User') && (
        <>
          <Grid item xs={12}>
            <Typography variant='body2' sx={{ fontWeight: 600, m: 4 }}>
              1. <Translations text='Account Activation' />
            </Typography>
            <Grid container spacing={5}>
              <Grid item xs={10} sm={5} sx={{ m: 4 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isActive}
                      disabled={auth?.user?.id == profileData?.id}
                      onChange={handleSwitchChange}
                      color='success'
                    />
                  }
                  label={isActive ? t('Parent is active') : t('Parent is inactive')}
                />
              </Grid>
              {auth?.user?.id == profileData?.id ? (
                <Grid item xs={12} sm={6} sx={{ m: 4 }}>
                  <Alert severity='info'>
                    {' '}
                    <Translations text={'You cannot deactivate your own account '} />{' '}
                  </Alert>
                </Grid>
              ) : (
                <Grid item xs={12} sm={6} sx={{ m: 4 }}>
                  <Alert severity='warning'>
                    {' '}
                    <Translations text={'Deactivated parents cannot login into the app'} />{' '}
                  </Alert>
                </Grid>
              )}
            </Grid>
          </Grid>
          {/* <Grid container spacing={5}>
          <FormControlLabel control={<Switch defaultChecked color='success' />} label='Success' />
        </Grid> */}
          <Grid item xs={12}>
            <Divider sx={{ mb: '0 !important', mx: 4 }} />
          </Grid>
        </>
      )}
      <Grid item xs={12}>
        <Typography variant='body2' sx={{ fontWeight: 600, m: 4 }}>
          2. <Translations text='Parent Details' />
        </Typography>
      </Grid>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers sx={{ p: theme => `${theme.spacing(4)} !important`, border: 'none' }}>
          <Grid container spacing={5}>
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
                name='lastName'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={<Translations text={'Last Name'} />}
                    placeholder='Carter'
                    error={Boolean(errors.lastName)}
                    helperText={errors.lastName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePickerWrapper>
                <Controller
                  name='birthday'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <DatePicker
                      selected={value}
                      onChange={onChange}
                      dateFormat='dd.MM.yyyy'
                      placeholderText={t('Birthday')}
                      showYearDropdown
                      showMonthDropdown
                      customInput={
                        <CustomTextField
                          label={<Translations text={'Birthday'} />}
                          fullWidth
                          error={Boolean(errors.birthday)}
                          helperText={errors.birthday?.message}
                        />
                      }
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
                      value={
                        selectedCountry
                          ? { value: selectedCountry.label, label: selectedCountry.label }
                          : { value: profileData?.nationality, label: profileData?.nationality }
                      } // Ensure profileData?.nationality is used as selected value
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
                    error={Boolean(errors.street)}
                    helperText={errors.street?.message}
                    fullWidth
                    label={<Translations text={'Street'} />}
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
                    error={Boolean(errors.streetNr)}
                    helperText={errors.streetNr?.message}
                    fullWidth
                    label={<Translations text={'Street Number'} />}
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
                    error={Boolean(errors.city)}
                    helperText={errors.city?.message}
                    fullWidth
                    label={<Translations text={'City'} />}
                    placeholder={t('Enter your city')}
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
                    error={Boolean(errors.job)}
                    helperText={errors.job?.message}
                    label={<Translations text={'Job'} />}
                    placeholder={t('Enter your job')}
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
                    error={Boolean(errors.graduation)}
                    helperText={errors.graduation?.message}
                    label={<Translations text={'Graduation'} />}
                    placeholder={t('Enter your graduation')}
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
        </DialogContent>
        <Divider sx={{ m: '0 !important' }} />
        <DialogActions sx={{ p: theme => `${theme.spacing(3)} !important` }}>
          <Button type='button' disabled={isSubmitting} variant='outlined' onClick={handleClose}>
            {t('Cancel')}
          </Button>
          <Button disabled={!isDirty || isSubmitting} type='submit' variant='contained'>
            {t('Save')}
          </Button>
        </DialogActions>
      </form>
      <CustumWarningDialog
        open={isDialogOpen}
        handleClose={handleCloseDialog}
        decsription={`${t('Are you sure you want to')} ${isActive ? t('Deactivate') : t('Activate')} ${t(
          'the parent'
        )} ${profileData?.firstName} ${profileData?.lastName}? `}
        onConfirm={() => handleChageUserState(!isActive)} // Wrap in an arrow function
      />
    </Dialog>
  )
}

export default EditParentDialog
