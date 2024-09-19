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

const CoursesOverview = props => {
  const { about, count } = props

  return (
    <Grid container spacing={6}>
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
                <Translations text={`Course ${count}`} />
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
                <Typography sx={{ color: 'text.secondary' }}>{about?.name}</Typography>
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
                <Typography sx={{ color: 'text.secondary' }}>{convertDate(about?.startDate)}</Typography>
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
                <Typography sx={{ color: 'text.secondary' }}>{convertDate(about?.endDate)}</Typography>
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
                <Typography sx={{ color: 'text.secondary' }}>{about?.capacity}</Typography>
              </Box>
              {/* <Box
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
                <Typography sx={{ color: 'text.secondary' }}>{about?.price} €</Typography>
              </Box> */}
            </Box>
            {about?.anotherTeachers?.length > 0 && (
              <Box
              // sx={{
              //   display: 'flex',
              //   alignItems: 'center',
              //   '&:not(:last-of-type)': { mb: 6 }
              // }}
              >
                <Typography variant='body2' sx={{ mb: 6, color: 'primary.main', width: '100%', mt: 4 }}>
                  <Translations text='Other teachers in course' />
                </Typography>
                {about?.anotherTeachers?.map((teacher, index) => (
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

            <Box
              sx={{
                mt: 4
              }}
            >
              <Typography variant='body2' sx={{ mb: 6, color: 'primary.main', width: '100%', mt: 4 }}>
                <Translations text='Room and Location' />
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
                <Typography sx={{ color: 'text.secondary' }}>{about?.room?.location?.name}</Typography>
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
                <Typography sx={{ color: 'text.secondary' }}>{about?.room?.location?.street}</Typography>
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
                <Typography sx={{ color: 'text.secondary' }}>{about?.room?.location?.streetNr}</Typography>
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
                <Typography sx={{ color: 'text.secondary' }}>{about?.room?.location?.zipCode}</Typography>
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
                <Typography sx={{ color: 'text.secondary' }}>{about?.room?.location?.city}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default CoursesOverview
