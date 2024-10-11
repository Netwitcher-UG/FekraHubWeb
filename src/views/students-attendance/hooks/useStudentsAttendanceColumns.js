import { useMemo, useState, useCallback, useContext, useEffect } from 'react'
import Translations from 'src/layouts/components/Translations'
import Chip from '@mui/material/Chip'
import { fetchAttendanceStatuses } from 'src/store/apps/attendance'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { convertDate } from 'src/@core/utils/convert-date'
import MenuItem from '@mui/material/MenuItem'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

const useStudentAttendanceColumns = students => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { attendanceStatuses } = useSelector(state => state.attendance)

  const [attendanceData, setAttendanceData] = useState([])
  const ability = useContext(AbilityContext)

  useEffect(() => {
    dispatch(fetchAttendanceStatuses())
  }, [dispatch])

  // Set default attendance to "Present" for all students
  useEffect(() => {
    // console.log(students)
    if (attendanceStatuses?.length && students?.length) {
      const presentStatusId = attendanceStatuses.find(status => status.title === 'Present')?.id || ''

      const initialAttendance = students.map(student => ({
        studentID: student.id,
        statusID: presentStatusId
      }))

      setAttendanceData(initialAttendance)
    }
  }, [attendanceStatuses, students])

  const handleStatusChange = (studentId, statusId) => {
    setAttendanceData(prevData => {
      if (statusId === '') {
        // Remove the student from attendanceData if "present" (empty value) is selected
        return prevData.filter(entry => entry.studentID !== studentId)
      } else {
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
        field: 'attendance',
        align: 'center',
        headerAlign: 'center',
        renderCell: ({ row }) => {
          const presentStatusId = attendanceStatuses?.find(status => status.title === 'Present')?.id || ''

          return (
            <>
              {!row?.course?.courseAttendance && ability.can('create', 'StudentAttendance') ? (
                <CustomTextField
                  select
                  fullWidth
                  id='attendance-status-select'
                  aria-describedby='attendance-status-select'
                  defaultValue={presentStatusId}
                  SelectProps={{
                    onChange: e => handleStatusChange(row.id, e.target.value),
                    displayEmpty: true
                  }}
                >
                  {attendanceStatuses?.map(status => (
                    <MenuItem key={status.id} value={status.id}>
                      <Chip label={t(status.title)} color={status.title === 'Absent' ? 'error' : 'info'} />
                    </MenuItem>
                  ))}
                </CustomTextField>
              ) : row.studentAttendance == null ? (
                <Chip label={t('present')} color={'info'} />
              ) : (
                <Chip label={t(row.studentAttendance)} color={row.studentAttendance === 'Absent' ? 'error' : 'info'} />
              )}
            </>
          )
        }
      }
    ],
    [attendanceStatuses, ability, t, handleStatusChange]
  )

  return { columns, attendanceData, setAttendanceData }
}

export default useStudentAttendanceColumns
