import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Button, CircularProgress, Grid, IconButton, InputAdornment, Skeleton } from '@mui/material'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import { fetchSchoolInfoReportKeys, updateSchoolInfoReportKeys } from 'src/store/apps/settings'

const ReportsSettings = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { schoolInfoReportKeys, schoolInfoReportKeysLoading, schoolInfoReportKeysUpdating } = useSelector(
    state => state.settings
  )

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      reportKeys: [{ value: '' }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'reportKeys'
  })

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchSchoolInfoReportKeys())
  }, [dispatch])

  // Update form when data is loaded
  useEffect(() => {
    if (schoolInfoReportKeys) {
      // Handle both direct data and wrapped data structures
      const data = schoolInfoReportKeys.data || schoolInfoReportKeys

      if (Array.isArray(data) && data.length > 0) {
        const formattedData = data.map(key => ({ value: key }))
        reset({
          reportKeys: formattedData
        })
      } else if (Array.isArray(data) && data.length === 0) {
        // If empty array, start with one field
        reset({
          reportKeys: [{ value: '' }]
        })
      }
    }
  }, [schoolInfoReportKeys, reset])

  const handleAddField = () => {
    if (fields.length < 20) {
      append({ value: '' })
    }
  }

  const handleRemoveField = index => {
    if (fields.length > 1) {
      remove(index)
    }
  }

  const onSubmit = async data => {
    try {
      const reportKeysArray = data.reportKeys.map(item => item.value).filter(value => value.trim() !== '')
      await dispatch(
        updateSchoolInfoReportKeys({
          reportKeys: reportKeysArray
        })
      ).unwrap()
    } catch (error) {
      console.error('Error updating reports settings:', error)
    }
  }

  if (schoolInfoReportKeysLoading) {
    return (
      <Box sx={{ margin: '20px 0' }}>
        <Grid container spacing={5}>
          {[...Array(3)].map((_, index) => (
            <Grid item xs={12} key={index}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Skeleton variant='rectangular' width='100%' height={56} sx={{ borderRadius: 1, flex: 1 }} />
                <Skeleton variant='circular' width={40} height={40} />
              </Box>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Skeleton variant='rectangular' width={200} height={40} sx={{ borderRadius: 1 }} />
          </Grid>
        </Grid>
      </Box>
    )
  }

  return (
    <Box sx={{ margin: '20px 0' }}>
      <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={5}>
          {fields.map((field, index) => (
            <Grid item xs={12} key={field.id}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Controller
                  name={`reportKeys.${index}.value`}
                  control={control}
                  rules={{
                    required: t('Report key is required'),
                    validate: value => {
                      if (!value || value.trim() === '') {
                        return t('Report key cannot be empty')
                      }
                      return true
                    }
                  }}
                  render={({ field: controllerField }) => (
                    <CustomTextField
                      {...controllerField}
                      fullWidth
                      label={`${t('Report Key')} ${index + 1}`}
                      placeholder={t('Enter report key')}
                      error={!!errors.reportKeys?.[index]?.value}
                      helperText={errors.reportKeys?.[index]?.value?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Icon icon='tabler:file-text' />
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
                <IconButton
                  color='error'
                  onClick={() => handleRemoveField(index)}
                  disabled={fields.length === 1}
                  sx={{
                    mt: 0.5,
                    '&.Mui-disabled': {
                      opacity: 0.3
                    }
                  }}
                >
                  <Icon icon='tabler:trash' />
                </IconButton>
              </Box>
            </Grid>
          ))}

          {/* Add Field Button */}
          <Grid item xs={12}>
            <Button
              variant='outlined'
              onClick={handleAddField}
              disabled={fields.length >= 20}
              startIcon={<Icon icon='tabler:plus' />}
              sx={{ mb: 4 }}
            >
              {t('Add Field')} {fields.length >= 20 && `(${t('Max 20 fields')})`}
            </Button>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              disabled={schoolInfoReportKeysUpdating}
              type='submit'
              variant='contained'
              sx={{ mb: 4 }}
              startIcon={schoolInfoReportKeysUpdating ? <CircularProgress size={20} /> : <Icon icon='tabler:check' />}
            >
              {schoolInfoReportKeysUpdating ? t('Saving...') : t('Save Changes')}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}

export default ReportsSettings
