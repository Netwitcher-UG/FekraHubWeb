// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { useContext } from 'react'
import { convertDate } from 'src/@core/utils/convert-date'
import { IconButton } from '@mui/material'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Translations from 'src/layouts/components/Translations'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const AboutOverview = props => {
  const { about, setEditDrawerOpen, parentCard = false, byParent } = props
  const ability = useContext(AbilityContext)
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ mb: 6 }}>
              <Grid sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
                <Typography variant='body2' sx={{ color: 'primary.main', textTransform: 'uppercase' }}>
                  <Translations text={parentCard ? 'Parent Info' : byParent ? 'About' : 'About Student'} />
                </Typography>
                {ability.can('manage', 'Children') && (
                  <IconButton onClick={() => setEditDrawerOpen(true)}>
                    <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'>
                      <path
                        fill='currentColor'
                        d='M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z'
                      ></path>
                    </svg>
                  </IconButton>
                )}
              </Grid>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  '&:not(:last-of-type)': { mb: 6 }
                }}
              >
                <Icon fontSize='1.25rem' icon={'tabler:user'} />
                <Typography sx={{ mx: 2, fontWeight: 500, color: 'text.secondary' }}>
                  <Translations text={'Full Name:'} />
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  {about?.firstName} {about?.lastName}
                </Typography>
              </Box>
              {parentCard && (
                <>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      '&:not(:last-of-type)': { mb: 6 }
                    }}
                  >
                    <Icon fontSize='1.25rem' icon={'ic:outline-email'} />
                    <Typography sx={{ mx: 2, fontWeight: 500, color: 'text.secondary' }}>
                      <Translations text={'Email'} />:
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{about?.email}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      '&:not(:last-of-type)': { mb: 6 }
                    }}
                  >
                    <Icon fontSize='1.25rem' icon={'ic:outline-phone'} />
                    <Typography sx={{ mx: 2, fontWeight: 500, color: 'text.secondary' }}>
                      <Translations text={'Phone Number:'} />
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{about?.phoneNumber}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      '&:not(:last-of-type)': { mb: 6 }
                    }}
                  >
                    <Icon fontSize='1.25rem' icon={'material-symbols:e911-emergency-outline'} />
                    <Typography sx={{ mx: 2, fontWeight: 500, color: 'text.secondary' }}>
                      <Translations text={'Emergency Number:'} />
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{about?.emergencyPhoneNumber}</Typography>
                  </Box>
                </>
              )}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  '&:not(:last-of-type)': { mb: 6 }
                }}
              >
                <Icon fontSize='1.25rem' icon={'uiw:date'} />
                <Typography sx={{ mx: 2, fontWeight: 500, color: 'text.secondary' }}>
                  <Translations text={'Birth Date:'} />
                </Typography>
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
                <Typography sx={{ mx: 2, fontWeight: 500, color: 'text.secondary' }}>
                  <Translations text={'Gender'} />:
                </Typography>
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
                <Typography sx={{ mx: 2, fontWeight: 500, color: 'text.secondary' }}>
                  <Translations text={'Nationality'} />:
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>{about?.nationality}</Typography>
              </Box>
              {parentCard && (
                <>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      '&:not(:last-of-type)': { mb: 6 }
                    }}
                  >
                    <Icon fontSize='1.25rem' icon={'material-symbols:work-outline'} />
                    <Typography sx={{ mx: 2, fontWeight: 500, color: 'text.secondary' }}>
                      <Translations text={'Job'} />:
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{about?.job}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      '&:not(:last-of-type)': { mb: 6 }
                    }}
                  >
                    <Icon fontSize='1.25rem' icon={'wpf:diploma-1'} />
                    <Typography sx={{ mx: 2, fontWeight: 500, color: 'text.secondary' }}>
                      <Translations text={'University degree:'} />
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{about?.graduation}</Typography>
                  </Box>
                </>
              )}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  '&:not(:last-of-type)': { mb: 6 }
                }}
              >
                <Icon fontSize='1.25rem' icon={'streamline:street-road'} />
                <Typography sx={{ mx: 2, fontWeight: 500, color: 'text.secondary' }}>
                  <Translations text={'Street'} />:
                </Typography>
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
                <Typography sx={{ mx: 2, fontWeight: 500, color: 'text.secondary' }}>
                  <Translations text={'Street Number:'} />
                </Typography>
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
                <Typography sx={{ mx: 2, fontWeight: 500, color: 'text.secondary' }}>
                  <Translations text={'Zip Code:'} />
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>{about?.zipCode}</Typography>
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
                  <Translations text={'City'} />:
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>{about?.city}</Typography>
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
                <Translations text={'Overview'} />
              </Typography>
              {renderList(overview)}
            </div>
          </CardContent>
        </Card>
      </Grid> */}
    </Grid>
  )
}

export default AboutOverview
