import { useMemo, useState, useCallback, useContext } from 'react'
import Translations from 'src/layouts/components/Translations'
import Chip from '@mui/material/Chip'
import Icon from 'src/@core/components/icon'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { convertDate } from 'src/@core/utils/convert-date'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { useDispatch } from 'react-redux'
import { updateStudentCourse } from 'src/store/apps/students'
import Box from '@mui/material/Box'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { useTranslation } from 'react-i18next'

const useStudentsColumns = ({ courses, selectedCourse, currentPage, pageSize }) => {
  // console.log(courses)
  const handleAddReportClick = (e, row) => {
    e.stopPropagation()
    handleOpenDrawer(row)
  }

  const [open, setOpen] = useState(false)
  const [drawerData, setDrawerData] = useState(null)
  const [editingCourse, setEditingCourse] = useState(null)
  const [selectedNewCourse, setSelectedNewCourse] = useState(null)
  const ability = useContext(AbilityContext)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const handleOpenDrawer = useCallback(data => {
    setDrawerData(data)
    setOpen(true)
  }, [])

  const handleCloseDrawer = useCallback(() => {
    setOpen(false)
    setDrawerData(null)
  }, [])

  const handleEditCourse = useCallback((e, rowId, currentCourse) => {
    e.stopPropagation()
    setEditingCourse(rowId)
    if (currentCourse) {
      setSelectedNewCourse({
        value: currentCourse.id,
        label: currentCourse.name
      })
    }
  }, [])

  const handleCourseChange = useCallback((e, newValue) => {
    setSelectedNewCourse(newValue)
  }, [])

  const handleSaveCourse = useCallback(
    (e, studentId) => {
      e.stopPropagation()
      if (selectedNewCourse) {
        dispatch(
          updateStudentCourse({
            studentId,
            courseId: selectedNewCourse.value,
            currentPage,
            pageSize,
            search: '',
            course: selectedCourse
          })
        )
      }
      setEditingCourse(null)
      setSelectedNewCourse(null)
    },
    [dispatch, selectedNewCourse, currentPage, pageSize, selectedCourse]
  )

  const handleCancelCourseEdit = useCallback(e => {
    e.stopPropagation()
    setEditingCourse(null)
    setSelectedNewCourse(null)
  }, [])

  const columns = useMemo(
    () => [
      {
        field: 'addReport',
        width: 100,
        headerName: '',
        renderCell: ({ row }) => (
          <>
            {ability.can('create', 'StudentReport') && (
              <IconButton color='success' onClick={e => handleAddReportClick(e, row)} sx={{ width: '80%' }}>
                <Icon icon='tabler:file-plus' fontSize={30} />
              </IconButton>
            )}
          </>
        ),
        sortable: false
      },
      {
        width: 200,
        headerName: <Translations text={'First Name'} />,
        field: 'firstName'
      },
      {
        width: 200,
        headerName: <Translations text={'Last Name'} />,
        field: 'lastName'
      },
      {
        width: 100,
        headerName: <Translations text={'Gender'} />,
        field: 'gender'
      },
      {
        width: 200,
        headerName: <Translations text={'Nationality'} />,
        field: 'nationality'
      },
      {
        width: 300,
        headerName: <Translations text={'Course'} />,
        field: 'course.name',
        renderCell: ({ row }) => {
          if (editingCourse === row.id) {
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Autocomplete
                  size='small'
                  options={courses?.map(course => ({ value: course.id, label: course.name }))}
                  getOptionLabel={option => option.label}
                  value={selectedNewCourse}
                  onChange={handleCourseChange}
                  sx={{ width: '70%', mr: 1 }}
                  renderInput={params => <TextField {...params} size='small' onClick={e => e.stopPropagation()} />}
                />
                <IconButton color='success' onClick={e => handleSaveCourse(e, row.id)} sx={{ ml: 1 }}>
                  <Icon icon='mdi:check' fontSize={20} />
                </IconButton>
                <IconButton color='error' onClick={handleCancelCourseEdit}>
                  <Icon icon='mdi:close' fontSize={20} />
                </IconButton>
              </Box>
            )
          }

          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {row.course?.name ? (
                <Chip label={row.course?.name} color={'primary'} sx={{ textTransform: 'capitalize' }} />
              ) : (
                <Typography variant='body2' color={'error'} sx={{ textTransform: 'capitalize' }}>
                  {t('No Course')}
                </Typography>
              )}
              {ability.can('update', 'StudentCourse') && (
                <IconButton color='secondary' onClick={e => handleEditCourse(e, row.id, row.course)} sx={{ ml: 2 }}>
                  <Icon icon='mdi:pencil' fontSize={20} />
                </IconButton>
              )}
            </Box>
          )
        }
      },
      {
        width: 200,
        headerName: <Translations text={'BirthDate'} />,
        renderCell: ({ row }) => <div>{convertDate(row.birthday)}</div>
      },
      {
        width: 200,
        headerName: <Translations text={'City'} />,
        field: 'city'
      },
      {
        width: 200,
        headerName: <Translations text={'Street'} />,
        field: 'street'
      },
      {
        width: 200,
        headerName: <Translations text={'Street Num'} />,
        field: 'streetNr'
      },
      {
        width: 200,
        headerName: <Translations text={'Zip Code'} />,
        field: 'zipCode'
      },
      {
        width: 200,
        headerName: <Translations text={'Note'} />,
        field: 'note'
      }
    ],
    [
      ability,
      courses,
      editingCourse,
      selectedNewCourse,
      handleEditCourse,
      handleSaveCourse,
      handleCancelCourseEdit,
      handleAddReportClick
    ]
  )

  return { columns, open, drawerData, handleCloseDrawer }
}

export default useStudentsColumns
