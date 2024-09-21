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
import { useTranslation } from 'react-i18next'
import { fetchEmployees } from 'src/store/apps/users'
import { postMail, updateMailLabel } from 'src/store/apps/email'
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
  Subject: yup.string().required('Subject is required'),
  Message: yup.string().required('Message is required'),
  UserId:yup.array().required('User is required')
})

const AddMessage = () => {
  const { t } = useTranslation()
  const { employeesData } = useSelector(state => state.users)
  console.log('🚀 ~ AddMessage ~ data:', employeesData)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchEmployees())
  }, [dispatch])

  const [open, setOpen] = useState(false)
  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const defaultValues = {
    Subject: '',
    Message:'',
    UserId:[]
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

  const handleSaveData = data => {
    console.log("🚀 ~ handleSaveData ~ data:", data)
    try {
      dispatch(postMail(data))
      handleClose()
      reset()
    } catch (error) {}
  }

  return (
    <div>
      <Button onClick={handleClickOpen} variant='contained' sx={{ '& svg': { mr: 2 } }}>
        <Icon fontSize='1.125rem' icon='tabler:plus' />
        <Translations text={t('Send Message')} />
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogTitle id='customized-dialog-title' sx={{ p: 4 }}>
          <Typography variant='h4' sx={{ fontWeight: '900' }}>
            <Translations text={t('Send Message')} />
          </Typography>
          <CustomCloseButton aria-label='close' onClick={handleClose}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: theme => `${theme.spacing(4)} !important`, border: 'none' }}>
          <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12} sm={12} lg={12}>
              <Controller
                name='Subject'
                defaultValue=''
                control={control}
                rules={(require = true)}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    autoFocus
                    label={`${t('Subject')}`}
                    variant='outlined'
                    error={!!errors.Subject}
                    helperText={errors.Subject ? errors.Subject.message : ''}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={12} lg={12}>

                          <Controller
  name='UserId'
  control={control}
  render={({ field: { onChange, value, ref } }) => (
    <Autocomplete
      multiple
      options={employeesData}
      getOptionLabel={option => option.firstName+' '+option.lastName  || ''}
      renderInput={params => (
        <CustomTextField
          {...params}
          label={t('Send to ')}
          variant='outlined'
          inputRef={ref}
          error={!!errors.TeacherId}
          helperText={errors.TeacherId ? errors.TeacherId.message : ''}
        />
      )}
      onChange={(event, newValue) => {

        onChange(newValue.map(option => option.id));
      }}
      value={employeesData.filter(t => value?.includes(t.id)) || []}
    />
  )}
/>
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
              <Controller
                name='Message'
                defaultValue=''
                control={control}
                rules={(require = true)}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    autoFocus
                    label={`${t('Message')}`}
                    variant='outlined'
                     rows={4}
                    multiline
                    row={5}
                    error={!!errors.Message}
                    helperText={errors.Message ? errors.Message.message : ''}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: theme => `${theme.spacing(3)} !important` }}>
          <Button disabled={!isDirty} type='button' variant='contained' onClick={handleSubmit(handleSaveData)}>
            <Translations text={t('Send')} />
          </Button>
          <Button type='button' variant='outlined' onClick={handleClose}>
            <Translations text={t('Cancel')} />
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default AddMessage
