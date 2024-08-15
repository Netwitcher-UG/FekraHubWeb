// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { convertDate } from 'src/@core/utils/convert-date'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const AboutOverivew = props => {
  const { about } = props

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ mb: 6 }}>
              <Typography variant='body2' sx={{ mb: 6, color: 'primary.main', textTransform: 'uppercase' }}>
                About
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  '&:not(:last-of-type)': { mb: 6 }
                }}
              >
                <Icon fontSize='1.25rem' icon={'tabler:user'} />

                <Typography sx={{ mx: 2, fontWeight: 500, color: 'text.secondary' }}>Full Name:</Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  {about?.firstName} {about?.lastName}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  '&:not(:last-of-type)': { mb: 6 }
                }}
              >
                <Icon fontSize='1.25rem' icon={'uiw:date'} />

                <Typography sx={{ mx: 2, fontWeight: 500, color: 'text.secondary' }}>Birth Date:</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{convertDate(about?.birthday)}</Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  '&:not(:last-of-type)': { mb: 6 }
                }}
              >
                <Icon fontSize='1.25rem' icon={'icons8:gender'} />

                <Typography sx={{ mx: 2, fontWeight: 500, color: 'text.secondary' }}>Gender:</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{about?.gender}</Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  '&:not(:last-of-type)': { mb: 6 }
                }}
              >
                <Icon fontSize='1.25rem' icon={'gis:search-country'} />

                <Typography sx={{ mx: 2, fontWeight: 500, color: 'text.secondary' }}>Nationality:</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{about?.nationality}</Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  '&:not(:last-of-type)': { mb: 6 }
                }}
              >
                <Icon fontSize='1.25rem' icon={'ph:city'} />

                <Typography sx={{ mx: 2, fontWeight: 500, color: 'text.secondary' }}>City:</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{about?.city}</Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  '&:not(:last-of-type)': { mb: 6 }
                }}
              >
                <Icon fontSize='1.25rem' icon={'streamline:street-road'} />

                <Typography sx={{ mx: 2, fontWeight: 500, color: 'text.secondary' }}>Street:</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{about?.street}</Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  '&:not(:last-of-type)': { mb: 6 }
                }}
              >
                <Icon fontSize='1.25rem' icon={'fluent:street-sign-24-regular'} />

                <Typography sx={{ mx: 2, fontWeight: 500, color: 'text.secondary' }}>Street Number:</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{about?.streetNr}</Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  '&:not(:last-of-type)': { mb: 6 }
                }}
              >
                <Icon fontSize='1.25rem' icon={'maki:post-jp'} />

                <Typography sx={{ mx: 2, fontWeight: 500, color: 'text.secondary' }}>Zip Code:</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{about?.zipCode}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      {/* <Grid item xs={12}>
        <Card>
          <CardContent>
            <div>
              <Typography variant='body2' sx={{ mb: 4, color: 'text.disabled', textTransform: 'uppercase' }}>
                Overview
              </Typography>
              {renderList(overview)}
            </div>
          </CardContent>
        </Card>
      </Grid> */}
    </Grid>
  )
}

export default AboutOverivew
