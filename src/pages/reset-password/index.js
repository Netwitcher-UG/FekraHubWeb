// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import { useRouter } from 'next/router'
import FallbackSpinner from 'src/@core/components/spinner'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import AuthIllustrationV1Wrapper from 'src/views/pages/auth/AuthIllustrationV1Wrapper'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'

// ** Validation
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '25rem' }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: `${theme.palette.primary.main} !important`
}))

const ResetPasswordV1 = () => {
  const auth = useAuth()
  const router = useRouter()

  const [token, setToken] = useState(null)
  const [email, setEmail] = useState(null)

  // ** States
  const [values, setValues] = useState({
    showpassword: false,
    showConfirmPassword: false
  })

  const { Token, Email } = router.query
  useEffect(() => {
    if (Token && Email) {
      setToken(Token.toString())
      setEmail(Email.toString())
    }
  }, [router.query])

  // ** Hook
  const theme = useTheme()

  // ** Form Validation Schema
  const schema = yup.object().shape({
    password: yup
      .string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/\d/, 'Password must contain at least one digit')
      .matches(/[^a-zA-Z0-9]/, 'Password must contain at least one non-alphabetic character'),
    confirmPassword: yup
      .string()
      .required('Confirm Password is required')
      .oneOf([yup.ref('password'), null], 'Passwords must match')
  })

  // ** React Hook Form
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  const onSubmit = async data => {
    const resetData = {
      ...data,
      email: email,
      token: token
    }
    const response = await auth.resetPassword(resetData)

    if (response?.status == 200) {
      toast.success('The password was reset successfully !')
      router.replace('/login')
    } else if (response?.status != 200) {
      toast.error('unable to reset password !')
      console.log(response)
    }
    // Handle password reset logic here
  }

  const handleClickShowpassword = () => {
    setValues({ ...values, showpassword: !values.showpassword })
  }

  const handleClickShowConfirmPassword = () => {
    setValues({ ...values, showConfirmPassword: !values.showConfirmPassword })
  }

  return (
    <>
      {!token || !email ? (
        <FallbackSpinner />
      ) : (
        <Box className='content-center'>
          <AuthIllustrationV1Wrapper>
            <Card>
              <CardContent sx={{ p: theme => `${theme.spacing(10.5, 8, 8)} !important` }}>
                <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width={34} viewBox='0 0 32 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      fill={theme.palette.primary.main}
                      d='M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z'
                    />
                    <path
                      fill='#161616'
                      opacity={0.06}
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z'
                    />
                    <path
                      fill='#161616'
                      opacity={0.06}
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z'
                    />
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      fill={theme.palette.primary.main}
                      d='M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z'
                    />
                  </svg>
                  <Typography variant='h3' sx={{ ml: 2.5, fontWeight: 700 }}>
                    {themeConfig.templateName}
                  </Typography>
                </Box>
                <Box sx={{ mb: 6 }}>
                  <Typography variant='h4' sx={{ mb: 1.5 }}>
                    Reset Password 🔒
                  </Typography>
                  <Typography sx={{ display: 'flex' }}>
                    for{' '}
                    <Typography component='span' sx={{ ml: 1, fontWeight: 500 }}>
                      {email}
                    </Typography>
                  </Typography>
                </Box>
                <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                  <Controller
                    name='password'
                    control={control}
                    defaultValue=''
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        autoFocus
                        label='New Password'
                        placeholder='············'
                        type={values.showpassword ? 'text' : 'password'}
                        error={!!errors.password}
                        helperText={errors.password ? errors.password.message : ''}
                        sx={{ display: 'flex', mb: 4 }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                edge='end'
                                onClick={handleClickShowpassword}
                                onMouseDown={e => e.preventDefault()}
                                aria-label='toggle password visibility'
                              >
                                <Icon fontSize='1.25rem' icon={values.showpassword ? 'tabler:eye' : 'tabler:eye-off'} />
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    )}
                  />
                  <Controller
                    name='confirmPassword'
                    control={control}
                    defaultValue=''
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        label='Confirm Password'
                        placeholder='············'
                        type={values.showConfirmPassword ? 'text' : 'password'}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword ? errors.confirmPassword.message : ''}
                        sx={{ display: 'flex', mb: 4 }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                edge='end'
                                onMouseDown={e => e.preventDefault()}
                                aria-label='toggle password visibility'
                                onClick={handleClickShowConfirmPassword}
                              >
                                <Icon
                                  fontSize='1.25rem'
                                  icon={values.showConfirmPassword ? 'tabler:eye' : 'tabler:eye-off'}
                                />
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    )}
                  />
                  <Button fullWidth type='submit' variant='contained' sx={{ mb: 4 }}>
                    Set New Password
                  </Button>
                  <Typography
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', '& svg': { mr: 1 } }}
                  >
                    <Typography component={LinkStyled} href='/pages/auth/login-v1'>
                      <Icon fontSize='1.25rem' icon='tabler:chevron-left' />
                      <span>Back to login</span>
                    </Typography>
                  </Typography>
                </form>
              </CardContent>
            </Card>
          </AuthIllustrationV1Wrapper>
        </Box>
      )}
    </>
  )
}
ResetPasswordV1.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default ResetPasswordV1
