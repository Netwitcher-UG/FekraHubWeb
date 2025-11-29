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
import { useTranslation } from 'react-i18next'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const CoursesOverview = props => {
  const { about, count } = props
  const { t } = useTranslation()

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
    <Card
      sx={{
        background: theme =>
          `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.success.light}02 100%)`,
        border: theme => `1px solid ${theme.palette.divider}`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CardContent sx={{ p: 4, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: theme => `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.info.main})`,
              boxShadow: theme => `0 4px 16px ${theme.palette.success.main}30`
            }}
          >
            <Icon fontSize='1.75rem' icon='carbon:course' style={{ color: 'white' }} />
          </Box>
          <Box>
            <Typography variant='h6' sx={{ fontWeight: 700, color: 'success.main', mb: 0.25, fontSize: '1.125rem' }}>
              {t(`Course`)} {count}
            </Typography>
            <Typography variant='body2' sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
              {about?.name}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Course Details */}
          <Box>
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
              <Grid item xs={12} md={6}>
                <InfoItem
                  icon='carbon:course'
                  label={<Translations text='Course Name' />}
                  value={about?.name}
                  iconColor='success'
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <InfoItem
                  icon='uiw:date'
                  label={<Translations text='Start Date' />}
                  value={convertDate(about?.startDate)}
                  iconColor='info'
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <InfoItem
                  icon='uiw:date'
                  label={<Translations text='End Date' />}
                  value={convertDate(about?.endDate)}
                  iconColor='info'
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <InfoItem
                  icon='gravity-ui:persons'
                  label={<Translations text='Vacancies' />}
                  value={
                    <Chip
                      label={about?.capacity}
                      size='small'
                      color='primary'
                      icon={<Icon icon='gravity-ui:persons' fontSize={16} />}
                    />
                  }
                  iconColor='primary'
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <InfoItem
                  icon='material-symbols:euro'
                  label={<Translations text='Price' />}
                  value={
                    <Chip
                      label={`${about?.price} €`}
                      size='small'
                      color='success'
                      icon={<Icon icon='material-symbols:euro' fontSize={16} />}
                    />
                  }
                  iconColor='success'
                />
              </Grid>
            </Grid>
          </Box>

          {/* Other Teachers */}
          {about?.anotherTeachers?.length > 0 && (
            <Box>
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
                <Translations text='Other teachers in course' />
              </Typography>
              <Grid container spacing={1.5}>
                {about.anotherTeachers.map((teacher, index) => (
                  <Grid item xs={12} key={index}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 1.5,
                        background: theme =>
                          `linear-gradient(135deg, ${theme.palette.secondary.main}08 0%, ${theme.palette.secondary.light}05 100%)`,
                        border: theme => `1px solid ${theme.palette.secondary.main}15`,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateX(4px)',
                          borderColor: theme => `${theme.palette.secondary.main}30`
                        }
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          mr: 2,
                          background: theme =>
                            `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.light})`
                        }}
                      >
                        <Icon icon='tabler:user' fontSize={18} style={{ color: 'white' }} />
                      </Avatar>
                      <Typography variant='body2' sx={{ color: 'text.primary', fontWeight: 500, fontSize: '0.875rem' }}>
                        {teacher.firstName} {teacher.lastName}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Room and Location */}
          <Box>
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
              <Translations text='Room and Location' />
            </Typography>
            <Grid container spacing={1.5}>
              <Grid item xs={12} sm={6}>
                <InfoItem
                  icon='ep:map-location'
                  label={<Translations text='Location Name' />}
                  value={about?.location?.name}
                  iconColor='warning'
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
                  iconColor='primary'
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoItem
                  icon='fluent:street-sign-24-regular'
                  label={<Translations text='Street Number' />}
                  value={about?.location?.streetNr}
                  iconColor='info'
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoItem
                  icon='maki:post-jp'
                  label={<Translations text='Zip Code' />}
                  value={about?.location?.zipCode}
                  iconColor='secondary'
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoItem
                  icon='ph:city'
                  label={<Translations text='City' />}
                  value={about?.location?.city}
                  iconColor='success'
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default CoursesOverview
