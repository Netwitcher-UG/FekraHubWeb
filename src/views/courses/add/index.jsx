import { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'
import { Autocomplete, InputAdornment, TextField } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { addCourses } from 'src/store/apps/courses'
import { fetchLocation } from 'src/store/apps/location'
import Icon from 'src/@core/components/icon'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import CustomTextField from 'src/@core/components/mui/text-field'

const CustomCloseButton = styled(IconButton)(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))

const schema = yup.object().shape({
  Price: yup
    .number()
    .required('Price is required')
    .positive('Price must be a positive number')
    .min(1, 'Price must be at least 1'),

  Lessons: yup
    .number()
    .required('Lessons are required')
    .integer('Lessons must be an integer')
    .min(1, 'Lessons must be at least 1'),

  Capacity: yup
    .number()
    .required('Capacity is required')
    .integer('Capacity must be an integer')
    .min(1, 'Capacity must be at least 1'),
  Name: yup.string().required('Course Name is required').min(2, 'Course Name must be at least 2 characters'),
  TeacherId: yup.string().required('Teacher is required'),
  StartDate: yup.date().required('Start Date is required').nullable(),
  EndDate: yup.date().required('End Date is required').nullable().min(yup.ref('StartDate'))
})

const AddCourses = ({ dataRooms, dataTeacher }) => {
  console.log('🚀 ~ AddCourses ~ dataTeacher:', dataTeacher)
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0) // Step control
  const [location, setLocation] = useState('')
  console.log('🚀 ~ AddCourses ~ location:', location)
  const [roomOptions, setRoomOptions] = useState([])

  const dispatch = useDispatch()
  const { data: DataLocation } = useSelector(state => state.location)
  console.log('🚀 ~ AddCourses ~ DataLocation:', DataLocation)

  useEffect(() => {
    dispatch(fetchLocation(''))
  }, [dispatch])

  const defaultValues = {
    LocationId: '',
    RoomId: '',
    Name: '',
    Price: '',
    Lessons: '',
    Capacity: '',
    StartDate: '',
    EndDate: '',
    UserId: ''
  }

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm({ defaultValues, resolver: yupResolver(schema) })

  const handleNextStep = () => {
    if (step === 0) {
      const selectedRooms = dataRooms.filter(room => room.LocationId === location)
      setRoomOptions(selectedRooms)
    }
    setStep(prev => prev + 1)
  }

  const handleSaveData = data => {
    dispatch(addCourses(data))
    reset()
    handleClose()
  }

  const handleClose = () => {
    setOpen(false)
    setStep(0)
    setLocation('')
    setRoomOptions([])
  }

  return (
    <div>
      <Button onClick={() => setOpen(true)} variant='contained'>
        <Icon icon='tabler:plus' />
        Add Courses
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <Typography variant='h4'>Add Courses</Typography>
          <CustomCloseButton aria-label='close' onClick={handleClose}>
            <Icon icon='tabler:x' />
          </CustomCloseButton>
        </DialogTitle>
        <DialogContent>
          {step === 0 && (
            <Grid container spacing={4}>
              <Grid item xs={12} sm={12} lg={12} md={12} sx={{ width: '400px' }}>
                <Controller
                  name='LocationId'
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      fullWidth
                      options={DataLocation}
                      getOptionLabel={option => option.name || ''}
                      onChange={(event, value) => {
                        const selectedId = value ? value : ''
                        field.onChange(selectedId)
                        setLocation(selectedId)
                      }}
                      renderInput={params => (
                        <CustomTextField
                          fullWidth
                          {...params}
                          label='Select Location'
                          variant='outlined'
                          error={!!errors.LocationId}
                          helperText={errors.LocationId ? errors.LocationId.message : ''}
                        />
                      )}
                    />
                  )}
                />
              </Grid>
              {/* <Grid item xs={12}>
                <Controller
                  name='RoomId'
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={roomOptions}
                      getOptionLabel={option => option.name}
                      renderInput={params => <TextField {...params} label='Select Room' variant='outlined' />}
                      onChange={(event, value) => {
                        field.onChange(value ? value.id : '')
                      }}
                    />
                  )}
                />
              </Grid> */}
            </Grid>
          )}
          {step === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name='RoomId'
                  control={control}
                  render={({ field: { onChange, value, ref } }) => (
                    <Autocomplete
                      options={location.room}
                      getOptionLabel={option => option.name || ''}
                      renderInput={params => (
                        <CustomTextField
                          {...params}
                          label='Select Room'
                          variant='outlined'
                          inputRef={ref}
                          error={!!errors.RoomId}
                          helperText={errors.RoomId ? errors.RoomId.message : ''}
                        />
                      )}
                      onChange={(event, newValue) => {
                        onChange(newValue ? newValue.id : '')
                      }}
                      value={location.room.find(room => room.id === value) || null}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name='TeacherId'
                  control={control}
                  render={({ field: { onChange, value, ref } }) => (
                    <Autocomplete
                      options={dataTeacher}
                      getOptionLabel={option => option.firstName || ''}
                      renderInput={params => (
                        <CustomTextField
                          {...params}
                          label='Teacher'
                          variant='outlined'
                          inputRef={ref}
                          error={!!errors.TeacherId}
                          helperText={errors.TeacherId ? errors.TeacherId.message : ''}
                        />
                      )}
                      onChange={(event, newValue) => {
                        onChange(newValue ? newValue.id : '')
                      }}
                      value={dataTeacher.find(t => t.id === value) || null}
                    />
                  )}
                />
              </Grid>
              {/* Add other fields here like Name, Price, etc. */}
              <Grid item xs={12}>
                <Controller
                  name='Name'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      label='Course Name'
                      variant='outlined'
                      fullWidth
                      error={!!errors.Name}
                      helperText={errors.Name ? errors.Name.message : ''}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name='Price'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      label='Price'
                      type='number'
                      variant='outlined'
                      fullWidth
                      error={!!errors.Price}
                      helperText={errors.Price ? errors.Price.message : ''}
                      InputProps={{
                        endAdornment: <InputAdornment position='end'>€</InputAdornment>
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name='Lessons'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      label='Lessons'
                      variant='outlined'
                      fullWidth
                      error={!!errors.Lessons}
                      helperText={errors.Lessons ? errors.Lessons.message : ''}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name='Capacity'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      label='Capacity'
                      variant='outlined'
                      fullWidth
                      error={!!errors.Capacity}
                      helperText={errors.Capacity ? errors.Capacity.message : ''}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name='StartDate'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      label='StartDate'
                      variant='outlined'
                      fullWidth
                      error={!!errors.StartDate}
                      helperText={errors.StartDate ? errors.StartDate.message : ''}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name='EndDate'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      label='EndDate'
                      variant='outlined'
                      fullWidth
                      error={!!errors.EndDate}
                      helperText={errors.EndDate ? errors.EndDate.message : ''}
                    />
                  )}
                />
              </Grid>

              {/* Add more fields as needed */}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          {step > 0 && (
            <Button onClick={() => setStep(prev => prev - 1)} color='primary'>
              Back
            </Button>
          )}
          {step < 1 ? (
            <Button onClick={handleNextStep} disabled={location.length === 0} color='primary'>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit(handleSaveData)} color='primary'>
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default AddCourses
