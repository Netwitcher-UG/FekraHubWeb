// ** React Imports

// ** MUI Components
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { convertDate } from 'src/@core/utils/convert-date'
import { IconButton } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import EditProfileInfoDialog from './edit-info'
import { useTheme } from '@mui/material/styles'

// ** Third Party Imports

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const ProfilePicture = styled('img')(({ theme }) => ({
  width: 108,
  height: 108,
  borderRadius: theme.shape.borderRadius,
  border: `4px solid ${theme.palette.common.white}`,
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  }
}))

const UserProfileHeader = ({ data }) => {
  const { t } = useTranslation()
  const designationIcon = data?.designationIcon || 'tabler:briefcase'
  const [open, setOpen] = useState(false)
  const handleClickOpen = () => setOpen(true)
  const theme = useTheme()
  const logoPath = theme.palette.mode === 'dark' ? '/images/logos/logo ferka2.png' : '/images/logos/logo ferka2.png'
  return data !== null ? (
    <>
      <Card>
        <Box
          sx={{
            height: { xs: 150, md: 250 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: theme =>
              theme.palette.mode === 'dark'
                ? `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}10 50%, ${theme.palette.primary.main}15 100%)`
                : `linear-gradient(135deg, ${theme.palette.primary.light}20 0%, ${theme.palette.secondary.light}15 50%, ${theme.palette.primary.light}20 100%)`,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box
            component='img'
            src={logoPath}
            alt='FekraHub Logo'
            sx={{
              maxWidth: { xs: '400px', md: '600px' },
              maxHeight: { xs: '180px', md: '250px' },
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              zIndex: 1
            }}
          />
        </Box>
        <CardContent
          sx={{
            pt: 0,
            mt: -8,
            display: 'flex',
            alignItems: 'flex-end',
            flexWrap: { xs: 'wrap', md: 'nowrap' },
            justifyContent: { xs: 'center', md: 'flex-start' }
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: 108,
              height: 108,
              borderRadius: 2,
              // border: `4px solid ${theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.divider}`,
              backgroundColor:
                theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.common.white,
              overflow: 'hidden',
              boxShadow: theme.shadows[4],
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: theme.shadows[8],
                transform: 'translateY(-2px)'
              },
              [theme.breakpoints.down('md')]: {
                marginBottom: theme.spacing(4)
              }
            }}
          >
            <Box
              component='img'
              src='/images/avatars/user avatar.png'
              alt='profile-picture'
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '120%',
                height: '120%',
                minWidth: '100%',
                minHeight: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block',
                opacity: 1
              }}
            />
          </Box>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              ml: { xs: 0, md: 6 },
              alignItems: 'flex-end',
              flexWrap: ['wrap', 'nowrap'],
              justifyContent: ['center', 'space-between']
            }}
          >
            <Box sx={{ mb: [6, 0], display: 'flex', flexDirection: 'column', alignItems: ['center', 'flex-start'] }}>
              <Typography variant='h5' sx={{ mb: 2.5 }}>
                {data.firstName} {data.lastName}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: ['center', 'flex-start']
                }}
              >
                <Box
                  sx={{ mr: 4, display: 'flex', alignItems: 'center', '& svg': { mr: 1.5, color: 'text.secondary' } }}
                >
                  <Icon fontSize='1.25rem' icon={designationIcon} />
                  <Typography sx={{ color: 'text.secondary' }}>{data?.role}</Typography>
                </Box>
                <Box
                  sx={{ mr: 4, display: 'flex', alignItems: 'center', '& svg': { mr: 1.5, color: 'text.secondary' } }}
                >
                  <Icon fontSize='1.25rem' icon='tabler:map-pin' />
                  <Typography sx={{ color: 'text.secondary' }}>{data?.nationality}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 1.5, color: 'text.secondary' } }}>
                  <Icon fontSize='1.25rem' icon='tabler:calendar' />
                  <Typography sx={{ color: 'text.secondary' }}>
                    {t('Joined')} {convertDate(data?.registrationDate)}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <IconButton onClick={() => handleClickOpen()}>
              <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'>
                <path
                  fill='currentColor'
                  d='M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z'
                ></path>
              </svg>
            </IconButton>
          </Box>
        </CardContent>
      </Card>
      <EditProfileInfoDialog open={open} setOpen={setOpen} profileData={data} />
    </>
  ) : null
}

export default UserProfileHeader
