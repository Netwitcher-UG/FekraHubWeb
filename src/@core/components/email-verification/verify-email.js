import { useState, useEffect } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import themeConfig from 'src/configs/themeConfig'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import AuthIllustrationV1Wrapper from 'src/views/pages/auth/AuthIllustrationV1Wrapper'

const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '25rem' }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const VerifyEmailV1 = ({ email, reason = 'Account activation', resend = false, handleResend: customHandleResend }) => {
  const theme = useTheme()
  const [timer, setTimer] = useState(0)
  const [canResend, setCanResend] = useState(true)

  useEffect(() => {
    let interval
    if (!canResend) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev > 0) return prev - 1
          setCanResend(true)
          clearInterval(interval)
          return 0
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [canResend])

  const handleResend = () => {
    if (canResend) {
      setCanResend(false)
      setTimer(120)

      if (customHandleResend) {
        customHandleResend(email)
      }
    }
  }

  return (
    <Box className='content-center' sx={{ display: 'flex', justifyContent: 'center' }}>
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
                Verify your email ✉️
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                {reason} link sent to your email address: {email}. Please follow the link inside to continue.
              </Typography>
            </Box>
            {resend && (
              <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ color: 'text.secondary' }}>Didn't get the mail?</Typography>
                {canResend ? (
                  <Typography
                    component={LinkStyled}
                    href='/'
                    onClick={e => {
                      e.preventDefault()
                      handleResend()
                    }}
                    sx={{ ml: 1 }}
                  >
                    Resend
                  </Typography>
                ) : (
                  <Typography sx={{ ml: 1, color: 'text.secondary' }}>Resend in {timer}s</Typography>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      </AuthIllustrationV1Wrapper>
    </Box>
  )
}

VerifyEmailV1.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default VerifyEmailV1
