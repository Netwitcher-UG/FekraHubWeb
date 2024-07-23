import { useMemo } from 'react'
import Translations from 'src/layouts/components/Translations'
import { convertDate } from 'src/@core/utils/convert-date'
import { checkCell } from 'src/@core/utils/check-cell'
import Chip from 'src/@core/components/mui/chip'

const useReportsColumns = () => {
  const reportStatus = imporved => {
    if (imporved === null) return <Chip label={<Translations text={'Not approved yet'} />} color='secondary' />
    else if (imporved === false) return <Chip label={<Translations text={'Disapproved'} />} color='error' />
    else if (imporved === true) return <Chip label={<Translations text={'Approved'} />} color='success' />
  }

  const columns = useMemo(
    () => [
      {
        width: 200,
        headerName: <Translations text={'Creation Date'} />,
        field: 'creationDate',
        renderCell: ({ row }) => checkCell(convertDate(row.creationDate))
      },
      {
        width: 200,
        headerName: <Translations text={'Student Fullname'} />,
        field: 'fullname',
        renderCell: ({ row }) => (
          <>
            {row.student.firstName} {row.student.lastName}
          </>
        )
      },
      {
        width: 120,
        headerName: <Translations text={'BirthDate'} />,
        field: 'birthday',
        renderCell: ({ row }) => checkCell(convertDate(row.student.birthday))
      },
      {
        width: 200,
        headerName: <Translations text={'Report Status'} />,
        field: 'status',
        renderCell: ({ row }) => <>{reportStatus(row?.improved)}</>
      },
      {
        width: 200,
        headerName: <Translations text={'Nationality'} />,
        field: 'nationality',
        renderCell: ({ row }) => checkCell(row.student.nationality)
      },
      {
        width: 200,
        headerName: <Translations text={'Course'} />,
        field: 'course',
        renderCell: ({ row }) => (
          <Chip label={checkCell(row.student?.course?.name)} color={'primary'} sx={{ textTransform: 'capitalize' }} />
        )
      },
      {
        width: 200,
        headerName: <Translations text={'Teacher Fullname'} />,
        field: 'teacherFullName',
        renderCell: ({ row }) => (
          <>
            {row.teacherFirstName} {row.teacherLastName}
          </>
        )
      },
      {
        width: 200,
        headerName: <Translations text={'Teacher Email'} />,
        field: 'teacherEmail',
        renderCell: ({ row }) => checkCell(row.teacherEmail)
      }
    ],
    []
  )

  return columns
}

export default useReportsColumns
