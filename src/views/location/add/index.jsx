import { useState } from 'react'
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
import { Box, Grid } from '@mui/material'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import Translations from 'src/layouts/components/Translations'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const dispatch = useDispatch()

  const schema = yup.object().shape({
    name: yup.string().required(t('Name is required')),
    street: yup.string().required(t('Street is required')),
    streetNr: yup.string().required(t('Street Number is required')),
    zipCode: yup.string().required(t('Zip Code is required')),
    city: yup.string().required(t('City is required'))
  })

  const defaultValues = {
    name: '',
    street: '',
    streetNr: '',
    zipCode: '',
    city: '',
    rooms: []
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
    mode: 'onChange'
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'Room'
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
                    label={`${t('Name')}`}
                    variant='outlined'
                    error={!!errors.name}
                    helperText={errors.name ? errors.name.message : ''}
                  />
                )}
              />
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
                    label={`${t('Street')}`}
                    variant='outlined'
                    error={!!errors.street}
                    helperText={errors.street ? errors.street.message : ''}
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
                    label={`${t('Street Number')}`}
                    variant='outlined'
                    error={!!errors.streetNr}
                    helperText={errors.streetNr ? errors.streetNr.message : ''}
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
                    label={`${t('Zip Code')}`}
                    variant='outlined'
                    error={!!errors.zipCode}
                    helperText={errors.zipCode ? errors.zipCode.message : ''}
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
                    label={`${t('City')}`}
                    variant='outlined'
                    error={!!errors.city}
                    helperText={errors.city ? errors.city.message : ''}
                  />
                )}
              />
            </Grid>

            <Grid item xs={6} sm={6} lg={6}>
              <Button variant='outlined' sx={{ marginY: '20px' }} onClick={() => append({})}>
                {t('Add New Room')}
              </Button>
            </Grid>
            {fields.map((field, index) => (
              <>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controller
                    name={`rooms.${index}`}
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        type='text'
                        label={`${t('Room')}  ${index + 1}`}
                        error={!!errors.rooms?.[index]}
                        helperText={errors.rooms?.[index].message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6} sm={6} lg={6} sx={{ marginTop: '16px' }}>
                  <Button variant='text' color='error' onClick={() => remove(index)}>
                    {t('Remove')}
                  </Button>
                </Grid>
              </>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: theme => `${theme.spacing(3)} !important` }}>
          <Button type='button' variant='outlined' onClick={handleClose}>
            <Translations text={'Cancel'} />
          </Button>
          <Button disabled={!isDirty} type='button' variant='contained' onClick={handleSubmit(handleSaveData)}>
            <Translations text={'Add Location'} />
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default AddLocation
