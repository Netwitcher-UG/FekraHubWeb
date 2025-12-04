import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyPayroll } from 'src/store/apps/payroll'
import MyPayrollDataGrid from 'src/views/my-payroll/dataGrid'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import { useAuth } from 'src/hooks/useAuth'
import Icon from 'src/@core/components/icon'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

export default function Index() {
  const { myPayroll, myPayrollLoading } = useSelector(state => state.payroll)
  const auth = useAuth()
  const theme = useTheme()
  const { t } = useTranslation()
  const dispatch = useDispatch()

  useEffect(() => {
    if (auth.user?.role !== 'Admin') {
      dispatch(fetchMyPayroll())
    }
  }, [dispatch, auth.user?.role])

  // Show message for Admin role
  if (auth.user?.role === 'Admin') {
    return (
      <Grid container spacing={6.5} sx={{ height: 'calc(100vh - 145px)', overflow: 'hidden' }}>
        <Grid item xs={12} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              background: `linear-gradient(135deg, ${hexToRGBA(theme.palette.primary.main, 0.6)} 0%, ${hexToRGBA(
                theme.palette.primary.dark,
                0.75
              )} 50%, ${hexToRGBA(theme.palette.primary.dark, 0.85)} 100%)`,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 20% 50%, rgba(0, 0, 0, 0.1) 0%, transparent 50%)',
                pointerEvents: 'none'
              }
            }}
          >
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 6,
                position: 'relative',
                zIndex: 1
              }}
            >
              <Box
                sx={{
                  mb: 4,
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}
              >
                <Icon icon='tabler:report-money' style={{ fontSize: '60px', color: '#ffffff' }} />
              </Box>
              <Typography
                variant='h4'
                sx={{
                  color: '#ffffff',
                  fontWeight: 600,
                  mb: 2,
                  textAlign: 'center',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
                }}
              >
                {t('Administrative Notice')}
              </Typography>
              <Typography
                variant='h6'
                sx={{
                  color: 'rgba(255, 255, 255, 0.95)',
                  fontWeight: 400,
                  textAlign: 'center',
                  maxWidth: '600px',
                  lineHeight: 1.8,
                  letterSpacing: '0.3px'
                }}
              >
                {t(
                  'Administrators do not have an associated payroll record. This section is designated for employees and staff members with active payroll information.'
                )}
              </Typography>
              <Box
                sx={{
                  mt: 4,
                  px: 4,
                  py: 2,
                  borderRadius: 2,
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <Typography
                  variant='body2'
                  sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontStyle: 'italic',
                    textAlign: 'center'
                  }}
                >
                  {t('For payroll management, please navigate to the Employees Payroll section.')}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    )
  }

  return (
    <Grid container spacing={6.5} sx={{ height: 'calc(100vh - 145px)', overflow: 'hidden' }}>
      <Grid item xs={12} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <MyPayrollDataGrid rows={myPayroll || []} loading={myPayrollLoading} />
        </Card>
      </Grid>
    </Grid>
  )
}
