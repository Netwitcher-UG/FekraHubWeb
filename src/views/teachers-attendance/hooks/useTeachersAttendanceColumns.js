import { useMemo, useEffect, useState, useContext, useCallback } from 'react'
import Translations from 'src/layouts/components/Translations'
import { convertDate } from 'src/@core/utils/convert-date'
import { editTeacherAttendance, deleteTeacherAttendanceRecord } from 'src/store/apps/attendance'
import { checkCell } from 'src/@core/utils/check-cell'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Chip from '@mui/material/Chip'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import { Stack } from '@mui/system'
import MenuItem from '@mui/material/MenuItem'
import CustomTextField from 'src/@core/components/mui/text-field'
import { IconButton, Typography, Tooltip } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

const useTeachersAttendanceColumns = () => {
  const dispatch = useDispatch()
  const { t, i18n } = useTranslation()
  const ability = useContext(AbilityContext)
  const { attendanceStatuses } = useSelector(state => state.attendance)

  const [isEditEnabled, setIsEditEnabled] = useState(null)
  const [newStatus, setNewStatus] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [DeleteName, setDeleteName] = useState(null)
  const [selectedId, setSelectedId] = useState(null)

  const handleConfirmEdit = useCallback(
    (rowId, currentStatus, teacherId) => {
      if (newStatus && currentStatus !== newStatus) {
        dispatch(editTeacherAttendance({ id: rowId, statusId: newStatus, teacherId: teacherId }))
      }
      setIsEditEnabled(null)
    },
    [newStatus, dispatch]
  )

  const handleDeleteClick = useCallback(params => {
    setIsDialogOpen(true)
    setSelectedId({ id: params.id, selectedId: params.teacher.id })
    setDeleteName(convertDate(params.date))
  }, [])

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
  }

  const handleDelete = async () => {
    const response = await dispatch(
      deleteTeacherAttendanceRecord({ id: selectedId.id, teacherId: selectedId.selectedId })
    )
    if (response?.payload?.status !== 200) toast.error(response?.payload?.data)
    setIsDialogOpen(false)
  }

  const columns = useMemo(() => {
    const cols = []

    // Conditionally add the actions column first based on user's ability
    if (ability.can('update', 'TeacherAttendance')) {
      cols.push({
        width: 200,
        field: 'action',
        headerName: <Translations text={'Actions'} />,
        renderCell: params => {
          return (
            <Stack direction={'row'} alignItems={'center'}>
              {isEditEnabled !== params.row.id ? (
                <Tooltip title={<Translations text={'Edit Attendance'} />}>
                  <IconButton onClick={() => setIsEditEnabled(params.row.id)}>
                    <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'>
                      <path
                        fill='currentColor'
                        d='M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z'
                      ></path>
                    </svg>
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title={<Translations text={'Save'} />}>
                  <IconButton
                    color='success'
                    onClick={() =>
                      handleConfirmEdit(params.row.id, params.row.attendanceStatus?.id, params.row.teacher.id)
                    }
                  >
                    <Icon icon='subway:tick' fontSize={20} />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title={<Translations text={'Delete Attendance'} />}>
                <IconButton color='error' onClick={() => handleDeleteClick(params.row)}>
                  <Icon icon='mdi:delete-outline' fontSize={25} />
                </IconButton>
              </Tooltip>
            </Stack>
          )
        }
      })
    }

    // Add other columns
    cols.push(
      {
        flex: 0.15,
        minWidth: 120,
        headerName: <Translations text={'Date'} />,
        field: 'date',
        renderCell: ({ row }) => checkCell(convertDate(row.date))
      },
      {
        width: 200,
        headerName: <Translations text={'Course'} />,
        field: 'course.name',
        renderCell: ({ row }) => <Chip label={row.course.name} color={'primary'} sx={{ textTransform: 'capitalize' }} />
      },
      {
        flex: 0.15,
        minWidth: 120,
        headerName: <Translations text={'Attendance Status'} />,
        field: 'attendanceStatus',
        renderCell: ({ row }) => (
          <>
            {isEditEnabled === row.id && ability.can('update', 'TeacherAttendance') ? (
              <CustomTextField
                select
                fullWidth
                id='attendance-status-select'
                aria-describedby='attendance-status-select'
                defaultValue={row.attendanceStatus?.id || ''}
                SelectProps={{
                  onChange: e => setNewStatus(e.target.value),
                  displayEmpty: true
                }}
              >
                {attendanceStatuses?.map(status => (
                  <MenuItem key={status.id} value={status.id}>
                    <Chip label={t(status.title)} color={status.title === 'Absent' ? 'error' : 'success'} />
                  </MenuItem>
                ))}
              </CustomTextField>
            ) : (
              <Chip
                label={t(row.attendanceStatus?.title)}
                color={row.attendanceStatus?.title === 'Absent' ? 'error' : 'success'}
              />
            )}
          </>
        )
      }
    )

    return cols
  }, [attendanceStatuses, isEditEnabled, newStatus, ability, i18n.language, handleConfirmEdit, handleDeleteClick])

  return { columns, DeleteName, isDialogOpen, handleCloseDialog, handleDelete, attendanceStatuses }
}

export default useTeachersAttendanceColumns
