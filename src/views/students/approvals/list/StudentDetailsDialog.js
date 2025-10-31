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
import { styled } from '@mui/material/styles'
import Icon from 'src/@core/components/icon'
import Translations from 'src/layouts/components/Translations'
import { convertDate } from 'src/@core/utils/convert-date'

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

const StudentDetailsDialog = ({ open, handleClose, student }) => {
  if (!student) return null

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
            <Translations text={'Student Details'} />
          </Typography>
          <CustomCloseButton aria-label='close' onClick={handleClose}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: theme => `${theme.spacing(4)} !important`, border: 'none' }}>
          <Grid container spacing={3}>
            {/* Student Information Section */}
            <Grid item xs={12}>
              <Typography variant='h5' sx={{ fontWeight: 700, mb: 3, color: 'primary.main' }}>
                <Translations text={'Student Information'} />
              </Typography>
            </Grid>

            <InfoRow label={<Translations text={'First Name'} />} value={student.firstName} />
            <InfoRow label={<Translations text={'Last Name'} />} value={student.lastName} />
            <InfoRow label={<Translations text={'Gender'} />} value={student.gender} />
            <InfoRow label={<Translations text={'Birthday'} />} value={convertDate(student.birthday)} />
            <InfoRow label={<Translations text={'Nationality'} />} value={student.nationality} />
            <InfoRow label={<Translations text={'City'} />} value={student.city} />
            <InfoRow label={<Translations text={'Street'} />} value={student.street} />
            <InfoRow label={<Translations text={'Street Number'} />} value={student.streetNr} />
            <InfoRow label={<Translations text={'Zip Code'} />} value={student.zipCode} />
            <InfoRow label={<Translations text={'Note'} />} value={student.note} fullWidth={true} />

            {/* Parent Information Section */}
            {student.parent && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='h5' sx={{ fontWeight: 700, mb: 3, color: 'primary.main' }}>
                    <Translations text={'Parent Information'} />
                  </Typography>
                </Grid>

                <InfoRow label={<Translations text={'First Name'} />} value={student.parent.firstName} />
                <InfoRow label={<Translations text={'Last Name'} />} value={student.parent.lastName} />
                <InfoRow label={<Translations text={'Email'} />} value={student.parent.email} />
                <InfoRow label={<Translations text={'Phone Number'} />} value={student.parent.phoneNumber} />
                <InfoRow
                  label={<Translations text={'Emergency Phone Number'} />}
                  value={student.parent.emergencyPhoneNumber}
                />
                <InfoRow label={<Translations text={'Street'} />} value={student.parent.street} />
                <InfoRow label={<Translations text={'Street Number'} />} value={student.parent.streetNr} />
                <InfoRow label={<Translations text={'Zip Code'} />} value={student.parent.zipCode} />
                <InfoRow label={<Translations text={'City'} />} value={student.parent.city} />
                <InfoRow label={<Translations text={'Nationality'} />} value={student.parent.nationality} />
                <InfoRow label={<Translations text={'Birthplace'} />} value={student.parent.birthplace} />
                <InfoRow label={<Translations text={'Birthday'} />} value={convertDate(student.parent.birthday)} />
                <InfoRow label={<Translations text={'Gender'} />} value={student.parent.gender} />
                <InfoRow label={<Translations text={'Job'} />} value={student.parent.job} />
                <InfoRow label={<Translations text={'Graduation'} />} value={student.parent.graduation} />
              </>
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: theme => `${theme.spacing(4)} !important` }}>
          <Button onClick={handleClose} color='secondary' variant='outlined'>
            <Translations text={'Close'} />
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default StudentDetailsDialog
