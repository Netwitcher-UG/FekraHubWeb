import { Box, Button, CircularProgress, Divider, Grid, Icon, IconButton, InputAdornment, Typography } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import CustomTextField from 'src/@core/components/mui/text-field';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { styled } from '@mui/material/styles'

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

export default function BasicsInfo (){

  const [showPassword, setShowPassword] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  const handleFileInputClick = () => {
    document.getElementById('file-input').click()
  }

  const schema = yup.object().shape({
    // username: yup.string().required('Username is required'),
    password: yup
      .string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d])[\s\S]{6,}$/,
        'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one non-alphabetic character'
      ),
    email: yup.string().email('Invalid email').required('Email is required'),
    firstName: yup.string().required('Firstname is required'),
    SchoolName: yup.string().required('SchoolName is required'),
    SchoolOwner: yup.string().required('SchoolOwner is required'),
    lastname: yup.string().required('Lastname is required'),
  })
  const {
    watch,
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      SchoolName: '',
      SchoolOwner: '',
      password: '',
      email: '',
      firstName: '',
      lastname: '',
    }
  })
  const onSubmit = async data => {
    try {
      const formData = new FormData()
      // formData.append('username', data.username)
      formData.append('password', data.password)
      formData.append('email', data.email)
      formData.append('SchoolName', data.SchoolName)
      formData.append('SchoolName', data.SchoolOwner)
      formData.append('firstName', data.firstName)
      formData.append('lastname', data.lastname)
      const response = await auth.register(formData)
      if (response?.status == 400) toast.error(response.data)
      else if (response?.status == 200) setIsregistedDone(true)
    } catch (error) {
      console.error('Error registering user:', error)
    }
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return(
<Box sx={{margin:'40px'}}>
    <form
                  noValidate
                  autoComplete='off'
                  onSubmit={handleSubmit(onSubmit)}
                  style={{ width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}
                >
                  <Grid container spacing={5}>
                  <Grid item xs={12}>
                <FileInputLabel onClick={handleFileInputClick}>
                  <HiddenInput
                    id='file-input'
                    type='file'
                    accept='.png , .gif , .svg , .ico '
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
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='SchoolName'
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            fullWidth
                            label='School Name'
                            placeholder='please enter School Name'
                            error={!!errors.SchoolName}
                            helperText={errors.SchoolName?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='SchoolOwner'
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            fullWidth
                            label='School Owner'
                            placeholder='please enter School Owner'
                            error={!!errors.SchoolOwner}
                            helperText={errors.SchoolOwner?.message}

                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='firstName'
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            fullWidth
                            label='First Name'
                            placeholder='Enter your first name'
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='lastname'
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            fullWidth
                            label='Last Name'
                            placeholder='Enter your last name'
                            error={!!errors.lastname}
                            helperText={errors.lastname?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='Email'
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            fullWidth
                            label='Email'
                            placeholder='Enter your Email'
                            type='email'
                            error={!!errors.email}
                            helperText={errors.email?.message}
                          />
                        )}
                      />

                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='password'
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            fullWidth
                            label='Password'
                            placeholder='············'
                            id='auth-register-password'
                            type={showPassword ? 'text' : 'password'}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position='end'>
                                  <IconButton
                                    edge='end'
                                    onClick={handleClickShowPassword}
                                    onMouseDown={e => e.preventDefault()}
                                    aria-label='toggle password visibility'
                                  >
                                    <Icon fontSize='1.25rem' icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                                  </IconButton>
                                </InputAdornment>
                              )
                            }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={24} sm={12}>
                      <Button fullWidth disabled={isSubmitting} type='submit' variant='contained' sx={{ mb: 4 }}>
                        {isSubmitting ? <CircularProgress size={25} /> : 'Submit'}
                      </Button>
                    </Grid>

                  </Grid>
                </form>
                </Box>
  )

}
