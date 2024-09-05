import { useMemo, useState, useCallback, useContext, useEffect } from 'react'
import Translations from 'src/layouts/components/Translations'
import Chip from '@mui/material/Chip'
// import Icon from 'src/@core/components/icon'
import { fetchAttendanceStatuses } from 'src/store/apps/attendance'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { convertDate } from 'src/@core/utils/convert-date'
// import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

const useStudentAttendanceColumns = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { attendanceStatuses } = useSelector(state => state.attendance)

  useEffect(() => {
    dispatch(fetchAttendanceStatuses())
  }, [dispatch])

  const [attendanceData, setAttendanceData] = useState([])
  const ability = useContext(AbilityContext)

  const handleStatusChange = (studentId, statusId) => {
    setAttendanceData(prevData => {
      if (statusId === '') {
        // If the "present" option is selected (empty value), remove the student from the attendanceData
        return prevData.filter(entry => entry.studentID !== studentId)
      } else {
        // Check if the student already has a status recorded
        const existingEntry = prevData.find(entry => entry.studentID === studentId)

        if (existingEntry) {
          // Update the existing entry
          return prevData.map(entry => (entry.studentID === studentId ? { ...entry, statusID: statusId } : entry))
        } else {
          // Add a new entry
          return [...prevData, { studentID: studentId, statusID: statusId }]
        }
      }
    })
  }

  const columns = useMemo(
    () => [
      {
        width: 300,
        headerName: <Translations text={'Full Name'} />,
        field: 'FullName',
        renderCell: ({ row }) => (
          <div>
            {row.firstName} {row.lastName}
          </div>
        )
      },
      {
        width: 100,
        headerName: <Translations text={'Gender'} />,
        field: 'gender'
      },
      {
        width: 200,
        headerName: <Translations text={'BirthDate'} />,
        renderCell: ({ row }) => <div>{convertDate(row.birthday)}</div>
      },
      {
        width: 200,
        headerName: <Translations text={'Course'} />,
        field: 'course.name',
        renderCell: ({ row }) => <Chip label={row.course.name} color={'primary'} sx={{ textTransform: 'capitalize' }} />
      },
      {
        width: 400,
        headerName: <Translations text={`Today's attendance`} />,
        field: `attendance`,
        align: 'center',
        headerAlign: 'center',
        renderCell: ({ row }) => (
          <>
            {!row?.course?.courseAttendance && ability.can('create', 'StudentAttendance') ? (
              <CustomTextField
                select
                fullWidth
                id='attendance-status-select'
                aria-describedby='attendance-status-select'
                defaultValue=''
                SelectProps={{
                  onChange: e => handleStatusChange(row.id, e.target.value),
                  displayEmpty: true
                }}
              >
                <MenuItem value=''>
                  <Chip label={t('present')} color={'info'} />
                </MenuItem>
                {attendanceStatuses?.map(status => (
                  <MenuItem key={status.id} value={status.id}>
                    <Chip label={t(status.title)} color={status.title === 'Absent' ? 'error' : 'warning'} />
                  </MenuItem>
                ))}
              </CustomTextField>
            ) : row.studentAttendance == null ? (
              <Chip label={t('present')} color={'info'} />
            ) : (
              <Chip label={t(row.studentAttendance)} color={row.studentAttendance === 'Absent' ? 'error' : 'warning'} />
            )}
          </>
        )
      }
    ],
    [attendanceStatuses]
  )

  return { columns, attendanceData, setAttendanceData }
}

export default useStudentAttendanceColumns
