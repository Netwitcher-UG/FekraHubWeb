import { useState, useEffect } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomDataGrid from 'src/@core/components/custom-grid'
import { submitCourseAttendance, fetchStudentsWithAttendance } from 'src/store/apps/attendance'
import Button from '@mui/material/Button'
import Translations from 'src/layouts/components/Translations'
import Icon from 'src/@core/components/icon'
import Typography from '@mui/material/Typography'
import useStudentAttendanceColumns from '../hooks/useStudentsAttendanceColumns'
import { Autocomplete } from '@mui/material'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import Skeleton from '@mui/material/Skeleton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

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

  const { columns, attendanceData, setAttendanceData } = useStudentAttendanceColumns(store?.students?.students)
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

  let isNotSchoolDay = store?.students?.isTodayAWorkDay === false && !store?.studentsLoading
  //  &&
  // Array.isArray(store?.students?.students) &&
  // store.students.students.length > 0 &&
  // store?.students?.students[0]

  return (
    <>
      <CardContent sx={{ flexShrink: 0, pb: 0 }}>
        <Grid container spacing={6} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Grid item sm={3} xs={12}>
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
      <Divider sx={{ m: '0 !important', flexShrink: 0 }} />
      {isNotSchoolDay ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: 'calc(100vh - 350px)',
            minHeight: 400,
            py: 10,
            px: 4,
            position: 'relative'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 8,
              borderRadius: 4,
              background: theme =>
                `linear-gradient(135deg, ${theme.palette.primary.light}08 0%, ${theme.palette.info.light}12 50%, ${theme.palette.secondary.light}08 100%)`,
              border: theme => `1px solid ${theme.palette.primary.main}12`,
              maxWidth: 520,
              textAlign: 'center',
              boxShadow: theme =>
                `0 2px 12px ${theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.15)' : 'rgba(0, 0, 0, 0.04)'}, 
                 0 1px 4px ${theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.02)'}`,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: theme =>
                  `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.info.main}, ${theme.palette.secondary.main})`,
                opacity: 0.3
              }
            }}
          >
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: theme =>
                  `linear-gradient(135deg, ${theme.palette.primary.main}12, ${theme.palette.info.main}15)`,
                mb: 4,
                boxShadow: theme =>
                  `0 2px 8px ${theme.palette.primary.main}15, inset 0 1px 2px ${theme.palette.common.white}30`,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  inset: -2,
                  borderRadius: '50%',
                  padding: '2px',
                  background: theme =>
                    `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.info.main}20)`,
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  opacity: 0.3
                }
              }}
            >
              <Icon
                icon='mdi:calendar-remove'
                fontSize={48}
                style={{
                  color: 'var(--mui-palette-primary-main)',
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
                }}
              />
            </Box>
            <Typography
              variant='h4'
              sx={{
                fontWeight: 700,
                mb: 2,
                background: theme =>
                  `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.info.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em'
              }}
            >
              {t('No Course Today')}
            </Typography>
            <Typography
              variant='body1'
              sx={{
                color: 'text.secondary',
                maxWidth: 420,
                lineHeight: 1.7,
                fontSize: '1.05rem',
                fontWeight: 400
              }}
            >
              {t('There are no scheduled courses for today')}
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box sx={{ flexShrink: 0, height: 'calc(100vh - 250px)' }}>
          {selectedCourse && store?.students?.students?.length > 0 ? (
            <CustomDataGrid
              rows={store?.students?.students || []}
              columns={columns}
              loading={store.studentsLoading}
              handleRowClick={handleRowClick}
              sx={{
                height: '100%'
              }}
            />
          ) : (
            <Box
              sx={{
                height: '100%',
                overflow: 'auto',
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
              }}
            >
              <TableContainer>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      {columns.map((column, index) => (
                        <TableCell
                          key={column.field || index}
                          sx={{
                            borderRight: '1px solid #ccc',
                            borderBottom: '1px solid #ccc',
                            padding: '16px',
                            height: '62px',
                            '&:last-child': {
                              borderRight: 'none'
                            }
                          }}
                        >
                          <Skeleton variant='text' width={column.width || 150} height={20} />
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array.from({ length: 10 }, (_, index) => (
                      <TableRow key={index} sx={{ height: '62px' }}>
                        {columns.map((column, colIndex) => (
                          <TableCell
                            key={column.field || colIndex}
                            sx={{
                              borderRight: '1px solid #f0f0f0',
                              borderBottom: '1px solid #f0f0f0',
                              padding: '16px',
                              '&:last-child': {
                                borderRight: 'none'
                              }
                            }}
                          >
                            <Skeleton variant='text' width={column.width || 150} height={20} />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Box>
      )}
    </>
  )
}

export default StudentsAttendanceDataGrid
