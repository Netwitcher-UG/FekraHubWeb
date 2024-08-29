import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import MenuItem from '@mui/material/MenuItem'
import { Grid } from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import Chip from '@mui/material/Chip'
import Translations from 'src/layouts/components/Translations'
import CustomTextField from 'src/@core/components/mui/text-field'
import { addNewAttendanceRecord } from 'src/store/apps/attendance'
import DatePicker from 'react-datepicker'
import toast from 'react-hot-toast'
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

const schema = yup.object().shape({
  statusId: yup.string().required('Status is required'),
  date: yup.string().required('Date is required')
})

const AddReord = ({ open, setOpen, attendanceStatuses, studentId }) => {
  const handleClose = () => setOpen(false)
  const dispatch = useDispatch()

  const defaultValues = {
    statusId: '',
    date: null
  }

  const {
    control,
    handleSubmit,
    resetField,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onBlur'
  })

  const onSubmit = async data => {
    const parsedDate = new Date(data?.date)
    const formattedDate = parsedDate?.toLocaleDateString('en-US')
    const fullData = { ...data, date: formattedDate, studentId: studentId }

    const response = await dispatch(addNewAttendanceRecord(fullData))
    if (response?.payload?.status == 200) {
      toast.success('Successfully added')
      reset()
      handleClose()
    } else toast.error(response?.payload?.data)
  }

  return (
    <div>
      <Dialog
        maxWidth='md'
        fullWidth
        open={open}
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogTitle id='customized-dialog-title' sx={{ p: 4 }}>
          <Typography variant='h4' sx={{ fontWeight: '900' }}>
            <Translations text={'Add new attendance record'} />
          </Typography>
          <CustomCloseButton aria-label='close' onClick={handleClose}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers sx={{ p: theme => `${theme.spacing(4)} !important`, border: 'none' }}>
            <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={6} sm={6} lg={6}>
                <DatePickerWrapper>
                  <Controller
                    name='date'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <DatePicker
                        selected={value}
                        maxDate={new Date()}
                        onChange={onChange}
                        dateFormat='dd.MM.yyyy'
                        showYearDropdown
                        showMonthDropdown
                        customInput={
                          <CustomTextField
                            label='Date'
                            fullWidth
                            error={Boolean(errors.date)}
                            helperText={errors.date?.message}
                          />
                        }
                        placeholderText='Date'
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
              <Grid item xs={6} sm={6} lg={6}>
                <Controller
                  name='statusId'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      select
                      fullWidth
                      label={'Status'}
                      id='attendance-status-select'
                      error={Boolean(errors.statusId)}
                      helperText={errors.statusId?.message}
                      aria-describedby='attendance-status-select'
                      SelectProps={{
                        value: value,
                        onChange: e => onChange(e),
                        displayEmpty: true
                      }}
                    >
                      {attendanceStatuses?.map(status => (
                        <MenuItem key={status.id} value={status.id}>
                          <Chip label={status.title} color={status.title === 'Absent' ? 'error' : 'warning'} />
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: theme => `${theme.spacing(3)} !important` }}>
            <Button type='button' disabled={isSubmitting} variant='outlined' onClick={handleClose}>
              <Translations text={'cancel'} />
            </Button>
            <Button disabled={isSubmitting} type='submit' variant='contained'>
              <Translations text={'Add'} />
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  )
}

export default AddReord
