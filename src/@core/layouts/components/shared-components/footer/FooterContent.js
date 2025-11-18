// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTranslation } from 'react-i18next'

const StyledCompanyName = styled(Link)(({ theme }) => ({
  fontWeight: 500,
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.text.secondary} !important`,
  '&:hover': {
    color: `${theme.palette.primary.main} !important`
  }
}))

const FooterContent = () => {
  const { t } = useTranslation()
  // ** Var
  const hidden = useMediaQuery(theme => theme.breakpoints.down('md'))

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 1
      }}
    >
      <Typography
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: 'text.secondary',
          fontSize: '0.875rem'
        }}
      >
        {`© ${new Date().getFullYear()}, ${t('Made with')} `}
        <Box component='span' sx={{ mx: 1, color: 'error.main' }}>
          ❤️
        </Box>
        {`${t('by')}`}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            ml: 1
          }}
        >
          <a href='https://netwitcher.com' target='_blank' rel='noopener noreferrer'>
            <Box
              component='img'
              src='/images/logos/Netwitcher.svg'
              alt='Netwitcher'
              sx={{
                width: 100,
                height: 35,
                display: 'block',
                objectFit: 'contain'
              }}
            />
          </a>
        </Box>
      </Typography>
    </Box>
  )
}

export default FooterContent
