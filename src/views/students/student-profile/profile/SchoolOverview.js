// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import { convertDate } from 'src/@core/utils/convert-date'
import Translations from 'src/layouts/components/Translations'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const SchoolOverview = props => {
  const { about, showOverView = false } = props

  const InfoItem = ({ icon, label, value, iconColor = 'primary' }) => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 2,
        borderRadius: 1.5,
        background: theme =>
          `linear-gradient(135deg, ${theme.palette[iconColor].main}08 0%, ${theme.palette[iconColor].light}05 100%)`,
        border: theme => `1px solid ${theme.palette[iconColor].main}15`,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme => `0 4px 12px ${theme.palette[iconColor].main}20`,
          borderColor: theme => `${theme.palette[iconColor].main}30`
        }
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme =>
            `linear-gradient(135deg, ${theme.palette[iconColor].main}15, ${theme.palette[iconColor].light}20)`,
          mr: 2,
          flexShrink: 0
        }}
      >
        <Icon fontSize='1.25rem' icon={icon} style={{ color: `var(--mui-palette-${iconColor}-main)` }} />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant='caption'
          sx={{
            color: 'text.disabled',
            textTransform: 'uppercase',
            fontSize: '0.7rem',
            fontWeight: 600,
            mb: 0.25,
            display: 'block'
          }}
        >
          {label}
        </Typography>
        <Typography
          variant='body2'
          sx={{ color: 'text.primary', fontWeight: 500, wordBreak: 'break-word', fontSize: '0.875rem' }}
        >
          {value || '—'}
        </Typography>
      </Box>
    </Box>
  )

  return (
    <Grid container spacing={4}>
      {!showOverView && (
        <Grid item xs={12}>
          <Card
            sx={{
              background: theme =>
                `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.success.light}02 100%)`,
              border: theme => `1px solid ${theme.palette.divider}`
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: theme =>
                      `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.info.main})`,
                    boxShadow: theme => `0 4px 16px ${theme.palette.success.main}30`
                  }}
                >
                  <Icon fontSize='1.75rem' icon='carbon:course' style={{ color: 'white' }} />
                </Box>
                <Typography variant='h6' sx={{ fontWeight: 700, color: 'success.main', fontSize: '1.125rem' }}>
                  <Translations text='Course' />
                </Typography>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                {/* Course Details */}
                <Grid item xs={12}>
                  <Typography
                    variant='subtitle2'
                    sx={{
                      color: 'text.secondary',
                      mb: 2,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      fontSize: '0.75rem'
                    }}
                  >
                    <Translations text='Course Details' />
                  </Typography>
                  <Grid container spacing={1.5}>
                    <Grid item xs={12} sm={6}>
                      <InfoItem
                        icon='carbon:course'
                        label={<Translations text='Course Name' />}
                        value={about?.course?.name}
                        iconColor='success'
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InfoItem
                        icon='uiw:date'
                        label={<Translations text='Start Date' />}
                        value={convertDate(about?.course?.startDate)}
                        iconColor='info'
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InfoItem
                        icon='uiw:date'
                        label={<Translations text='End Date' />}
                        value={convertDate(about?.course?.endDate)}
                        iconColor='primary'
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InfoItem
                        icon='gravity-ui:persons'
                        label={<Translations text='Vacancies' />}
                        value={
                          about?.course?.capacity ? (
                            <Chip label={about.course.capacity} size='small' color='warning' />
                          ) : null
                        }
                        iconColor='warning'
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InfoItem
                        icon='material-symbols:euro'
                        label={<Translations text='Price' />}
                        value={
                          about?.course?.price ? (
                            <Chip label={`${about.course.price} €`} size='small' color='secondary' />
                          ) : null
                        }
                        iconColor='secondary'
                      />
                    </Grid>
                  </Grid>
                </Grid>

                {/* Teachers */}
                {about?.course?.teacher?.length > 0 && (
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1.5 }} />
                    <Typography
                      variant='subtitle2'
                      sx={{
                        color: 'text.secondary',
                        mb: 2,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        fontSize: '0.75rem'
                      }}
                    >
                      <Translations text='Teachers' />
                    </Typography>
                    <Grid container spacing={1.5}>
                      {about.course.teacher.map((teacher, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              p: 2,
                              borderRadius: 1.5,
                              background: theme =>
                                `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.primary.light}05 100%)`,
                              border: theme => `1px solid ${theme.palette.primary.main}15`,
                              transition: 'all 0.2s ease-in-out',
                              '&:hover': {
                                transform: 'translateX(4px)',
                                borderColor: theme => `${theme.palette.primary.main}30`
                              }
                            }}
                          >
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                mr: 2,
                                background: theme =>
                                  `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`
                              }}
                            >
                              <Icon icon='tabler:user' fontSize={18} style={{ color: 'white' }} />
                            </Avatar>
                            <Typography
                              variant='body2'
                              sx={{ color: 'text.primary', fontWeight: 500, fontSize: '0.875rem' }}
                            >
                              {teacher.firstName} {teacher.lastName}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      )}
      {showOverView && (
        <Grid item xs={12}>
          <Card
            sx={{
              background: theme =>
                `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.info.light}02 100%)`,
              border: theme => `1px solid ${theme.palette.divider}`
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: theme =>
                      `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.primary.main})`,
                    boxShadow: theme => `0 4px 16px ${theme.palette.info.main}30`
                  }}
                >
                  <Icon fontSize='1.75rem' icon='ep:map-location' style={{ color: 'white' }} />
                </Box>
                <Typography variant='h6' sx={{ fontWeight: 700, color: 'info.main', fontSize: '1.125rem' }}>
                  <Translations text='Room & Location' />
                </Typography>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                {/* Room and Location */}
                <Grid item xs={12}>
                  <Typography
                    variant='subtitle2'
                    sx={{
                      color: 'text.secondary',
                      mb: 2,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      fontSize: '0.75rem'
                    }}
                  >
                    <Translations text='Room and Location' />
                  </Typography>
                  <Grid container spacing={1.5}>
                    <Grid item xs={12} sm={6}>
                      <InfoItem
                        icon='ep:map-location'
                        label={<Translations text='Location Name' />}
                        value={about?.location?.name}
                        iconColor='primary'
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InfoItem
                        icon='fluent:conference-room-24-regular'
                        label={<Translations text='Room Name' />}
                        value={about?.room?.name}
                        iconColor='info'
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InfoItem
                        icon='streamline:street-road'
                        label={<Translations text='Street' />}
                        value={about?.location?.street}
                        iconColor='secondary'
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InfoItem
                        icon='fluent:street-sign-24-regular'
                        label={<Translations text='Street Number' />}
                        value={about?.location?.streetNr}
                        iconColor='success'
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InfoItem
                        icon='maki:post-jp'
                        label={<Translations text='Zip Code' />}
                        value={about?.location?.zipCode}
                        iconColor='warning'
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InfoItem
                        icon='ph:city'
                        label={<Translations text='City' />}
                        value={about?.location?.city}
                        iconColor='primary'
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  )
}

export default SchoolOverview
