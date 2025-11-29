// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import { useContext } from 'react'
import { convertDate } from 'src/@core/utils/convert-date'
import { IconButton, Tooltip } from '@mui/material'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Translations from 'src/layouts/components/Translations'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const AboutOverview = props => {
  const { about, setEditDrawerOpen, parentCard = false, byParent } = props
  const ability = useContext(AbilityContext)

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
      <Grid item xs={12}>
        <Card
          sx={{
            background: theme =>
              `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.light}02 100%)`,
            border: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: theme =>
                      `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.info.main})`,
                    boxShadow: theme => `0 4px 16px ${theme.palette.primary.main}30`
                  }}
                >
                  <Icon
                    fontSize='1.75rem'
                    icon={parentCard ? 'tabler:user' : 'mdi:account-school'}
                    style={{ color: 'white' }}
                  />
                </Box>
                <Box>
                  <Typography
                    variant='h6'
                    sx={{ fontWeight: 700, color: 'primary.main', mb: 0.25, fontSize: '1.125rem' }}
                  >
                    <Translations text={parentCard ? 'Parent Info' : byParent ? 'About' : 'About Student'} />
                  </Typography>
                  <Typography variant='body2' sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                    {about?.firstName} {about?.lastName}
                  </Typography>
                </Box>
              </Box>
              {ability.can('manage', 'Children') && (
                <Tooltip title={<Translations text={parentCard ? 'Edit Parent' : 'Edit Student'} />}>
                  <IconButton onClick={() => setEditDrawerOpen(true)} size='small'>
                    <Icon icon='mdi:pencil' fontSize={20} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              {/* Personal Information */}
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
                  <Translations text={'Personal Information'} />
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid item xs={12} sm={6}>
                    <InfoItem
                      icon='tabler:user'
                      label={<Translations text={'Full Name'} />}
                      value={`${about?.firstName || ''} ${about?.lastName || ''}`.trim()}
                      iconColor='primary'
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoItem
                      icon='uiw:date'
                      label={<Translations text={'Birth Date'} />}
                      value={convertDate(about?.birthday)}
                      iconColor='info'
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoItem
                      icon='icons8:gender'
                      label={<Translations text={'Gender'} />}
                      value={
                        about?.gender ? (
                          <Chip
                            label={about.gender}
                            size='small'
                            color='secondary'
                            sx={{ textTransform: 'capitalize' }}
                          />
                        ) : null
                      }
                      iconColor='secondary'
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoItem
                      icon='gis:search-country'
                      label={<Translations text={'Nationality'} />}
                      value={about?.nationality}
                      iconColor='success'
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Contact Information - Only for Parent Card */}
              {parentCard && (
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
                    <Translations text={'Contact Information'} />
                  </Typography>
                  <Grid container spacing={1.5}>
                    <Grid item xs={12} sm={6}>
                      <InfoItem
                        icon='ic:outline-email'
                        label={<Translations text={'Email'} />}
                        value={about?.email}
                        iconColor='primary'
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InfoItem
                        icon='ic:outline-phone'
                        label={<Translations text={'Phone Number'} />}
                        value={about?.phoneNumber}
                        iconColor='info'
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InfoItem
                        icon='material-symbols:e911-emergency-outline'
                        label={<Translations text={'Emergency Number'} />}
                        value={about?.emergencyPhoneNumber}
                        iconColor='warning'
                      />
                    </Grid>
                  </Grid>
                </Grid>
              )}

              {/* Professional Information - Only for Parent Card */}
              {parentCard && (
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
                    <Translations text={'Professional Information'} />
                  </Typography>
                  <Grid container spacing={1.5}>
                    <Grid item xs={12} sm={6}>
                      <InfoItem
                        icon='material-symbols:work-outline'
                        label={<Translations text={'Job'} />}
                        value={about?.job}
                        iconColor='primary'
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InfoItem
                        icon='wpf:diploma-1'
                        label={<Translations text={'University degree'} />}
                        value={about?.graduation}
                        iconColor='success'
                      />
                    </Grid>
                  </Grid>
                </Grid>
              )}

              {/* Address Information */}
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
                  <Translations text={'Address Information'} />
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid item xs={12} sm={6}>
                    <InfoItem
                      icon='streamline:street-road'
                      label={<Translations text={'Street'} />}
                      value={about?.street}
                      iconColor='primary'
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoItem
                      icon='fluent:street-sign-24-regular'
                      label={<Translations text={'Street Number'} />}
                      value={about?.streetNr}
                      iconColor='info'
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoItem
                      icon='maki:post-jp'
                      label={<Translations text={'Zip Code'} />}
                      value={about?.zipCode}
                      iconColor='secondary'
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoItem
                      icon='ph:city'
                      label={<Translations text={'City'} />}
                      value={about?.city}
                      iconColor='success'
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
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
