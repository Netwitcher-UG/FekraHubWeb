// ** React Imports
import { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Step from '@mui/material/Step'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Stepper from '@mui/material/Stepper'
import MenuItem from '@mui/material/MenuItem'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import DatePicker from 'react-datepicker'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { Autocomplete } from '@mui/material'
import { t } from 'i18next'
import Translations from 'src/layouts/components/Translations'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import CircularProgress from '@mui/material/CircularProgress'

// ** Third Party Imports
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { addStudent, acceptContract } from 'src/store/apps/students'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import StepperCustomDot from './StepperCustomDot'
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Styled Components
import StepperWrapper from 'src/@core/styles/mui/stepper'

const steps = [
  {
    title: 'Personal Info',
    subtitle: 'Setup Information'
  },
  {
    title: 'Course Selection',
    subtitle: 'Select Course'
  },
  {
    title: 'Contract Approval',
    subtitle: 'Approve the Contract'
  }
]

const defaultAccountValues = {
  CourseID: ''
}

const defaultPersonalValues = {
  gender: '',
  birthday: null,
  LastName: '',
  FirstName: '',
  nationality: '',
  city: '',
  street: '',
  streetNr: '',
  ZipCode: '',
  Note: ''
}

const accountSchema = yup.object().shape({
  CourseID: yup.string().required()
})

const personalSchema = yup.object().shape({
  LastName: yup.string().required(),
  FirstName: yup.string().required(),
  birthday: yup.date().nullable().required(),
  gender: yup.string().required(),
  nationality: yup.string().required(),
  streetNr: yup.string().required(),
  city: yup.string().required(),
  street: yup.string().required(),
  ZipCode: yup.string().required(),
  Note: yup.string().required()
})

const AddChildWizard = ({ courses }) => {
  // ** States
  const [activeStep, setActiveStep] = useState(0)
  const [personalData, setPersonalData] = useState(defaultPersonalValues)
  const [accountData, setAccountData] = useState(defaultAccountValues)
  const [combinedData, setCombinedData] = useState(null)
  const [base64File, setBase64File] = useState(null)
  const dispatch = useDispatch()
  const router = useRouter()
  const { acceptContractLoading } = useSelector(state => state.students)

  const handleAcceptContract = async () => {
    const response = await dispatch(acceptContract(combinedData))
    if (response?.payload?.status == 200) {
      setActiveStep(activeStep + 1)
    } else if (response?.payload?.status == 400) toast.error(<Translations text={response?.payload?.data} />)
    else toast.error(<Translations text={'Something went wrong try again !'} />)
  }

  // ** Hooks
  const {
    // reset: accountReset,
    control: accountControl,
    handleSubmit: handleAccountSubmit,
    formState: { errors: accountErrors, isSubmitting }
  } = useForm({
    defaultValues: defaultAccountValues,
    resolver: yupResolver(accountSchema)
  })

  const {
    // reset: personalReset,
    control: personalControl,
    handleSubmit: handlePersonalSubmit,
    formState: { errors: personalErrors }
  } = useForm({
    defaultValues: defaultPersonalValues,
    resolver: yupResolver(personalSchema)
  })

  const onSubmitPersonal = data => {
    setPersonalData(data)
    setActiveStep(activeStep + 1)
  }

  const onSubmitAccount = async data => {
    setAccountData(data)
    const allData = { ...personalData, ...data }

    setCombinedData(allData)

    const response = await dispatch(addStudent(allData))
    if (response?.payload?.status == 200) {
      setBase64File(response?.payload?.data)
      setActiveStep(activeStep + 1)
    } else if (response?.payload?.status == 400) toast.error(<Translations text={response?.payload?.data} />)
    else toast.error(<Translations text={'Something went wrong try again !'} />)
  }

  // Handle Stepper
  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  // const handleReset = () => {
  //   setActiveStep(0)
  //   socialReset({ google: '', twitter: '', facebook: '', linkedIn: '' })
  //   accountReset({ email: '', username: '', password: '', 'confirm-password': '' })
  //   personalReset({ country: '', language: [], LastName: '', FirstName: '' })
  // }

  // const onSubmit = data => {
  //   setActiveStep(activeStep + 1)
  //   if (activeStep === steps.length - 1) {
  //     toast.success('Form Submitted')
  //   }
  // }

  const getStepContent = step => {
    switch (step) {
      case 0:
        return (
          <form key={0} onSubmit={handlePersonalSubmit(onSubmitPersonal)}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {steps[0].title}
                </Typography>
                <Typography variant='caption' component='p'>
                  {steps[0].subtitle}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='FirstName'
                  control={personalControl}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label='First Name'
                      onChange={onChange}
                      placeholder='Leonard'
                      error={Boolean(personalErrors.FirstName)}
                      aria-describedby='stepper-linear-personal-FirstName'
                      {...(personalErrors.FirstName && { helperText: 'This field is required' })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='LastName'
                  control={personalControl}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label='Last Name'
                      onChange={onChange}
                      placeholder='Carter'
                      error={Boolean(personalErrors.LastName)}
                      aria-describedby='stepper-linear-personal-LastName'
                      {...(personalErrors.LastName && { helperText: 'This field is required' })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='gender'
                  control={personalControl}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      select
                      fullWidth
                      label='Gender'
                      id='validation-gender-select'
                      error={Boolean(personalErrors.gender)}
                      {...(personalErrors.gender && { helperText: 'This field is required' })}
                      aria-describedby='validation-gender-select'
                      defaultValue=''
                      SelectProps={{
                        value: value,
                        onChange: e => onChange(e),
                        displayEmpty: true
                      }}
                    >
                      <MenuItem value='' sx={{ display: 'none' }}>
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
                <DatePickerWrapper>
                  <Controller
                    name='birthday'
                    control={personalControl}
                    render={({ field: { value, onChange } }) => (
                      <DatePicker
                        selected={value}
                        onChange={onChange}
                        dateFormat='yyyy/MM/dd'
                        showYearDropdown
                        showMonthDropdown
                        customInput={
                          <CustomTextField
                            error={Boolean(personalErrors.birthday)}
                            {...(personalErrors.birthday && { helperText: 'This field is required' })}
                            label='Birthday'
                            fullWidth
                          />
                        }
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='nationality'
                  control={personalControl}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      error={Boolean(personalErrors.nationality)}
                      {...(personalErrors.nationality && { helperText: 'This field is required' })}
                      fullWidth
                      label='Nationality'
                      placeholder='Enter nationality'
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='street'
                  control={personalControl}
                  render={({ field }) => (
                    <CustomTextField
                      error={Boolean(personalErrors.street)}
                      {...(personalErrors.street && { helperText: 'This field is required' })}
                      {...field}
                      fullWidth
                      label='Street'
                      placeholder='Enter your street'
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='streetNr'
                  control={personalControl}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      error={Boolean(personalErrors.streetNr)}
                      {...(personalErrors.streetNr && { helperText: 'This field is required' })}
                      fullWidth
                      label='Street Number'
                      placeholder='Enter your street number'
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='city'
                  control={personalControl}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      error={Boolean(personalErrors.city)}
                      {...(personalErrors.city && { helperText: 'This field is required' })}
                      fullWidth
                      label='City'
                      placeholder='Enter your city'
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='Note'
                  control={personalControl}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      multiline
                      minRows={4}
                      // sx={{ mb: 4, width: '100%' }}
                      label={<Translations text={'Note'} />}
                      placeholder={t('Note')}
                      error={Boolean(personalErrors.Note)}
                      {...(personalErrors.Note && { helperText: 'This field is required' })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='ZipCode'
                  control={personalControl}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      error={Boolean(personalErrors.ZipCode)}
                      {...(personalErrors.ZipCode && { helperText: 'This field is required' })}
                      fullWidth
                      label='Zipcode'
                      placeholder='Enter Zipcode'
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant='tonal' color='secondary' disabled>
                  Back
                </Button>
                <Button type='submit' variant='contained'>
                  Next
                </Button>
              </Grid>
            </Grid>
          </form>
        )
      case 1:
        return (
          <form key={1} onSubmit={handleAccountSubmit(onSubmitAccount)}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {steps[1].title}
                </Typography>
                <Typography variant='caption' component='p'>
                  {steps[1].subtitle}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='CourseID'
                  control={accountControl}
                  render={({ field }) => {
                    const selectedCourse = courses.find(course => course.id === field.value)

                    return (
                      <Autocomplete
                        options={courses.map(course => ({ value: course.id, label: course.name }))}
                        getOptionLabel={option => option.label || ''}
                        value={selectedCourse ? { value: selectedCourse.id, label: selectedCourse.name } : null}
                        onChange={(event, newValue) => {
                          field.onChange(newValue ? newValue.value : '')
                        }}
                        renderInput={params => (
                          <CustomTextField
                            {...params}
                            fullWidth
                            label='Select Course'
                            variant='outlined'
                            error={Boolean(accountErrors.CourseID)}
                            {...(accountErrors.CourseID && { helperText: 'This field is required' })}
                          />
                        )}
                      />
                    )
                  }}
                />
              </Grid>

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant='tonal' color='secondary' onClick={handleBack}>
                  Back
                </Button>
                <Button type='submit' disabled={isSubmitting} variant='contained'>
                  {isSubmitting ? <CircularProgress size={25} /> : 'Next'}
                </Button>
              </Grid>
            </Grid>
          </form>
        )

      case 2:
        return (
          <Box>
            {' '}
            <iframe src={`data:application/pdf;base64,${base64File}`} width='100%' height='800vh' title={'test'} />
            <Divider sx={{ mt: 2 }} />
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button
                color='success'
                onClick={() => handleAcceptContract()}
                variant='contained'
                disabled={acceptContractLoading}
              >
                {acceptContractLoading ? (
                  <CircularProgress size={25} />
                ) : (
                  <>
                    {' '}
                    <Box sx={{ mr: 2 }}>
                      <Icon fontSize='1.125rem' icon='oui:pages-select' />
                    </Box>
                    <Translations text={'Accept'} />
                  </>
                )}
              </Button>
            </Grid>
          </Box>
        )
      default:
        return null
    }
  }

  const renderContent = () => {
    if (activeStep === steps.length) {
      return (
        <Fragment>
          <Box sx={{ mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CustomAvatar skin='light' variant='circle' color={'success'} sx={{ width: 100, height: 100, mb: 4 }}>
              <Icon icon={'lets-icons:check-ring'} fontSize={120} color={'success'} />
            </CustomAvatar>

            <Typography
              sx={{ color: 'text.secondary', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              Your child was registerd successfully ! and a copy of the Contract was sent to your email
              <br />
              <Button sx={{ m: 2 }} color='primary' onClick={() => router.push('/children')} variant='contained'>
                <Translations text={'Go to children page'} />
              </Button>
            </Typography>
          </Box>
        </Fragment>
      )
    } else {
      return getStepContent(activeStep)
    }
  }

  return (
    <Card>
      <CardContent>
        <StepperWrapper>
          <Stepper activeStep={activeStep}>
            {steps.map((step, index) => {
              const labelProps = {}
              if (index === activeStep) {
                labelProps.error = false
                if (accountErrors.CourseID && activeStep === 0) {
                  labelProps.error = true
                } else if (
                  (personalErrors.gender ||
                    personalErrors.birthday ||
                    personalErrors.LastName ||
                    personalErrors.FirstName ||
                    personalErrors.nationality) &&
                  activeStep === 1
                ) {
                  labelProps.error = true
                } else {
                  labelProps.error = false
                }
              }

              return (
                <Step key={index}>
                  <StepLabel {...labelProps} StepIconComponent={StepperCustomDot}>
                    <div className='step-label'>
                      <Typography className='step-number'>{`0${index + 1}`}</Typography>
                      <div>
                        <Typography className='step-title'>{step.title}</Typography>
                        <Typography className='step-subtitle'>{step.subtitle}</Typography>
                      </div>
                    </div>
                  </StepLabel>
                </Step>
              )
            })}
          </Stepper>
        </StepperWrapper>
      </CardContent>

      <Divider sx={{ m: '0 !important' }} />

      <CardContent>{renderContent()}</CardContent>
    </Card>
  )
}

export default AddChildWizard
