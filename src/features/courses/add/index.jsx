import { useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import AddIcon from '@mui/icons-material/Add'
import Paper from '@mui/material/Paper'
import Icon from 'src/@core/components/icon'
import { Autocomplete, Grid, TextField } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { addCourses } from 'src/store/apps/courses'
import { useDispatch } from 'react-redux'

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

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary
}))

const AddCourses = ({ dataRooms, dataTeacher }) => {
  const [open, setOpen] = useState(false)
  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const dispatch = useDispatch()

  const defaultValues = {
    Name: '',
    Price: '',
    Lessons: '',
    Capacity: '',
    StartDate: '',
    EndDate: '',
    UserId: '',
    RoomId: ''
  }

  const {
    control,
    handleSubmit,
    resetField,
    formState: { errors, isDirty },
    reset
  } = useForm({
    // resolver: yupResolver(Schema),
    defaultValues,
    mode: 'onBlur'
  })

  const handleSaveData = data => {
    try {
      dispatch(addCourses(data))
      handleClose()
      reset()
    } catch (error) {}
  }

  return (
    <div>
      <Button variant='contained' onClick={handleClickOpen}>
        <AddIcon /> Add Courses
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogTitle id='customized-dialog-title' sx={{ p: 4 }}>
          <Typography variant='h4' sx={{ fontWeight: '900' }}>
            Add Courses
          </Typography>
          <CustomCloseButton aria-label='close' onClick={handleClose}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: theme => `${theme.spacing(4)} !important`, border: 'none' }}>
          <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={6} sm={6} lg={6}>
              <Controller
                name='Name'
                defaultValue=''
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    autoFocus
                    label={`${'Name'}`}
                    variant='outlined'
                    error={!!errors.Name}
                    helperText={errors.Name ? errors.Name.message : ''}
                  />
                )}
              />
              <Typography>{errors.Name ? errors.Name.message : ''}</Typography>
            </Grid>
            <Grid item xs={6} sm={6} lg={6}>
              <Controller
                name='Price'
                defaultValue=''
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={`${'Price'}`}
                    variant='outlined'
                    error={!!errors.name}
                    helperText={errors.name ? errors.name.message : ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name='Lessons'
                defaultValue=''
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={`${'Lessons'}`}
                    variant='outlined'
                    error={!!errors.name}
                    helperText={errors.name ? errors.name.message : ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} sm={6} lg={6}>
              <Controller
                name='Capacity'
                defaultValue=''
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={`${'Capacity'}`}
                    variant='outlined'
                    error={!!errors.name}
                    helperText={errors.name ? errors.name.message : ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} sm={6} lg={6}>
              <Controller
                name='StartDate'
                defaultValue=''
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={`${'StartDate'}`}
                    variant='outlined'
                    error={!!errors.name}
                    helperText={errors.name ? errors.name.message : ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} sm={6} lg={6}>
              <Controller
                name='EndDate'
                defaultValue=''
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={`${'EndDate'}`}
                    variant='outlined'
                    error={!!errors.name}
                    helperText={errors.name ? errors.name.message : ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} sm={6} lg={6}>
              <Controller
                name='UserId'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <Autocomplete
                    options={dataTeacher?.map(teacher => ({ value: teacher.id, label: teacher.firstName }))}
                    fullWidth
                    id='autocomplete-UserId'
                    getOptionLabel={option => option.label}
                    value={
                      value
                        ? { value, label: dataTeacher.find(teacher => teacher.id === value)?.firstName || '' }
                        : null
                    }
                    onChange={(event, newValue) => {
                      onChange(newValue ? newValue.value : '')
                    }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        fullWidth
                        sx={{ mb: 4 }}
                        placeholder=''
                        label='UserId'
                        id='validation-billing-select'
                        aria-describedby='validation-billing-select'
                        error={Boolean(errors.UserId)}
                        helperText={errors.UserId?.message || ''}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} sm={6} lg={6}>
              <Controller
                name='RoomId'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <Autocomplete
                    options={dataRooms?.map(room => ({ value: room.id, label: room.name }))}
                    fullWidth
                    id='autocomplete-RoomId'
                    getOptionLabel={option => option.label}
                    value={value ? { value, label: dataRooms.find(room => room.id === value)?.name || '' } : null}
                    onChange={(event, newValue) => {
                      onChange(newValue ? newValue.value : '')
                    }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        fullWidth
                        sx={{ mb: 4 }}
                        placeholder=''
                        label='Room'
                        id='validation-billing-select'
                        aria-describedby='validation-billing-select'
                        error={Boolean(errors.RoomId)}
                        helperText={errors.RoomId?.message || ''}
                      />
                    )}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: theme => `${theme.spacing(3)} !important` }}>
          <Button type='button' variant='outlined' onClick={handleClose}>
            cancel
          </Button>
          <Button disabled={!isDirty} type='button' variant='contained' onClick={handleSubmit(handleSaveData)}>
            Add Courses
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default AddCourses
