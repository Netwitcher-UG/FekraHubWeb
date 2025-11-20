import { useState, useEffect, useMemo } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  MenuItem,
  IconButton,
  Typography
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch } from 'react-redux'
import { updateStudentInfo, fetchStudents } from 'src/store/apps/students'
import CustomTextField from 'src/@core/components/mui/text-field'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import Autocomplete from '@mui/material/Autocomplete'
import countryList from 'react-select-country-list'
import toast from 'react-hot-toast'
import Translations from 'src/layouts/components/Translations'
import Icon from 'src/@core/components/icon'
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

const schema = yup.object().shape({
  firstName: yup.string().optional(),
  lastName: yup.string().optional(),
  gender: yup.string().optional(),
  birthday: yup.date().optional(),
  nationality: yup.string().optional(),
  note: yup.string(),
  street: yup.string().optional(),
  streetNr: yup.string().optional(),
  zipCode: yup.string().optional(),
  city: yup.string().optional()
})

const EditStudentDialog = ({ open, handleClose, studentData, search, selectedCourse, currentPage, pageSize }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const countryOptions = useMemo(() => countryList().getData(), [])
  const [nationality, setNationality] = useState(null)

  // Normalize gender to match MenuItem values (Male/Female)
  const getNormalizedGender = gender => {
    if (!gender) return ''
    return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase()
  }

  const defaultValues = {
    firstName: studentData?.firstName || '',
    lastName: studentData?.lastName || '',
    gender: getNormalizedGender(studentData?.gender),
    birthday: studentData?.birthday ? new Date(studentData.birthday) : null,
    nationality: studentData?.nationality || '',
    note: studentData?.note || '',
    street: studentData?.street || '',
    streetNr: studentData?.streetNr || '',
    zipCode: studentData?.zipCode || '',
    city: studentData?.city || ''
  }

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onBlur'
  })

  useEffect(() => {
    if (studentData && open) {
      // Normalize gender to match MenuItem values (Male/Female)
      const normalizedGender = getNormalizedGender(studentData?.gender)

      reset({
        firstName: studentData?.firstName || '',
        lastName: studentData?.lastName || '',
        gender: normalizedGender,
        birthday: studentData?.birthday ? new Date(studentData.birthday) : null,
        nationality: studentData?.nationality || '',
        note: studentData?.note || '',
        street: studentData?.street || '',
        streetNr: studentData?.streetNr || '',
        zipCode: studentData?.zipCode || '',
        city: studentData?.city || ''
      })
      if (studentData?.nationality) {
        setNationality({ label: studentData.nationality, value: studentData.nationality })
      } else {
        setNationality(null)
      }
    } else if (!open) {
      // Reset form when dialog closes
      reset({
        firstName: '',
        lastName: '',
        gender: '',
        birthday: null,
        nationality: '',
        note: '',
        street: '',
        streetNr: '',
        zipCode: '',
        city: ''
      })
      setNationality(null)
    }
  }, [studentData, reset, open])

  const onSubmit = async data => {
    try {
      // Prepare JSON data
      const jsonData = {
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        birthday: data.birthday ? data.birthday.toISOString() : null,
        nationality: data.nationality,
        note: data.note || '',
        street: data.street,
        streetNr: data.streetNr,
        zipCode: data.zipCode,
        city: data.city
      }

      const response = await dispatch(updateStudentInfo({ id: studentData?.id, data: jsonData }))

      if (response?.payload?.status === 200 || response?.type?.includes('fulfilled')) {
        toast.success(<Translations text={'Student updated successfully'} />)
        // Refetch students with current filters
        dispatch(
          fetchStudents({
            search: search || '',
            course: selectedCourse || '',
            PageSize: pageSize || 20,
            PageNumber: currentPage || 1
          })
        )
        handleClose()
        reset()
      } else {
        const errorMessage = response?.payload?.data || t('Something went wrong, please try again!')
        toast.error(
          typeof errorMessage === 'string'
            ? errorMessage
            : errorMessage?.message || errorMessage?.title || t('Failed to update student')
        )
      }
    } catch (error) {
      toast.error(t('Error updating student'))
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth='lg'
      fullWidth
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogTitle sx={{ position: 'relative', pb: 4 }}>
        <Typography variant='h4' sx={{ fontWeight: 600 }}>
          <Translations text={'Edit Student'} />
        </Typography>
        <CustomCloseButton aria-label='close' onClick={handleClose}>
          <Icon icon='tabler:x' fontSize='1.25rem' />
        </CustomCloseButton>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers sx={{ pt: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <Controller
                name='firstName'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={<Translations text={'First Name'} />}
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='lastName'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={<Translations text={'Last Name'} />}
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='gender'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    select
                    label={<Translations text={'Gender'} />}
                    error={!!errors.gender}
                    helperText={errors.gender?.message}
                  >
                    <MenuItem value='Male'>{t('Male')}</MenuItem>
                    <MenuItem value='Female'>{t('Female')}</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePickerWrapper>
                <Controller
                  name='birthday'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <DatePicker
                      selected={value}
                      onChange={onChange}
                      dateFormat='dd-MM-yyyy'
                      showYearDropdown
                      showMonthDropdown
                      maxDate={new Date()}
                      customInput={
                        <CustomTextField
                          label={<Translations text={'Birthday'} />}
                          fullWidth
                          error={!!errors.birthday}
                          helperText={errors.birthday?.message}
                        />
                      }
                      placeholderText={t('Select a date')}
                    />
                  )}
                />
              </DatePickerWrapper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='nationality'
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    disableClearable={true}
                    options={countryOptions.map(country => ({
                      value: country.label,
                      label: country.label
                    }))}
                    getOptionLabel={option => option.label || ''}
                    value={nationality}
                    onChange={(event, newValue) => {
                      setNationality(newValue)
                      field.onChange(newValue ? newValue.label : '')
                    }}
                    renderInput={params => (
                      <CustomTextField
                        {...params}
                        fullWidth
                        label={<Translations text={'Nationality'} />}
                        error={!!errors.nationality}
                        helperText={errors.nationality?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='city'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={<Translations text={'City'} />}
                    error={!!errors.city}
                    helperText={errors.city?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='street'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={<Translations text={'Street'} />}
                    error={!!errors.street}
                    helperText={errors.street?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='streetNr'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={<Translations text={'Street Number'} />}
                    error={!!errors.streetNr}
                    helperText={errors.streetNr?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='zipCode'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={<Translations text={'Zip Code'} />}
                    error={!!errors.zipCode}
                    helperText={errors.zipCode?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='note'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    multiline
                    rows={3}
                    label={<Translations text={'Note'} />}
                    error={!!errors.note}
                    helperText={errors.note?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 4 }}>
          <Button variant='outlined' onClick={handleClose} disabled={isSubmitting}>
            <Translations text={'Cancel'} />
          </Button>
          <Button type='submit' variant='contained' disabled={isSubmitting}>
            {isSubmitting ? <Translations text={'Saving...'} /> : <Translations text={'Save'} />}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default EditStudentDialog
