// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'

// ** Redux
import { useDispatch } from 'react-redux'
import { acceptContract } from 'src/store/apps/contracts'

// ** Components
import FallbackSpinner from 'src/@core/components/spinner'
import CustomAvatar from 'src/@core/components/mui/avatar'
import Icon from 'src/@core/components/icon'
import Image from 'next/image'

// ** Hooks
import { useTranslation } from 'react-i18next'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import AuthIllustrationV1Wrapper from 'src/views/pages/auth/AuthIllustrationV1Wrapper'

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '25rem' }
}))

const ConfirmContractPage = () => {
  // ** Hooks
  const router = useRouter()
  const dispatch = useDispatch()
  const theme = useTheme()
  const { t } = useTranslation()
  const { token, studentId, parentId } = router.query

  const [status, setStatus] = useState('loading') // 'loading', 'success', 'error'

  useEffect(() => {
    if (!token || !studentId || !parentId) return

    const confirmContract = async () => {
      try {
        const response = await dispatch(
          acceptContract({
            token: token.toString(),
            parentId: parentId.toString(),
            studentId: parseInt(studentId.toString())
          })
        )

        // Check if response is successful (status 200-299)
        const responseStatus = response?.payload?.status || response?.status
        if (responseStatus >= 200 && responseStatus < 300) {
          setStatus('success')
        } else {
          setStatus('error')
        }
      } catch (error) {
        setStatus('error')
      }
    }

    confirmContract()
  }, [token, studentId, parentId, dispatch])

  const handleGoHome = () => {
    router.push('/')
  }

  if (status === 'loading') {
    return <FallbackSpinner />
  }

  return (
    <Box className='content-center'>
      <AuthIllustrationV1Wrapper>
        <Card>
          <CardContent sx={{ p: theme => `${theme.spacing(10.5, 8, 8)} !important` }}>
            <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Image width={34} height={40} src={'/images/favicon.png'} />
              <Typography variant='h3' sx={{ ml: 2.5, fontWeight: 700 }}>
                {themeConfig.templateName}
              </Typography>
            </Box>
            <Box sx={{ mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {status === 'success' ? (
                <>
                  <CustomAvatar skin='light' variant='circle' color={'success'} sx={{ width: 100, height: 100, mb: 4 }}>
                    <Icon icon={'lets-icons:check-ring'} fontSize={100} color={'success'} />
                  </CustomAvatar>
                  <Typography sx={{ color: 'text.secondary', textAlign: 'center', mb: 4 }}>
                    {t('Contract confirmed successfully!')}
                  </Typography>
                  <Button fullWidth variant='contained' onClick={handleGoHome}>
                    {t('Go Home')}
                  </Button>
                </>
              ) : (
                <>
                  <CustomAvatar skin='light' variant='circle' color={'error'} sx={{ width: 100, height: 100, mb: 4 }}>
                    <Icon icon={'mi:circle-error'} fontSize={100} color={'error'} />
                  </CustomAvatar>
                  <Typography sx={{ color: 'text.secondary', textAlign: 'center', mb: 4 }}>
                    {t('The link is expired or invalid')}
                  </Typography>
                  <Button fullWidth variant='contained' onClick={handleGoHome}>
                    {t('Go Home')}
                  </Button>
                </>
              )}
            </Box>
          </CardContent>
        </Card>
      </AuthIllustrationV1Wrapper>
    </Box>
  )
}

ConfirmContractPage.getLayout = page => <BlankLayout>{page}</BlankLayout>
ConfirmContractPage.guestGuard = true

export default ConfirmContractPage
