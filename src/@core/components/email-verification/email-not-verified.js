import Link from 'next/link'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'
import { useState } from 'react'
import themeConfig from 'src/configs/themeConfig'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { useRouter } from 'next/router'
import AuthIllustrationV1Wrapper from 'src/views/pages/auth/AuthIllustrationV1Wrapper'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { useAuth } from 'src/hooks/useAuth'
import { useTranslation } from 'react-i18next' // Import useTranslation

const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '25rem' }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const EmailNotVerified = () => {
  const { t } = useTranslation() // Initialize useTranslation
  const theme = useTheme()
  const router = useRouter()
  const auth = useAuth()
  const [isEmailSent, setIsEmailSent] = useState(false)

  const schema = yup.object().shape({
    email: yup.string().email().required(t('Email is required'))
  })

  const defaultValues = {
    email: ''
  }

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = async data => {
    const response = await auth.resendEmail(data.email)
    if (response.status !== 200) toast.error(t('Could not resend email!'))
    else if (response.status === 200) {
      setIsEmailSent(true)
      toast.success(t('Email Resent!'))
    }
  }

  return (
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
                {t(themeConfig.templateName)}
              </Typography>
            </Box>
            <Box sx={{ mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CustomAvatar skin='light' variant='circle' color={'error'} sx={{ width: 100, height: 100, mb: 4 }}>
                <Icon icon={'mi:circle-error'} fontSize={100} color={'error'} />
              </CustomAvatar>

              <Typography sx={{ color: 'text.secondary', textAlign: 'center' }}>
                {t('Your email was not verified! Maybe the link is expired or invalid :(')}
              </Typography>
            </Box>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name='email'
                control={control}
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
              <Button fullWidth disabled={isEmailSent} type='submit' variant='contained' sx={{ mb: 4 }}>
                {t('Resend email')}
              </Button>
            </form>
            <Button fullWidth variant='contained' onClick={() => router.push('/login')}>
              {t('Go To Login Page')}
            </Button>
          </CardContent>
        </Card>
      </AuthIllustrationV1Wrapper>
    </Box>
  )
}

EmailNotVerified.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default EmailNotVerified
