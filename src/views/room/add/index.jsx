import { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Icon from 'src/@core/components/icon'
import { Autocomplete, Grid } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import Translations from 'src/layouts/components/Translations'
import CustomTextField from 'src/@core/components/mui/text-field'
import { addLocation, fetchLocation } from 'src/store/apps/location'
import { addRoom } from 'src/store/apps/courses'
import { useTranslation } from 'react-i18next'
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

const schema = yup.object().shape({
  name: yup.string().required('name is required'),
  locationID: yup.string().required('city is required')
})

const AddRoom = () => {
  const { t } = useTranslation()
  const { data, status, error } = useSelector(state => state.location)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchLocation(''))
  }, [dispatch])

  const [open, setOpen] = useState(false)
  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const defaultValues = {
    name: '',
    locationID: ''
  }

  const {
    control,
    handleSubmit,
    resetField,
    formState: { errors, isDirty },
    reset
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onBlur'
  })

  const onSubmit = async data => {
    console.log(data)
    try {
      dispatch(addRoom(data))
      handleClose()
      reset()
    } catch (error) {}
  }

  return (
    <div>
      <Button onClick={handleClickOpen} variant='contained' sx={{ '& svg': { mr: 2 } }}>
        <Icon fontSize='1.125rem' icon='tabler:plus' />
        <Translations text={t('Add Room')} />
      </Button>

      <Dialog
        maxWidth={'md'}
        open={open}
        onClose={handleClose}
        fullWidth
        aria-labelledby='customized-dialog-title'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogTitle id='customized-dialog-title' sx={{ p: 4 }}>
          <Typography variant='h4' sx={{ fontWeight: '900' }}>
            <Translations text={t('Add Room')} />
          </Typography>
          <CustomCloseButton aria-label='close' onClick={handleClose}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers sx={{ p: theme => `${theme.spacing(4)} !important`, border: 'none' }}>
            <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={12} sm={12} lg={12}>
                <Controller
                  name='name'
                  defaultValue=''
                  control={control}
                  rules={(require = true)}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      autoFocus
                      label={`${t('Name')}`}
                      variant='outlined'
                      error={!!errors.name}
                      helperText={errors.name ? errors.name.message : ''}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={12} lg={12}>
                <Controller
                  name='locationID'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <Autocomplete
                      options={data?.map(teacher => ({ value: teacher.id, label: teacher.name }))}
                      fullWidth
                      id='autocomplete-UserId'
                      getOptionLabel={option => option.label}
                      value={value ? { value, label: data.find(teacher => teacher.id === value)?.name || '' } : null}
                      onChange={(event, newValue) => {
                        onChange(newValue ? newValue.value : '')
                      }}
                      renderInput={params => (
                        <CustomTextField
                          {...params}
                          fullWidth
                          sx={{ mb: 4 }}
                          placeholder=''
                          label={t('Location')}
                          id='validation-billing-select'
                          aria-describedby='validation-billing-select'
                          error={Boolean(errors.locationID)}
                          helperText={errors.locationID?.message || ''}
                        />
                      )}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: theme => `${theme.spacing(3)} !important` }}>
            <Button disabled={!isDirty} type='submit' variant='contained'>
              <Translations text={t('Add Room')} />
            </Button>
            <Button type='button' variant='outlined' onClick={handleClose}>
              <Translations text={t('Cancel')} />
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  )
}

export default AddRoom
