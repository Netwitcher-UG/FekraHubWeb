import { Fragment } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import Icon from 'src/@core/components/icon'
import { useTranslation } from 'react-i18next'

const CustomCloseButton = styled(IconButton)(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))

const InfoRow = ({ label, value, fullWidth = false }) => {
  return (
    <Grid item xs={12} sm={fullWidth ? 12 : 6}>
      <Box sx={{ mb: 2 }}>
        <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.secondary', mb: 0.5 }}>
          {label}
        </Typography>
        <Typography variant='body1' sx={{ color: 'text.primary' }}>
          {value || '—'}
        </Typography>
      </Box>
    </Grid>
  )
}

const MailDetailsDialog = ({ open, handleClose, mail }) => {
  // ** Hook
  const { t } = useTranslation()

  if (!mail) return null

  const formatDate = dateString => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <Fragment>
      <Dialog
        maxWidth={'md'}
        open={open}
        onClose={handleClose}
        fullWidth
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogTitle sx={{ p: 4 }}>
          <Typography variant='h4' sx={{ fontWeight: '900' }}>
            {t('Message Details')}
          </Typography>
          <CustomCloseButton aria-label='close' onClick={handleClose}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: theme => `${theme.spacing(4)} !important`, border: 'none' }}>
          <Grid container spacing={3}>
            {/* Message Information Section */}
            <Grid item xs={12}>
              <Typography variant='h5' sx={{ fontWeight: 700, mb: 3, color: 'primary.main' }}>
                {t('Message Information')}
              </Typography>
            </Grid>
            <InfoRow label={t('Subject')} value={mail.subject} />
            <InfoRow label={t('Date')} value={formatDate(mail.date)} />

            {/* Message Content */}
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.secondary', mb: 0.5 }}>
                  {t('Message')}
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    backgroundColor: 'action.hover',
                    border: theme => `1px solid ${theme.palette.divider}`,
                    minHeight: '100px'
                  }}
                >
                  <Typography variant='body1' sx={{ color: 'text.primary' }} component='div'>
                    <div dangerouslySetInnerHTML={{ __html: mail.message }} />
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Recipients Section */}
            {mail.user && mail.user.length > 0 && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='h5' sx={{ fontWeight: 700, mb: 3, color: 'primary.main' }}>
                    {t('Internal Recipients')}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {mail.user.map((user, index) => (
                      <Box
                        key={user.id || index}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          p: 2,
                          borderRadius: 1,
                          backgroundColor: 'action.hover',
                          border: theme => `1px solid ${theme.palette.divider}`,
                          minWidth: '200px'
                        }}
                      >
                        <Avatar sx={{ mr: 2, width: 40, height: 40 }} alt={`${user.firstName} ${user.lastName}`}>
                          {user.firstName?.[0] || 'U'}
                        </Avatar>
                        <Box>
                          <Typography variant='body1' sx={{ fontWeight: 600 }}>
                            {user.firstName} {user.lastName}
                          </Typography>
                          <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </>
            )}

            {/* External Emails Section */}
            {mail.externalEmails && mail.externalEmails.length > 0 && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='h5' sx={{ fontWeight: 700, mb: 3, color: 'primary.main' }}>
                    {t('External Recipients')}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                    {mail.externalEmails.map((email, index) => (
                      <Chip
                        key={index}
                        label={email.email || email}
                        sx={{ fontSize: '0.875rem' }}
                        color='secondary'
                        variant='outlined'
                      />
                    ))}
                  </Box>
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: theme => `${theme.spacing(4)} !important` }}>
          <Button onClick={handleClose} color='secondary' variant='outlined'>
            {t('Close')}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default MailDetailsDialog
