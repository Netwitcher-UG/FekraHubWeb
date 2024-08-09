import React, { useEffect, useState } from 'react'
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
import { Autocomplete, Chip, Grid, TextField } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import Translations from 'src/layouts/components/Translations'
import CustomTextField from 'src/@core/components/mui/text-field'
import { fetchCourses } from 'src/store/apps/students'
import { addWorksheet } from 'src/store/apps/worksheets/worksheets'
import { Stack } from '@mui/system'

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

// إضافة الأنماط المخصصة لعنصر Label
const FileInputLabel = styled('label')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  width: '100%',
  '&:hover': {
    borderColor: theme.palette.primary.main
  }
}))

const HiddenInput = styled('input')({
  display: 'none'
})

const AdduWorksheets = ({ dataUploadType, data }) => {
  const [open, setOpen] = useState(false)
  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const dispatch = useDispatch()

  const defaultValues = {
    courseId: [''],
    UploadTypeId: '',
    file: ''
  }

  const {
    control,
    handleSubmit,
    resetField,
    formState: { errors, isDirty },
    reset
  } = useForm({
    defaultValues,
    mode: 'onBlur'
  })

  const onSubmit = async data => {
    console.log('🚀 ~ handleSaveData ~ data:', data)

    const formData = new FormData()
    formData.append('file', selectedFile)
    data.courseId.forEach(id => formData.append('courseId', id))
    formData.append('UploadTypeId', data.UploadTypeId)

    try {
      await dispatch(addWorksheet(formData))
      handleClose()
      reset()
    } catch (error) {
      console.error('Error submitting data:', error)
    }
  }

  const handleFileInputClick = () => {
    document.getElementById('file-input').click()
  }

  return (
    <div>
      <Button onClick={handleClickOpen} variant='contained' sx={{ '& svg': { mr: 2 } }}>
        <Icon fontSize='1.125rem' icon='tabler:plus' />
        <Translations text={'Add Worksheets'} />
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogTitle id='customized-dialog-title' sx={{ p: 4 }}>
          <Typography variant='h4' sx={{ fontWeight: '900' }}>
            <Translations text={'Add Worksheets'} />
          </Typography>
          <CustomCloseButton aria-label='close' onClick={handleClose}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: theme => `${theme.spacing(4)} !important`, border: 'none' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={12} sm={12} lg={12}>
                <Controller
                  name='courseId'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, value, ref } }) => (
                    <Autocomplete
                      multiple
                      options={data}
                      getOptionLabel={option => option.name}
                      value={data?.filter(course => value.includes(course.id))}
                      onChange={(event, newValue) => {
                        onChange(newValue.map(item => item.id))
                      }}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='Select Courses'
                          error={Boolean(errors.courseId)}
                          helperText={errors.courseId ? 'This field is required' : ''}
                          inputRef={ref}
                        />
                      )}
                      renderOption={(props, option) => (
                        <li {...props}>
                          <Chip label={option.name} />
                        </li>
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={12} lg={12}>
                <Controller
                  name='UploadTypeId'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <Autocomplete
                      options={dataUploadType?.map(teacher => ({ value: teacher.id, label: teacher.typeTitle }))}
                      fullWidth
                      id='autocomplete-UserId'
                      getOptionLabel={option => option.label}
                      value={
                        value
                          ? { value, label: dataUploadType.find(teacher => teacher.id === value)?.typeTitle || '' }
                          : null
                      }
                      onChange={(event, newValue) => {
                        onChange(newValue ? newValue.value : '')
                      }}
                      renderInput={params => (
                        <CustomTextField
                          {...params}
                          fullWidth
                          sx={{ mb: 4 }}
                          placeholder=''
                          label='UploadTypeId'
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
              <Grid item xs={12}>
                <FileInputLabel onClick={handleFileInputClick}>
                  <HiddenInput
                    id='file-input'
                    type='file'
                    accept='application/pdf'
                    onChange={e => {
                      setSelectedFile(e.target.files[0])
                      console.log(e.target.files[0])
                    }}
                  />
                  <CustomTextField
                    label='Upload File'
                    value={selectedFile ? selectedFile.name : ''}
                    InputProps={{
                      endAdornment: <Icon icon='tabler:upload' fontSize='1.25rem' />
                    }}
                    fullWidth
                  />
                </FileInputLabel>
              </Grid>
            </Grid>
            <Stack direction={'row'} alignItems={'center'} justifyContent={'center'} spacing={5} marginTop={'2rem'}>
              <Button disabled={!isDirty} type='submit' variant='contained'>
                <Translations text={'Add Worksheets'} />
              </Button>
              <Button type='button' variant='outlined' onClick={handleClose}>
                <Translations text={'cancel'} />
              </Button>
            </Stack>
          </form>
        </DialogContent>
        <DialogActions sx={{ p: theme => `${theme.spacing(3)} !important` }}></DialogActions>
      </Dialog>
    </div>
  )
}

export default AdduWorksheets
