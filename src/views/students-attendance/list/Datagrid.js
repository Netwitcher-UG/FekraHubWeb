import { useState, useEffect } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
// import Typography from '@mui/material/Typography'
import CustomTextField from 'src/@core/components/mui/text-field'
import { DataGrid } from '@mui/x-data-grid'
import { submitCourseAttendance, fetchStudentsWithAttendance } from 'src/store/apps/attendance'
import Button from '@mui/material/Button'
import Translations from 'src/layouts/components/Translations'
import CardHeader from '@mui/material/CardHeader'
import Icon from 'src/@core/components/icon'
import Alert from '@mui/material/Alert'
// import TableHeader from './TableHeader'
import useStudentAttendanceColumns from '../hooks/useStudentsAttendanceColumns'
import { Autocomplete } from '@mui/material'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
const customScrollbarStyles = {
  '& ::-webkit-scrollbar': {
    height: 8
  },
  '& ::-webkit-scrollbar-thumb': {
    backgroundColor: '#888',
    borderRadius: 10,
    '&:hover': {
      backgroundColor: '#555'
    }
  }
}

const StudentsAttendanceDataGrid = ({
  store,
  setValue,
  value,
  handleFilter,
  selectedCourse,
  setSelectedCourse,
  handleRowClick,
  setCurrentPage,
  coursesData
}) => {
  const { t } = useTranslation()
  const handleCourseChange = (event, newValue) => {
    setCurrentPage(1)
    setAttendanceData([])
    setSelectedCourse(newValue ? newValue.value : '')
  }
  const dispatch = useDispatch()
  const handelAttendanceSubmit = async () => {
    const response = await dispatch(submitCourseAttendance({ courseId: selectedCourse, data: attendanceData }))
    if (response?.payload?.status) {
      toast.success(t('Course attendance submitted successfully'))
      dispatch(fetchStudentsWithAttendance({ courseId: selectedCourse }))
    } else {
      toast.error(response?.payload?.data)
    }
  }

  const [courseStatus, setCourseStatus] = useState(true)

  const { columns, attendanceData, setAttendanceData } = useStudentAttendanceColumns()
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1)
      handleFilter(value)
    }, 700)

    return () => clearTimeout(timer)
  }, [value, handleFilter])

  useEffect(() => {
    setCourseStatus(store?.students?.courseAttendance)
  }, [store])

  useEffect(() => {
    // Automatically select the first course when the options are available and no course is selected
    if (!selectedCourse && coursesData?.length > 0) {
      setSelectedCourse(coursesData[0].id)
    }
  }, [coursesData, selectedCourse, setSelectedCourse])

  let isNotSchoolDay =
    store?.students?.isTodayAWorkDay === false &&
    !store?.studentsLoading &&
    Array.isArray(store?.students?.students) &&
    store.students.students.length > 0 &&
    store?.students?.students[0]

  return (
    <>
      <CardHeader title={t('Search Filters')} />
      <CardContent>
        <Grid container spacing={6} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Grid item sm={4} xs={12}>
            <Autocomplete
              options={coursesData?.map(course => ({ value: course.id, label: course.name }))}
              fullWidth
              disableClearable={true}
              id='autocomplete-courseFilter'
              getOptionLabel={option => option.label}
              value={
                selectedCourse
                  ? {
                      value: selectedCourse,
                      label: coursesData?.find(course => course.id === selectedCourse)?.name || ''
                    }
                  : null
              }
              onChange={handleCourseChange}
              renderInput={params => (
                <CustomTextField
                  {...params}
                  fullWidth
                  sx={{ mb: 4 }}
                  placeholder={t('Select course')}
                  label={t('Course filter')}
                  id='validation-billing-select'
                  aria-describedby='validation-billing-select'
                />
              )}
            />
          </Grid>
          {!store?.studentsLoading && (
            <Grid sm={4} xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', height: '2.5rem', mt: 6 }}>
              <Button
                disabled={courseStatus || store?.submitLoading || isNotSchoolDay}
                onClick={() => handelAttendanceSubmit()}
                variant='contained'
              >
                {store?.submitLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  <>
                    <Icon fontSize='1.125rem' icon='mdi:tick' />
                    <Grid sx={{ ml: 2 }}>
                      <Translations text={'Submit course attendance'} />
                    </Grid>
                  </>
                )}
              </Button>
            </Grid>
          )}
        </Grid>
      </CardContent>
      <Divider sx={{ m: '0 !important' }} />
      {isNotSchoolDay ? (
        <Grid item xs={12} sx={{ mt: 16, mb: 16, mx: 4 }}>
          <Alert severity='info'> There is no course today !</Alert>
        </Grid>
      ) : (
        <Box sx={{ height: 'calc(100vh - 250px)' }}>
          {store.studentsLoading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '90%',
                zIndex: 10
              }}
            >
              <CircularProgress size={100} />
            </Box>
          ) : (
            <>
              <DataGrid
                rowHeight={62}
                rows={store?.students?.students || []}
                columns={columns}
                hideFooter={true}
                disableRowSelectionOnClick
                onRowClick={handleRowClick}
                pagination={true}
                sx={{
                  // overflowY: 'scroll',
                  overflowX: 'scroll',
                  ...customScrollbarStyles,
                  fontSize: '1rem'
                }}
              />
            </>
          )}
        </Box>
      )}
    </>
  )
}

export default StudentsAttendanceDataGrid
