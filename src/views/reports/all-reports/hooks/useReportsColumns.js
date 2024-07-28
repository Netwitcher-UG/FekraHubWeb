import { useMemo, useCallback, useState } from 'react'
import Translations from 'src/layouts/components/Translations'
import { convertDate } from 'src/@core/utils/convert-date'
import { checkCell } from 'src/@core/utils/check-cell'
import Chip from 'src/@core/components/mui/chip'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
const useReportsColumns = () => {
  const reportStatus = imporved => {
    if (imporved === null) return <Chip label={<Translations text={'Not approved yet'} />} color='secondary' />
    else if (imporved === false) return <Chip label={<Translations text={'Disapproved'} />} color='error' />
    else if (imporved === true) return <Chip label={<Translations text={'Approved'} />} color='success' />
  }

  const [editDraweropen, setEditDrawerOpen] = useState(false)
  const [editDrawerData, setEditDrawerData] = useState(null)

  const handleEditReportClick = (e, row) => {
    e.stopPropagation()
    handleEditDrawerOpen(row)
  }

  const handleEditDrawerOpen = useCallback(data => {
    setEditDrawerData(data)
    setEditDrawerOpen(true)
  }, [])

  const handleEditDrawerClose = useCallback(() => {
    setEditDrawerOpen(false)
    setEditDrawerData(null)
  }, [])

  const columns = useMemo(
    () => [
      {
        width: 200,
        headerName: <Translations text={'Report Date'} />,
        field: 'reportDate',
        renderCell: ({ row }) => (
          <>
            {row.month} / {row.year}
          </>
        )
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
      },
      {
        width: 200,
        headerName: <Translations text={'Creation Date'} />,
        field: 'creationDate',
        renderCell: ({ row }) => checkCell(convertDate(row.creationDate))
      },
      {
        width: 200,
        field: 'action',
        headerName: <Translations text={'Action'} />,
        renderCell: params => {
          return (
            <Stack direction={'row'} alignItems={'center'}>
              {(params.row.improved == null || params.row.improved == false) && (
                <IconButton onClick={e => handleEditReportClick(e, params.row)}>
                  <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'>
                    <path
                      fill='currentColor'
                      d='M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z'
                    ></path>
                  </svg>
                </IconButton>
              )}
            </Stack>
          )
        }
      }
    ],
    []
  )

  return { columns, editDraweropen, editDrawerData, handleEditDrawerClose, handleEditDrawerOpen }
}

export default useReportsColumns
