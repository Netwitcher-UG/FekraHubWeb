import { useMemo, useState, useContext, useCallback } from 'react'
import Translations from 'src/layouts/components/Translations'
import { convertDate } from 'src/@core/utils/convert-date'
import { fetchAttendanceStatuses, editStudentAttendance, deleteAttendanceRecord } from 'src/store/apps/attendance'
import { checkCell } from 'src/@core/utils/check-cell'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Chip from '@mui/material/Chip'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import { Stack } from '@mui/system'
import MenuItem from '@mui/material/MenuItem'
import CustomTextField from 'src/@core/components/mui/text-field'
import { IconButton, Tooltip } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

const useAttendanceColumns = () => {
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
    (rowId, currentStatus, studentId) => {
      if (newStatus && currentStatus !== newStatus) {
        dispatch(editStudentAttendance({ id: rowId, statusId: newStatus, studentId: studentId }))
      }
      setIsEditEnabled(null)
    },
    [newStatus, dispatch]
  )

  const handleDeleteClick = useCallback(params => {
    setIsDialogOpen(true)
    setSelectedId({ id: params.id, selectedId: params.student.id })
    setDeleteName(convertDate(params.date))
  }, [])

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false)
  }, [])

  const handleDelete = useCallback(async () => {
    const response = await dispatch(deleteAttendanceRecord({ id: selectedId.id, studentId: selectedId.selectedId }))
    if (response?.payload?.status !== 200) toast.error(response?.payload?.data)
    setIsDialogOpen(false)
  }, [dispatch, selectedId])

  const columns = useMemo(() => {
    const cols = [
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
            {isEditEnabled === row.id && ability.can('update', 'StudentAttendance') ? (
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
    ]

    // Conditionally add the actions column based on user's ability
    if (ability.can('update', 'StudentAttendance')) {
      cols.push({
        width: 200,
        field: 'action',
        headerName: <Translations text={'Action'} />,
        renderCell: params => {
          return (
            <Stack direction={'row'} alignItems={'center'}>
              {isEditEnabled !== params.row.id ? (
                <Tooltip title={<Translations text={'Edit Attendance'} />}>
                  <IconButton onClick={() => setIsEditEnabled(params.row.id)}>
                    <Icon icon='mdi:pencil' fontSize={20} />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title={<Translations text={'Save'} />}>
                  <IconButton
                    color='success'
                    onClick={() =>
                      handleConfirmEdit(params.row.id, params.row.attendanceStatus?.id, params.row.student.id)
                    }
                  >
                    <Icon icon='mdi:check' fontSize={20} />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          )
        }
      })
    }

    return cols
  }, [attendanceStatuses, isEditEnabled, newStatus, ability, i18n.language, handleConfirmEdit])

  return { columns, DeleteName, isDialogOpen, handleCloseDialog, handleDelete }
}

export default useAttendanceColumns
