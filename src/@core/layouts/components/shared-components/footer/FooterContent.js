// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

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
  // ** Var
  const hidden = useMediaQuery(theme => theme.breakpoints.down('md'))

  return (
 <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Typography
        sx={{
          display: 'flex',
          alignItems: 'center', // Ensure elements align vertically center
          color: 'text.secondary',
        }}
      >
        {`© ${new Date().getFullYear()}, Made with `}
        <Box component="span" sx={{ mx: 1, color: 'error.main' }}>
          ❤️
        </Box>
        {`by`}
        <Box

          sx={{
            display: 'flex',
            alignItems: 'start',
          }}
        >
          <a href="https://netwitcher.com" target="_blank" rel="noopener noreferrer">
            <Box
              component="img"
              src="/images/logos/Netwitcher.svg"
              alt="Netwitcher"
              sx={{
                width: 110,
                height: 100,
                display: 'flex',
                alignItems:'start' // Keeps image inline

              }}
            />
          </a>
        </Box>
      </Typography>
    </Box>  )
}

export default FooterContent
