import Button from '@mui/material/Button'
import { useMemo, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import MenuItem from '@mui/material/MenuItem'
import { Grid } from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import CustomTextField from 'src/@core/components/mui/text-field'
import { fetchAttendanceMonths, fetchCourseAttendanceReport } from 'src/store/apps/attendance'
import { useTranslation } from 'react-i18next'
import { downloadBase64File } from 'src/@core/utils/download-base64'
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
const getValidationSchema = t =>
  yup.object().shape({
    monthValue: yup.string().required(t('Month is required'))
  })
const MonthlyReportForm = ({ open, setOpen, courseId }) => {
  const { t } = useTranslation()
  const schema = useMemo(() => getValidationSchema(t), [t])
  const handleClose = () => setOpen(false)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchAttendanceMonths(courseId))
  }, [])

  const { courseMonths } = useSelector(state => state.attendance)

  const defaultValues = {
    monthValue: ''
  }

  const {
    control,
    handleSubmit,
    resetField,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onBlur'
  })

  const onSubmit = async data => {
    console.log(data)
    const response = await dispatch(fetchCourseAttendanceReport(`courseId=${courseId}&date=${data?.monthValue}`))
    downloadBase64File(response.payload, `${data?.monthValue}-report.pdf`)

    reset()
    handleClose()
  }

  return (
    <div>
      <Dialog
        maxWidth='sm'
        fullWidth
        open={open}
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogTitle id='customized-dialog-title' sx={{ p: 4 }}>
          <Typography variant='h4' sx={{ fontWeight: '900' }}>
            {t('Generate course monthly report')}
          </Typography>
          <CustomCloseButton aria-label='close' onClick={handleClose}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers sx={{ p: theme => `${theme.spacing(4)} !important`, border: 'none' }}>
            <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={14} sm={14} lg={14}>
                <Controller
                  name='monthValue'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      select
                      fullWidth
                      label={t('Month')}
                      id='attendance-month-select'
                      error={Boolean(errors.monthValue)}
                      helperText={errors.monthValue?.message}
                      aria-describedby='attendance-month-select'
                      SelectProps={{
                        value: value,
                        onChange: e => onChange(e),
                        displayEmpty: true
                      }}
                    >
                      {courseMonths.length > 0 &&
                        courseMonths?.map((month, index) => (
                          <MenuItem key={index} value={month.value}>
                            {month.key}
                          </MenuItem>
                        ))}
                    </CustomTextField>
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: theme => `${theme.spacing(3)} !important` }}>
            <Button type='button' disabled={isSubmitting} variant='outlined' onClick={handleClose}>
              {t('Cancel')}
            </Button>
            <Button disabled={isSubmitting} type='submit' variant='contained'>
              {t('Generate Report')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  )
}

export default MonthlyReportForm
