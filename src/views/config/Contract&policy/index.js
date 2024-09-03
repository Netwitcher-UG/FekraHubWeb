import { Box, Button, CircularProgress, Divider, Grid, Icon, IconButton, InputAdornment, Typography } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
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

export default function ContractPolicy (){

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
    lastname: yup.string().required('Lastname is required'),
    phoneNumber: yup
      .string()
      .required('Phone Number is required')
      .matches(/^\d{10,}$/, 'Phone Number must be at least 10 digits'), // At least 10 digits
    emergencyPhoneNumber: yup
      .string()
      .required('Emergency Phone Number is required')
      .matches(/^\d{10,}$/, 'Emergency Phone Number must be at least 10 digits'),
    birthplace: yup.string().required('Birthplace is required'),
    nationality: yup.string().required('Nationality is required'),
    street: yup.string().required('Street is required'),
    streetNr: yup.string().required('Street number is required'),
    zipCode: yup.string().required('ZipeCode is required'),
    city: yup.string().required('City is required'),
    job: yup.string().required('Job is required'),
    graduation: yup.string().required('Graduation is required'),
    birthday: yup.date().nullable().required('Birthday is required'),
    gender: yup.string().required('Gender is required')
  })
  const {
    watch,
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      // username: '',
      password: '',
      email: '',
      phoneNumber: null,
      firstName: '',
      lastname: '',
      emergencyPhoneNumber: null,
      birthplace: '',
      nationality: '',
      street: '',
      streetNr: '',
      city: '',
      job: '',
      ContractPages: [{ EmailServer: '' }],
      graduation: '',
      birthday: null,
      gender: '',
      zipCode: ''
    }
  })
  const emailValue = watch('email')
  const onSubmit = async data => {
    const parsedDate = new Date(data?.birthday)
    const formattedDate = parsedDate?.toLocaleDateString('en-US')
    try {
      const formData = new FormData()
      // formData.append('username', data.username)
      formData.append('password', data.password)
      formData.append('email', data.email)
      formData.append('phoneNumber', data.phoneNumber.toString())
      formData.append('firstName', data.firstName)
      formData.append('lastname', data.lastname)
      formData.append('emergencyPhoneNumber', data.emergencyPhoneNumber.toString())
      formData.append('birthplace', data.birthplace)
      formData.append('nationality', data.nationality)
      formData.append('street', data.street)
      formData.append('streetNr', data.streetNr)
      formData.append('zipCode', data.zipCode)
      formData.append('city', data.city)
      formData.append('job', data.job)
      formData.append('graduation', data.graduation)
      formData.append('birthday', data.birthday ? formattedDate : '')

      formData.append('gender', data.gender)

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

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ContractPages'
  });

  return(
<Box sx={{margin:'40px'}}>
    <form
                  noValidate
                  autoComplete='off'
                  onSubmit={handleSubmit(onSubmit)}
                  style={{ width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}
                >
                  <Grid container spacing={5}>

                    <Grid item xs={12} sm={6}>
                    {fields.map((field, index) => (
  <Box key={field.id}>
    <Controller
      name={`ContractPages.${index}.EmailServer`}  // Ensure the correct index is used
      control={control}
      render={({ field }) => (
        <CustomTextField
          {...field}
          fullWidth
          label={`Contract Page ${index + 1}`}
          placeholder='Please enter Contract Pages'
          error={!!errors.ContractPages?.[index]?.EmailServer}
          helperText={errors.ContractPages?.[index]?.EmailServer?.message}
        />
      )}
    />
    <Button sx={{margin:'12px'}} variant='text' color='error'  onClick={() => remove(index)}>
      Remove
    </Button>
  </Box>
))}

<Button variant='outlined'  onClick={() => append({ EmailServer: '' })}>
  Add New Contract Pages
</Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='EmailPortNumber'
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            fullWidth
                            label='EmailPort Number'
                            placeholder='please enter EmailPort Number'
                            error={!!errors.EmailPortNumber}
                            helperText={errors.EmailPortNumber?.message}

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
