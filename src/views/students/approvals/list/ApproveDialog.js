import { useState } from 'react'
import { useDispatch } from 'react-redux'
import Dialog from '@mui/material/Dialog'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import CourseCard from 'src/views/children/add/course-card'
import { useTranslation } from 'react-i18next'
import { approveStudent, fetchStudentsApprovals } from 'src/store/apps/students'
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

const ApproveDialog = ({ open, handleClose, courses, student }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [registrationFee, setRegistrationFee] = useState('')
  const [annualCourseFee, setAnnualCourseFee] = useState('')
  const [selectedCourse, setSelectedCourse] = useState(null)

  const handleSubmit = async () => {
    // Validate required fields
    if (!registrationFee || !annualCourseFee) {
      ShowErrorToast(t('Please fill in both Registration Fee and Annual Course Fee'))
      return
    }

    try {
      const data = {
        studentId: student?.id,
        registrationFee: parseFloat(registrationFee),
        annualCourseFee: parseFloat(annualCourseFee),
        courseId: selectedCourse || null
      }

      await dispatch(approveStudent(data)).unwrap()
      ShowSuccessToast(t('Student approved successfully'))
      handleDialogClose()
      dispatch(fetchStudentsApprovals())
    } catch (error) {
      ShowErrorToast(error?.message || t('Failed to approve student'))
    }
  }

  const isFormValid = registrationFee && annualCourseFee

  const handleDialogClose = () => {
    setRegistrationFee('')
    setAnnualCourseFee('')
    setSelectedCourse(null)
    handleClose()
  }

  return (
    <Dialog
      maxWidth={'lg'}
      open={open}
      onClose={handleDialogClose}
      fullWidth
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogTitle sx={{ p: 4 }}>
        <Typography variant='h4' sx={{ fontWeight: '900' }}>
          {t('Approve Student')}
        </Typography>
        <CustomCloseButton aria-label='close' onClick={handleDialogClose}>
          <Icon icon='tabler:x' fontSize='1.25rem' />
        </CustomCloseButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: theme => `${theme.spacing(4)} !important`, border: 'none' }}>
        <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {/* Registration Fee */}
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              type='number'
              label={t('Registration Fee')}
              value={registrationFee}
              onChange={e => setRegistrationFee(e.target.value)}
              required
            />
          </Grid>

          {/* Annual Course Fee */}
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              type='number'
              label={t('Annual Course Fee')}
              value={annualCourseFee}
              onChange={e => setAnnualCourseFee(e.target.value)}
              required
            />
          </Grid>

          {/* Course Selection */}
          <Grid item xs={12}>
            <Typography variant='h6' sx={{ mb: 2 }}>
              {t('Select Course')}
            </Typography>
            {courses && courses.length > 0 ? (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: 2,
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}
              >
                {courses.map(course => (
                  <Box key={course.id}>
                    <CourseCard course={course} selectedCourse={selectedCourse} setSelectedCourse={setSelectedCourse} />
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant='body2' color='text.secondary'>
                {t('No courses available')}
              </Typography>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: theme => `${theme.spacing(4)} !important` }}>
        <Button onClick={handleDialogClose} color='secondary' variant='outlined'>
          {t('Cancel')}
        </Button>
        <Button onClick={handleSubmit} color='primary' variant='contained' disabled={!isFormValid}>
          {t('Submit')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ApproveDialog
