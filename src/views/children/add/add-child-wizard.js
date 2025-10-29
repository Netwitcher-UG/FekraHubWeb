// ** React Imports
import { Fragment, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Alert from '@mui/material/Alert'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
// import Divider from '@mui/material/Divider'
// import Stepper from '@mui/material/Stepper'
import MenuItem from '@mui/material/MenuItem'
// import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import DatePicker from 'react-datepicker'
import CustomAvatar from 'src/@core/components/mui/avatar'
import countryList from 'react-select-country-list'
import { Autocomplete } from '@mui/material'

// import Checkbox from '@mui/material/Checkbox'
// import FormControlLabel from '@mui/material/FormControlLabel'

import { useTranslation } from 'react-i18next'
import Translations from 'src/layouts/components/Translations'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
// import CircularProgress from '@mui/material/CircularProgress'

// ** Third Party Imports
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { addStudent, acceptContract } from 'src/store/apps/students'
import CourseCard from './course-card'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
// import StepperCustomDot from './StepperCustomDot'
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Styled Components
// import StepperWrapper from 'src/@core/styles/mui/stepper'

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
  // CourseID: yup.string().required()
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
  Note: yup.string()
})

const AddChildWizard = ({ courses }) => {
  const { t } = useTranslation()

  const steps = [
    {
      title: t('Child Info'),
      subtitle: t('Setup Information')
    }
    // {
    //   title: t('Course Selection'),
    //   subtitle: t('Select Course')
    // },
    // {
    //   title: t('Contract Approval'),
    //   subtitle: t('Approve the Contract')
    // }
  ]

  // ** States
  const [activeStep, setActiveStep] = useState(0)
  const [personalData, setPersonalData] = useState(defaultPersonalValues)
  const [accountData, setAccountData] = useState(defaultAccountValues)
  const [combinedData, setCombinedData] = useState(null)
  const [base64File, setBase64File] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [pendingData, setPendingData] = useState(null)
  const dispatch = useDispatch()
  const router = useRouter()
  const { acceptContractLoading } = useSelector(state => state.students)
  const countryOptions = useMemo(() => countryList().getData(), [])

  // const [isChecked1, setIsChecked1] = useState(false)
  // const [isChecked2, setIsChecked2] = useState(false)

  const renderData = courses.map((course, index) => (
    <Grid item xs={12} sm={6} md={4} xl={3} key={index}>
      <CourseCard course={course} selectedCourse={selectedCourse} setSelectedCourse={setSelectedCourse} />
    </Grid>
  ))

  // const handleAcceptContract = async () => {
  //   const response = await dispatch(acceptContract(combinedData))
  //   if (response?.payload?.status == 200) {
  //     setActiveStep(activeStep + 1)
  //   } else if (response?.payload?.status == 400) toast.error(<Translations text={response?.payload?.data} />)
  //   else toast.error(<Translations text={t('Something went wrong try again !')} />)
  // }

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

  const onSubmitPersonal = async data => {
    setPersonalData(data)
    setPendingData(data)
    setOpenDialog(true)
  }

  const handleConfirmSubmit = async () => {
    setOpenDialog(false)
    // Direct submission with personal data only
    const response = await dispatch(addStudent(pendingData))
    if (response?.payload?.status == 200) {
      toast.success(<Translations text={t('Child registered successfully!')} />)
      router.push('/pending-approvals')
    } else if (response?.payload?.status == 400) {
      toast.error(<Translations text={response?.payload?.data} />)
    } else {
      toast.error(<Translations text={t('Something went wrong try again !')} />)
    }
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  // const onSubmitAccount = async () => {
  //   if (!selectedCourse) toast.error(<Translations text={t('Please select a course ')} />)
  //   else {
  //     setAccountData({ CourseID: selectedCourse })
  //     // const allData = { ...personalData, ...data }
  //     const allData = { ...personalData, CourseID: selectedCourse }

  //     console.log(allData)
  //     setCombinedData(allData)

  //     const response = await dispatch(addStudent(allData))
  //     if (response?.payload?.status == 200) {
  //       setBase64File(response?.payload?.data)
  //       setActiveStep(activeStep + 1)
  //     } else if (response?.payload?.status == 400) toast.error(<Translations text={response?.payload?.data} />)
  //     else toast.error(<Translations text={t('Something went wrong try again !')} />)
  //   }
  // }

  // Handle Stepper
  // const handleBack = () => {
  //   setActiveStep(prevActiveStep => prevActiveStep - 1)
  // }

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
                <Alert severity='info' sx={{ mb: 4 }}>
                  {t('Newly added child will be moved to pending approvals for the management to approve the child')}
                </Alert>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {t(steps[0].title)}
                </Typography>
                <Typography variant='caption' component='p'>
                  {t(steps[0].subtitle)}
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
                      label={t('First Name')}
                      onChange={onChange}
                      placeholder='Leonard'
                      error={Boolean(personalErrors.FirstName)}
                      aria-describedby='stepper-linear-personal-FirstName'
                      {...(personalErrors.FirstName && { helperText: t('This field is required') })}
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
                      label={t('Last Name')}
                      onChange={onChange}
                      placeholder='Carter'
                      error={Boolean(personalErrors.LastName)}
                      aria-describedby='stepper-linear-personal-LastName'
                      {...(personalErrors.LastName && { helperText: t('This field is required') })}
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
                      label={t('Gender')}
                      id='validation-gender-select'
                      error={Boolean(personalErrors.gender)}
                      {...(personalErrors.gender && { helperText: t('This field is required') })}
                      aria-describedby='validation-gender-select'
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
                <DatePickerWrapper>
                  <Controller
                    name='birthday'
                    control={personalControl}
                    render={({ field: { value, onChange } }) => (
                      <DatePicker
                        selected={value}
                        onChange={onChange}
                        dateFormat='dd.MM.yyyy'
                        showYearDropdown
                        showMonthDropdown
                        customInput={
                          <CustomTextField
                            error={Boolean(personalErrors.birthday)}
                            {...(personalErrors.birthday && { helperText: t('This field is required') })}
                            label={t('Birthday')}
                            fullWidth
                          />
                        }
                        placeholderText={t('Birthday')}
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
                            label={t('Select Country / nationality')}
                            variant='outlined'
                            error={Boolean(personalErrors.nationality)}
                            {...(personalErrors.nationality && { helperText: t('This field is required') })}
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
                  control={personalControl}
                  render={({ field }) => (
                    <CustomTextField
                      error={Boolean(personalErrors.street)}
                      {...(personalErrors.street && { helperText: t('This field is required') })}
                      {...field}
                      fullWidth
                      label={t('Street')}
                      placeholder={t('Enter your street')}
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
                      {...(personalErrors.streetNr && { helperText: t('This field is required') })}
                      fullWidth
                      label={t('Street Number')}
                      placeholder={t('Enter your street number')}
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
                      {...(personalErrors.city && { helperText: t('This field is required') })}
                      fullWidth
                      label={t('City')}
                      placeholder={t('Enter your city')}
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
                      {...(personalErrors.ZipCode && { helperText: t('This field is required') })}
                      fullWidth
                      label={t('Zipcode')}
                      placeholder={t('Enter Zipcode')}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
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
                      label={<Translations text={'Special health care needs'} />}
                      placeholder={t('Special health care needs')}
                      error={Boolean(personalErrors.Note)}
                      {...(personalErrors.Note && { helperText: t('This field is required') })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant='tonal' color='secondary' disabled>
                  {t('Back')}
                </Button>
                <Button type='submit' variant='contained'>
                  {t('Confirm')}
                </Button>
              </Grid>
            </Grid>
          </form>
        )
      // case 1:
      //   return (
      //     // <form key={1} onSubmit={handleAccountSubmit(onSubmitAccount)}>
      //     <div>
      //       <Grid container spacing={5}>
      //         <Grid item xs={12}>
      //           <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
      //             {t(steps[1].title)}
      //           </Typography>
      //           <Typography variant='caption' component='p'>
      //             {t(steps[1].subtitle)}
      //           </Typography>
      //         </Grid>
      //         {/* <Grid item xs={12} sm={6}>
      //           <Controller
      //             name='CourseID'
      //             control={accountControl}
      //             render={({ field }) => {
      //               const selectedCourse = courses.find(course => course.id === field.value)

      //               return (
      //                 <Autocomplete
      //                   options={courses.map(course => ({ value: course.id, label: course.name }))}
      //                   getOptionLabel={option => option.label || ''}
      //                   value={selectedCourse ? { value: selectedCourse.id, label: selectedCourse.name } : null}
      //                   onChange={(event, newValue) => {
      //                     field.onChange(newValue ? newValue.value : '')
      //                   }}
      //                   renderInput={params => (
      //                     <CustomTextField
      //                       {...params}
      //                       fullWidth
      //                       label='Select Course'
      //                       variant='outlined'
      //                       error={Boolean(accountErrors.CourseID)}
      //                       {...(accountErrors.CourseID && { helperText: t('This field is required') })}
      //                     />
      //                   )}
      //                 />
      //               )
      //             }}
      //           />
      //         </Grid> */}
      //         <Grid container spacing={2} sx={{ mt: 4 }}>
      //           {renderData}
      //         </Grid>

      //         <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
      //           <Button variant='tonal' color='secondary' onClick={handleBack}>
      //             {t('Back')}
      //           </Button>
      //           {/* <Button type='submit' disabled={isSubmitting} variant='contained'>
      //             {isSubmitting ? <CircularProgress size={25} /> : t('Confirm')}
      //           </Button> */}
      //         </Grid>
      //       </Grid>
      //       {/* </form> */}
      //     </div>
      //   )

      // case 2:
      //   return (
      //     <Box>
      //       {' '}
      //       <iframe src={`data:application/pdf;base64,${base64File}`} width='100%' height='800vh' title={'test'} />
      //       <Divider sx={{ mt: 2 }} />
      //       {/* New Checkboxes */}
      //       <Grid item xs={12} sx={{ mt: 8, display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap' }}>
      //         <FormControlLabel
      //           control={
      //             <Checkbox color={'success'} checked={isChecked1} onChange={() => setIsChecked1(!isChecked1)} />
      //           }
      //           sx={{ width: '49%' }}
      //           color='success'
      //           label={
      //             <Translations
      //               text={
      //                 'Ich bestätige, den Vertrag gelesen und verstanden zu haben und erkläre mich damit einverstanden, diesen kostenpflichtig abzuschließen.'
      //               }
      //             />
      //           }
      //         />
      //         <FormControlLabel
      //           control={
      //             <Checkbox color={'success'} checked={isChecked2} onChange={() => setIsChecked2(!isChecked2)} />
      //           }
      //           sx={{ width: '49%' }}
      //           label={
      //             <Translations
      //               text={
      //                 'Ich habe die /Allgemeinen Geschäftsbedingungen (AGB)/ gelesen, verstanden und akzeptiere diese.'
      //               }
      //             />
      //           }
      //         />
      //       </Grid>
      //       {/* <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mt: 8 }}>
      //         <Button
      //           color='success'
      //           onClick={() => handleAcceptContract()}
      //           variant='contained'
      //           disabled={acceptContractLoading || !isChecked1 || !isChecked2}
      //         >
      //           {acceptContractLoading ? (
      //             <CircularProgress size={25} />
      //           ) : (
      //             <>
      //               {' '}
      //               <Box sx={{ mr: 2 }}>
      //                 <Icon fontSize='1.125rem' icon='oui:pages-select' />
      //               </Box>
      //               <Translations text={'Accept'} />
      //             </>
      //           )}
      //         </Button>
      //       </Grid> */}
      //     </Box>
      //   )
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
              {t('Your child was registerd successfully ! and a copy of the Contract was sent to your email')}
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
    <>
      <Card>
        {/* <CardContent>
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
        */}

        <CardContent>{renderContent()}</CardContent>
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog} aria-labelledby='confirmation-dialog-title'>
        <DialogTitle id='confirmation-dialog-title'>{t('Confirm Submission')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t(
              'Are you sure you want to submit this child registration? The child will be moved to pending approvals for management review.'
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant='outlined' color='secondary'>
            {t('Cancel')}
          </Button>
          <Button onClick={handleConfirmSubmit} variant='contained' color='primary'>
            {t('Confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AddChildWizard
