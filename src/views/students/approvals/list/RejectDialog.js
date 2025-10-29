import { useState } from 'react'
import { useDispatch } from 'react-redux'
import Dialog from '@mui/material/Dialog'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useTranslation } from 'react-i18next'
import { rejectStudent, fetchStudentsApprovals } from 'src/store/apps/students'
import { ShowSuccessToast } from 'src/@core/utils/ShowSuccesToast'
import { ShowErrorToast } from 'src/@core/utils/showErrorToast'

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

const RejectDialog = ({ open, handleClose, student }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [reason, setReason] = useState('')

  const handleSubmit = async () => {
    try {
      const data = {
        studentId: student?.id,
        reason: reason.trim()
      }

      await dispatch(rejectStudent(data)).unwrap()
      ShowSuccessToast(t('Student rejected successfully'))
      handleDialogClose()
      dispatch(fetchStudentsApprovals())
    } catch (error) {
      ShowErrorToast(error?.message || t('Failed to reject student'))
    }
  }

  const handleDialogClose = () => {
    setReason('')
    handleClose()
  }

  //   const isFormValid = reason.trim().length > 0

  return (
    <Dialog
      maxWidth={'sm'}
      open={open}
      onClose={handleDialogClose}
      fullWidth
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogTitle sx={{ p: 4 }}>
        <Typography variant='h4' sx={{ fontWeight: '900' }}>
          {t('Reject Student')}
        </Typography>
        <CustomCloseButton aria-label='close' onClick={handleDialogClose}>
          <Icon icon='tabler:x' fontSize='1.25rem' />
        </CustomCloseButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: theme => `${theme.spacing(4)} !important`, border: 'none' }}>
        <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {/* Rejection Reason */}
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              multiline
              rows={4}
              label={t('Reason')}
              value={reason}
              onChange={e => setReason(e.target.value)}
              required
              placeholder={t('Please provide a reason for rejecting this student')}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: theme => `${theme.spacing(4)} !important` }}>
        <Button onClick={handleDialogClose} color='secondary' variant='outlined'>
          {t('Cancel')}
        </Button>
        <Button onClick={handleSubmit} color='error' variant='contained'>
          {t('Reject')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RejectDialog
