// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { convertDate } from 'src/@core/utils/convert-date'
import Translations from 'src/layouts/components/Translations'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const SchoolOverview = props => {
  const { about, showOverView = false } = props

  return (
    <Grid container spacing={6}>
      {!showOverView && (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box
              // sx={{
              //   mb: 6,
              //   display: 'flex',
              //   flexDirection: 'row',
              //   flexWrap: 'wrap',
              //   gap: '1.2rem',
              //   alignItems: 'flex-start'
              // }}
              >
                <Typography
                  variant='body2'
                  sx={{ mb: 6, color: 'primary.main', textTransform: 'uppercase', width: '100%' }}
                >
                  <Translations text='Course' />
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    '&:not(:last-of-type)': { mb: 6 }
                  }}
                >
                  <Icon fontSize='1.25rem' icon={'carbon:course'} />
                  <Typography sx={{ mx: 2, fontWeight: 500, color: 'text.secondary' }}>
                    <Translations text='Course Name' />:
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{about?.course?.name}</Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    '&:not(:last-of-type)': { mb: 6 }
                  }}
                >
                  <Icon fontSize='1.25rem' icon={'uiw:date'} />
                  <Typography sx={{ mx: 2, fontWeight: 500, color: 'text.secondary' }}>
                    <Translations text='Start Date' />:
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{convertDate(about?.course?.startDate)}</Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    '&:not(:last-of-type)': { mb: 6 }
                  }}
                >
                  <Icon fontSize='1.25rem' icon={'uiw:date'} />
                  <Typography sx={{ mx: 2, fontWeight: 500, color: 'text.secondary' }}>
                    <Translations text='End Date' />:
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{convertDate(about?.course?.endDate)}</Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    '&:not(:last-of-type)': { mb: 6 }
                  }}
                >
                  <Icon fontSize='1.25rem' icon={'gravity-ui:persons'} />
                  <Typography sx={{ mx: 2, fontWeight: 500, color: 'text.secondary' }}>
                    <Translations text='Vacancies' />:
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{about?.course?.capacity}</Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    '&:not(:last-of-type)': { mb: 6 }
                  }}
                >
                  <Icon fontSize='1.25rem' icon={'material-symbols:euro'} />
                  <Typography sx={{ mx: 2, fontWeight: 500, color: 'text.secondary' }}>
                    <Translations text='Price' />:
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{about?.course?.price} €</Typography>
                </Box>
              </Box>
              {about?.course?.teacher?.length > 0 && (
                <Box
                // sx={{
                //   display: 'flex',
                //   alignItems: 'center',
                //   '&:not(:last-of-type)': { mb: 6 }
                // }}
                >
                  <Typography
                    variant='body2'
                    sx={{ mb: 6, color: 'primary.main', textTransform: 'uppercase', width: '100%', mt: 4 }}
                  >
                    <Translations text='Teachers' />
                  </Typography>
                  {about?.course?.teacher?.map((teacher, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        '&:not(:last-of-type)': { mb: 6 }
                      }}
                    >
                      <Icon fontSize='1.25rem' icon={'tabler:user'} />
                      <Typography sx={{ color: 'text.secondary', mx: 2, fontWeight: 500 }}>
                        {teacher.firstName} {teacher.lastName}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      )}
      {showOverView && (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box
              // sx={{
              //   mb: 6,
              //   display: 'flex',
              //   flexDirection: 'row',
              //   flexWrap: 'wrap',
              //   gap: '1.2rem',
              //   alignItems: 'flex-start'
              // }}
              >
                <Typography
                  variant='body2'
                  sx={{ mb: 4, color: 'primary.main', textTransform: 'uppercase', width: '100%' }}
                >
                  <Translations text='Room & Location' />
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    '&:not(:last-of-type)': { mb: 6 }
                  }}
                >
                  <Icon fontSize='1.25rem' icon={'ep:map-location'} />
                  <Typography sx={{ mx: 2, fontWeight: 500, color: 'text.secondary' }}>
                    <Translations text='Location Name' />:
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{about?.location?.name}</Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    '&:not(:last-of-type)': { mb: 6 }
                  }}
                >
                  <Icon fontSize='1.25rem' icon={'fluent:conference-room-24-regular'} />
                  <Typography sx={{ mx: 2, fontWeight: 500, color: 'text.secondary' }}>
                    <Translations text='Room Name' />:
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{about?.room?.name}</Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    '&:not(:last-of-type)': { mb: 6 }
                  }}
                >
                  <Icon fontSize='1.25rem' icon={'streamline:street-road'} />
                  <Typography sx={{ mx: 2, fontWeight: 500, color: 'text.secondary' }}>
                    <Translations text='Street' />:
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{about?.location?.street}</Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    '&:not(:last-of-type)': { mb: 6 }
                  }}
                >
                  <Icon fontSize='1.25rem' icon={'fluent:street-sign-24-regular'} />
                  <Typography sx={{ mx: 2, fontWeight: 500, color: 'text.secondary' }}>
                    <Translations text='Street Number' />:
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{about?.location?.streetNr}</Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    '&:not(:last-of-type)': { mb: 6 }
                  }}
                >
                  <Icon fontSize='1.25rem' icon={'maki:post-jp'} />
                  <Typography sx={{ mx: 2, fontWeight: 500, color: 'text.secondary' }}>
                    <Translations text='Zip Code' />:
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{about?.location?.zipCode}</Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    '&:not(:last-of-type)': { mb: 6 }
                  }}
                >
                  <Icon fontSize='1.25rem' icon={'ph:city'} />
                  <Typography sx={{ mx: 2, fontWeight: 500, color: 'text.secondary' }}>
                    <Translations text='City' />:
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{about?.location?.city}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  )
}

export default SchoolOverview
