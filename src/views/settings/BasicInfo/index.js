import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Button, CircularProgress, Grid, IconButton, InputAdornment, Typography, Skeleton } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import CustomTextField from 'src/@core/components/mui/text-field'
import { styled } from '@mui/material/styles'
import Icon from 'src/@core/components/icon'
import { fetchSchoolInfoBasic, updateSchoolInfoBasic } from 'src/store/apps/settings'

const FileInputLabel = styled('label')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  width: '100%',
  maxWidth: 180,
  minHeight: 180,
  border: `1px solid rgba(${theme.palette.customColors.main}, 0.2)`,
  '&:hover': {
    borderColor: theme.palette.primary.main
  }
}))

const HiddenInput = styled('input')({
  display: 'none'
})

const ImagePreview = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 180,
  height: 180,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  border: `1px solid rgba(${theme.palette.customColors.main}, 0.2)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.action.hover,
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  }
}))

const BasicInfo = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { schoolInfoBasic, schoolInfoBasicLoading, schoolInfoBasicUpdating } = useSelector(state => state.settings)
  const [logoPreview, setLogoPreview] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      schoolName: '',
      schoolOwner: '',
      facebook: '',
      instagram: '',
      privacyPolicy: ''
    }
  })

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchSchoolInfoBasic())
  }, [dispatch])

  // Update form when data is loaded
  useEffect(() => {
    if (schoolInfoBasic) {
      // Handle both direct data and wrapped data structures
      const data = schoolInfoBasic.data || schoolInfoBasic

      if (data && (data.schoolName || data.schoolOwner)) {
        reset({
          schoolName: data.schoolName || '',
          schoolOwner: data.schoolOwner || '',
          facebook: data.facebook || '',
          instagram: data.instagram || '',
          privacyPolicy: data.privacyPolicy || ''
        })

        // Set logo preview if logoBase64 exists
        if (data.logoBase64) {
          // Handle base64 string with or without data URL prefix
          const base64String = data.logoBase64.startsWith('data:')
            ? data.logoBase64
            : `data:image/png;base64,${data.logoBase64}`
          setLogoPreview(base64String)
        }
      }
    }
  }, [schoolInfoBasic, reset])

  const handleFileInputClick = () => {
    document.getElementById('logo-file-input').click()
  }

  const handleFileChange = e => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveLogo = () => {
    setSelectedFile(null)
    setLogoPreview(null)
  }

  const onSubmit = async data => {
    try {
      await dispatch(
        updateSchoolInfoBasic({
          schoolName: data.schoolName,
          schoolOwner: data.schoolOwner,
          facebook: data.facebook,
          instagram: data.instagram,
          privacyPolicy: data.privacyPolicy,
          logoFile: selectedFile
        })
      ).unwrap()
    } catch (error) {
      console.error('Error updating school info:', error)
    }
  }

  if (schoolInfoBasicLoading) {
    return (
      <Box sx={{ margin: '20px 0' }}>
        <Grid container spacing={5}>
          {/* Logo Skeleton */}
          <Grid item xs={12} sm={2}>
            <Skeleton variant='rectangular' width={180} height={180} sx={{ borderRadius: 1, mb: 2 }} />
            <Skeleton variant='rectangular' width={180} height={36} sx={{ borderRadius: 1 }} />
          </Grid>

          {/* Fields Skeleton */}
          <Grid item xs={12} sm={10}>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={6}>
                <Skeleton variant='text' width='100%' height={56} sx={{ mb: 1 }} />
                <Skeleton variant='rectangular' width='100%' height={56} sx={{ borderRadius: 1 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Skeleton variant='text' width='100%' height={56} sx={{ mb: 1 }} />
                <Skeleton variant='rectangular' width='100%' height={56} sx={{ borderRadius: 1 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Skeleton variant='text' width='100%' height={56} sx={{ mb: 1 }} />
                <Skeleton variant='rectangular' width='100%' height={56} sx={{ borderRadius: 1 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Skeleton variant='text' width='100%' height={56} sx={{ mb: 1 }} />
                <Skeleton variant='rectangular' width='100%' height={56} sx={{ borderRadius: 1 }} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    )
  }

  return (
    <Box sx={{ margin: '20px 0' }}>
      <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={5}>
          {/* Logo Upload Section */}
          <Grid item xs={12} sm={2} sx={{ display: 'flex', flexDirection: 'column' }}>
            {logoPreview ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 0 }}>
                <ImagePreview>
                  <img src={logoPreview} alt='School Logo' />
                </ImagePreview>
                <Button
                  variant='outlined'
                  color='error'
                  onClick={handleRemoveLogo}
                  startIcon={<Icon icon='tabler:trash' />}
                  size='small'
                  sx={{ fontSize: '0.65rem', width: '100%', maxWidth: 180 }}
                >
                  {t('Remove')}
                </Button>
              </Box>
            ) : (
              <FileInputLabel onClick={handleFileInputClick}>
                <HiddenInput id='logo-file-input' type='file' accept='image/*' onChange={handleFileChange} />
                <CustomTextField
                  label={t('Upload Logo')}
                  value={selectedFile ? selectedFile.name : t('Click to upload logo')}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position='end'>
                        <Icon icon='tabler:upload' fontSize='1.25rem' />
                      </InputAdornment>
                    )
                  }}
                  fullWidth
                />
              </FileInputLabel>
            )}
          </Grid>

          {/* All Fields - Next to Logo */}
          <Grid item xs={12} sm={10}>
            <Grid container spacing={5}>
              {/* School Name */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name='schoolName'
                  control={control}
                  rules={{ required: t('School Name is required') }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      label={t('School Name')}
                      placeholder={t('Enter school name')}
                      error={!!errors.schoolName}
                      helperText={errors.schoolName?.message}
                    />
                  )}
                />
              </Grid>

              {/* School Owner */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name='schoolOwner'
                  control={control}
                  rules={{ required: t('School Owner is required') }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      label={t('School Owner')}
                      placeholder={t('Enter school owner')}
                      error={!!errors.schoolOwner}
                      helperText={errors.schoolOwner?.message}
                    />
                  )}
                />
              </Grid>

              {/* Facebook */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name='facebook'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      label={t('Facebook URL')}
                      placeholder='www.facebook.com'
                      error={!!errors.facebook}
                      helperText={errors.facebook?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Icon icon='tabler:brand-facebook' />
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Instagram */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name='instagram'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      label={t('Instagram URL')}
                      placeholder='www.instagram.com'
                      error={!!errors.instagram}
                      helperText={errors.instagram?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Icon icon='tabler:brand-instagram' />
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Privacy Policy */}
              <Grid item xs={12}>
                <Controller
                  name='privacyPolicy'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      label={t('Privacy Policy URL')}
                      placeholder={t('www.example.com/privacy-policy')}
                      error={!!errors.privacyPolicy}
                      helperText={errors.privacyPolicy?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Icon icon='tabler:link' />
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              fullWidth
              disabled={schoolInfoBasicUpdating}
              type='submit'
              variant='contained'
              sx={{ mb: 4 }}
              startIcon={schoolInfoBasicUpdating ? <CircularProgress size={20} /> : <Icon icon='tabler:check' />}
            >
              {schoolInfoBasicUpdating ? t('Saving...') : t('Save Changes')}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}

export default BasicInfo
