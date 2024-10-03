import Link from 'next/link'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import CircularProgress from '@mui/material/CircularProgress'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useAuth } from 'src/hooks/useAuth'
import toast from 'react-hot-toast'
import VerifyEmailV1 from '../pages/auth/verify-email-v1'
import Icon from 'src/@core/components/icon'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'

// Styled Components
const ForgotPasswordIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 650,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxHeight: 500
  }
}))

const RightWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 450
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 600
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 750
  }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: theme.palette.primary.main,
  fontSize: theme.typography.body1.fontSize
}))

const ForgotPassword = () => {
  const { t } = useTranslation() // useTranslation hook for translations
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const auth = useAuth()
  const [isEmailValid, setIsEmailValid] = useState(false)

  const schema = yup.object().shape({
    email: yup.string().email(t('Invalid email')).required(t('Email is required'))
  })

  const defaultValues = {
    email: ''
  }

  const {
    control,
    setError,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const emailValue = watch('email')

  const onSubmit = async data => {
    const response = await auth.forget(data.email)
    if (response !== 200) toast.error(t('Email is not registered!'))
    else if (response === 200) setIsEmailValid(true)
  }

  return (
    <>
      {!isEmailValid ? (
        <Box className='content-right' sx={{ backgroundColor: 'background.paper' }}>
          {!hidden ? (
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                position: 'relative',
                alignItems: 'center',
                borderRadius: '20px',
                justifyContent: 'center',
                backgroundColor: 'customColors.bodyBg',
                margin: theme => theme.spacing(8, 0, 8, 8)
              }}
            >
              <ForgotPasswordIllustration
                alt={t('forgot-password-illustration')}
                src={`/images/pages/auth-v2-forgot-password-illustration-${theme.palette.mode}.png`}
              />
              <FooterIllustrationsV2 />
            </Box>
          ) : null}
          <RightWrapper>
            <Box
              sx={{
                p: [6, 12],
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Box sx={{ width: '100%', maxWidth: 400 }}>
                <Image width={34} height={40} src={'/images/favicon.png'} />
                <Box sx={{ my: 6 }}>
                  <Typography sx={{ mb: 1.5, fontWeight: 500, fontSize: '1.625rem', lineHeight: 1.385 }}>
                    {t('Forgot Password?')} 🔒
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    {t("Enter your email and we'll send you instructions to reset your password")}
                  </Typography>
                </Box>
                <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                  <Controller
                    name='email'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <CustomTextField
                        fullWidth
                        autoFocus
                        label={t('Email')}
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        sx={{ mb: 4 }}
                        placeholder={t('Email')}
                        error={Boolean(errors.email)}
                        {...(errors.email && { helperText: errors.email.message })}
                      />
                    )}
                  />
                  <Button fullWidth disabled={isSubmitting} type='submit' variant='contained' sx={{ mb: 4 }}>
                    {isSubmitting ? <CircularProgress size={25} /> : t('Send reset link')}
                  </Button>
                  <Typography
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', '& svg': { mr: 1 } }}
                  >
                    <LinkStyled href='/login'>
                      <Icon fontSize='1.25rem' icon='tabler:chevron-left' />
                      <span>{t('Back to login')}</span>
                    </LinkStyled>
                  </Typography>
                </form>
              </Box>
            </Box>
          </RightWrapper>
        </Box>
      ) : (
        <VerifyEmailV1
          email={emailValue}
          resend={true}
          reason={t('Reset Password')}
          handleResend={() => auth.forget(emailValue)}
        />
      )}
    </>
  )
}

ForgotPassword.getLayout = page => <BlankLayout>{page}</BlankLayout>
ForgotPassword.guestGuard = true

export default ForgotPassword
