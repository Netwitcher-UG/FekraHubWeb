import { useMemo } from 'react'
import Translations from 'src/layouts/components/Translations'
import { convertDate } from 'src/@core/utils/convert-date'
import { checkCell } from 'src/@core/utils/check-cell'

const useStudentReportsColumns = () => {
  const columns = useMemo(
    () => [
      {
        flex: 0.15,
        minWidth: 120,
        headerName: <Translations text={'Creation Date'} />,
        field: 'creationDate',
        renderCell: ({ row }) => checkCell(convertDate(row.creationDate))
      },
      {
        flex: 0.15,
        minWidth: 120,
        headerName: <Translations text={'Teacher first Name'} />,
        field: 'teacherFirstName',
        renderCell: ({ row }) => checkCell(row.teacherFirstName)
      },
      {
        flex: 0.15,
        minWidth: 120,
        headerName: <Translations text={'Teacher Last Name'} />,
        field: 'teacherLastName',
        renderCell: ({ row }) => checkCell(row.teacherLastName)
      },
      {
        flex: 0.15,
        minWidth: 120,
        headerName: <Translations text={'Teacher Email'} />,
        field: 'teacherEmail',
        renderCell: ({ row }) => checkCell(row.teacherEmail)
      }
    ],
    []
  )

  return columns
}

export default useStudentReportsColumns
