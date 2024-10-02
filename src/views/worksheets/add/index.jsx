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
import { Autocomplete, Box, Chip, Grid, TextField } from '@mui/material'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import Translations from 'src/layouts/components/Translations'
import CustomTextField from 'src/@core/components/mui/text-field'
import { fetchCourses } from 'src/store/apps/students'
import { addWorksheet } from 'src/store/apps/worksheets'
import { Stack } from '@mui/system'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
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

const schema = yup.object().shape({
  courseId: yup
  .string()
  .required('select course is required'),
  UploadTypeId: yup
  .number()
  .required('course Id is required'),

  files: yup.array().required('File is required'),
  // Additional validation for other fields can go here
});


const AddWorksheets = ({ dataUploadType, data }) => {

  const [open, setOpen] = useState(false)
  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedFiles, setSelectedFiles] = useState([]);

  const dispatch = useDispatch()
  const { t } = useTranslation()
  const defaultValues = {
    courseId: '',
    UploadTypeId: '',
    files:[],

  }

  const {
    control,
    handleSubmit,
    resetField,
    formState: { errors, isDirty },
    reset
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
    mode: 'onBlur'
  })



  const onSubmit = async data => {
    console.log('🚀 ~ handleSaveData ~ data:', data)
    const formData = new FormData
    formData.append('courseId',data.courseId)
    formData.append('UploadTypeId',data.UploadTypeId)

    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('files', selectedFiles[i]); // Append each file, 'files[]' indicates an array
    }
    try {
      await dispatch(addWorksheet(formData))
      handleClose()
      reset()
      setSelectedFiles(null)
      setSelectedFile(null)
    } catch (error) {
      console.error('Error submitting data:', error)
    }
  }

  const handleFileInputClick = () => {
    document.getElementById('file-input').click()
  }

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'courseSchedule'
  });

  return (
    <div>
      <Button onClick={handleClickOpen} variant='contained' sx={{ '& svg': { mr: 2 } }}>
        <Icon fontSize='1.125rem' icon='tabler:plus' />
        <Translations text={'Add Files'} />
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogTitle id='customized-dialog-title' sx={{ p: 4 }}>
          <Typography variant='h4' sx={{ fontWeight: '900' }}>
            <Translations text={'Add Course Files'} />
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
                  render={({ field: { value, onChange } }) => (
                    <Autocomplete
                      options={data.map(course => ({ value: course.id, label: course.name }))}
                      fullWidth
                      id='autocomplete-UserId'
                      value={
                        value
                          ? { value, label: data?.find(course => course.id === value)?.name || '' }
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
                          label={t('Select Courses')}
                          id='validation-billing-select'
                          aria-describedby='validation-billing-select'
                          error={Boolean(errors.courseId)}
                          helperText={errors.courseId?.message || ''}
                        />
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
                          label={t('Upload Type')}
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




      <Controller
  name={`files`}
  control={control}
  render={({ field }) => (
    <FileInputLabel onClick={handleFileInputClick}>
    <HiddenInput
      id='file-input'
      type='file'
      accept='application/pdf'
      multiple  // Enable multiple file selections
      onChange={e => {
        const files = Array.from(e.target.files);  // Convert FileList to an array
        field.onChange(files);  // Update field with the array of files
        setSelectedFiles(files);  // Update local state with selected files
      }}
    />
    <CustomTextField
      label={t('Upload Files')}
      value={selectedFiles?.map(file => file.name).join(', ') || ''}  // Show names of all selected files
      InputProps={{
        endAdornment: <Icon icon='tabler:upload' fontSize='1.25rem' />
      }}
      fullWidth
      error={Boolean(errors.files)}
      helperText={errors.files?.message || ''}
    />
  </FileInputLabel>
  )}
/>

              </Grid>
            </Grid>
            <Stack direction={'row'} alignItems={'center'} justifyContent={'center'} spacing={5} marginTop={'2rem'}>
              <Button disabled={!isDirty} type='submit' variant='contained'>
                <Translations text={'Add Course Files'} />
              </Button>
              <Button type='button' variant='outlined' onClick={handleClose}>
                <Translations text={'Cancel'} />
              </Button>
            </Stack>
          </form>
        </DialogContent>
        <DialogActions sx={{ p: theme => `${theme.spacing(3)} !important` }}></DialogActions>
      </Dialog>
    </div>
  )
}

export default AddWorksheets
