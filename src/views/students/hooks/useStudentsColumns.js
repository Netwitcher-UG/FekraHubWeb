import { useMemo, useState, useCallback, useContext } from 'react'
import Translations from 'src/layouts/components/Translations'
import Chip from '@mui/material/Chip'
import Icon from 'src/@core/components/icon'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { convertDate } from 'src/@core/utils/convert-date'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import { useDispatch } from 'react-redux'
import { updateStudentCourse, deleteStudent, fetchStudents } from 'src/store/apps/students'
import Box from '@mui/material/Box'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'

const useStudentsColumns = ({ courses, selectedCourse, currentPage, pageSize, search = '' }) => {
  const handleAddReportClick = (e, row) => {
    e.stopPropagation()
    handleOpenDrawer(row)
  }

  const [open, setOpen] = useState(false)
  const [drawerData, setDrawerData] = useState(null)
  const [editingCourse, setEditingCourse] = useState(null)
  const [selectedNewCourse, setSelectedNewCourse] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [DeleteName, setDeleteName] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editStudentData, setEditStudentData] = useState(null)
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

  const handleEditCourse = useCallback(
    (e, rowId, currentCourse) => {
      e.stopPropagation()
      setEditingCourse(rowId)
      if (currentCourse) {
        setSelectedNewCourse({
          value: currentCourse.id,
          label: currentCourse.name
        })
      } else {
        setSelectedNewCourse({
          value: null,
          label: t('No Course')
        })
      }
    },
    [t]
  )

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
            courseId: selectedNewCourse.value === null ? null : selectedNewCourse.value,
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

  const handleDeleteClick = useCallback((e, row) => {
    e.stopPropagation()
    setIsDialogOpen(true)
    setSelectedId(row.id)
    setDeleteName(`${row.firstName} ${row.lastName}`)
  }, [])

  const handleEditClick = useCallback((e, row) => {
    e.stopPropagation()
    setEditStudentData(row)
    setIsEditDialogOpen(true)
  }, [])

  const handleCloseEditDialog = useCallback(() => {
    setIsEditDialogOpen(false)
    setEditStudentData(null)
  }, [])

  const handleDelete = useCallback(async () => {
    setIsDeleting(true)
    try {
      const response = await dispatch(deleteStudent(selectedId))
      if (response?.payload?.status === 200 || response?.type?.includes('fulfilled')) {
        toast.success(<Translations text={'Student deleted successfully'} />)
        // Refetch students with current filters
        dispatch(
          fetchStudents({
            search: search,
            course: selectedCourse || '',
            PageSize: pageSize || 20,
            PageNumber: currentPage || 1
          })
        )
        setIsDialogOpen(false)
        setSelectedId(null)
        setDeleteName('')
      } else {
        const errorMessage = response?.payload?.data || 'Something went wrong, please try again!'
        toast.error(
          typeof errorMessage === 'string'
            ? errorMessage
            : errorMessage?.message || errorMessage?.title || 'Failed to delete student'
        )
      }
    } catch (error) {
      toast.error('Error deleting student')
    } finally {
      setIsDeleting(false)
    }
  }, [dispatch, selectedId, search, selectedCourse, currentPage, pageSize])

  const handleCloseDialog = useCallback(() => {
    if (!isDeleting) {
      setIsDialogOpen(false)
      setSelectedId(null)
      setDeleteName('')
    }
  }, [isDeleting])

  const columns = useMemo(
    () => [
      {
        field: 'actions',
        width: 180,
        headerName: <Translations text={'Actions'} />,
        renderCell: ({ row }) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {ability.can('create', 'StudentReport') && (
              <Tooltip title={<Translations text={'Add Report'} />}>
                <IconButton color='success' onClick={e => handleAddReportClick(e, row)}>
                  <Icon icon='tabler:file-plus' fontSize={30} />
                </IconButton>
              </Tooltip>
            )}

            {ability.can('manage', 'Student') && (
              <Tooltip title={<Translations text={'Edit Student'} />}>
                <IconButton onClick={e => handleEditClick(e, row)}>
                  <Icon icon='mdi:pencil' fontSize={20} />
                </IconButton>
              </Tooltip>
            )}
            {ability.can('manage', 'Student') && (
              <Tooltip title={<Translations text={'Delete Student'} />}>
                <IconButton color='error' onClick={e => handleDeleteClick(e, row)}>
                  <Icon icon='mdi:delete-outline' fontSize={20} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
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
                  options={[
                    { value: null, label: t('No Course') },
                    ...(courses?.map(course => ({ value: course.id, label: course.name })) || [])
                  ]}
                  getOptionLabel={option => option.label}
                  value={selectedNewCourse}
                  onChange={handleCourseChange}
                  sx={{ width: '70%', mr: 1 }}
                  renderInput={params => <TextField {...params} size='small' onClick={e => e.stopPropagation()} />}
                />
                <Tooltip title={<Translations text={'Save'} />}>
                  <IconButton color='success' onClick={e => handleSaveCourse(e, row.id)} sx={{ ml: 1 }}>
                    <Icon icon='mdi:check' fontSize={20} />
                  </IconButton>
                </Tooltip>
                <Tooltip title={<Translations text={'Cancel'} />}>
                  <IconButton color='error' onClick={handleCancelCourseEdit}>
                    <Icon icon='mdi:close' fontSize={20} />
                  </IconButton>
                </Tooltip>
              </Box>
            )
          }

          return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              {row.course?.name ? (
                <Chip label={row.course?.name} color={'primary'} sx={{ textTransform: 'capitalize' }} />
              ) : (
                <Typography variant='body2' color={'error'} sx={{ textTransform: 'capitalize' }}>
                  {t('No Course')}
                </Typography>
              )}
              {ability.can('update', 'StudentCourse') && (
                <Tooltip title={<Translations text={'Edit Course'} />}>
                  <IconButton color='secondary' onClick={e => handleEditCourse(e, row.id, row.course)}>
                    <Icon icon='mdi:pencil' fontSize={20} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          )
        }
      },
      {
        width: 200,
        field: 'birthday',
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
      handleAddReportClick,
      handleCourseChange,
      handleDeleteClick,
      handleEditClick,
      t
    ]
  )

  return {
    columns,
    open,
    drawerData,
    handleCloseDrawer,
    isDialogOpen,
    handleCloseDialog,
    handleDelete,
    DeleteName,
    isDeleting,
    isEditDialogOpen,
    handleCloseEditDialog,
    editStudentData
  }
}

export default useStudentsColumns
