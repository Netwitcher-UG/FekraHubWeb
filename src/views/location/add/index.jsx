import { useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Icon from 'src/@core/components/icon'
import { Grid } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import Translations from 'src/layouts/components/Translations'
import CustomTextField from 'src/@core/components/mui/text-field'
import { addLocation } from 'src/store/apps/location'

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

const AddLocation = () => {
  const [open, setOpen] = useState(false)
  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const dispatch = useDispatch()

  const defaultValues = {
    name: '',
    street: '',
    streetNr: '',
    zipCode: '',
    city: ''
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
      dispatch(addLocation(data))
      handleClose()
      reset()
    } catch (error) {}
  }

  return (
    <div>
      <Button onClick={handleClickOpen} variant='contained' sx={{ '& svg': { mr: 2 } }}>
        <Icon fontSize='1.125rem' icon='tabler:plus' />
        <Translations text={'Add Location'} />
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogTitle id='customized-dialog-title' sx={{ p: 4 }}>
          <Typography variant='h4' sx={{ fontWeight: '900' }}>
            <Translations text={'Add Location'} />
          </Typography>
          <CustomCloseButton aria-label='close' onClick={handleClose}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: theme => `${theme.spacing(4)} !important`, border: 'none' }}>
          <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={6} sm={6} lg={6}>
              <Controller
                name='name'
                defaultValue=''
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    autoFocus
                    label={`${'name'}`}
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
                name='street'
                defaultValue=''
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={`${'street'}`}
                    variant='outlined'
                    error={!!errors.name}
                    helperText={errors.name ? errors.name.message : ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name='streetNr'
                defaultValue=''
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={`${'streetNr'}`}
                    variant='outlined'
                    error={!!errors.name}
                    helperText={errors.name ? errors.name.message : ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} sm={6} lg={6}>
              <Controller
                name='zipCode'
                defaultValue=''
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={`${'zipCode'}`}
                    variant='outlined'
                    error={!!errors.name}
                    helperText={errors.name ? errors.name.message : ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} sm={6} lg={6}>
              <Controller
                name='city'
                defaultValue=''
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={`${'city'}`}
                    variant='outlined'
                    error={!!errors.name}
                    helperText={errors.name ? errors.name.message : ''}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: theme => `${theme.spacing(3)} !important` }}>
          <Button type='button' variant='outlined' onClick={handleClose}>
            <Translations text={'cancel'} />
          </Button>
          <Button disabled={!isDirty} type='button' variant='contained' onClick={handleSubmit(handleSaveData)}>
            <Translations text={'Add Courses'} />
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default AddLocation