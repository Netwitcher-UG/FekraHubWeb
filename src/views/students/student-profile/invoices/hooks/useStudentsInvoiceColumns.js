import { useMemo, useState, useCallback, useContext, useEffect } from 'react'
import Translations from 'src/layouts/components/Translations'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { convertDate } from 'src/@core/utils/convert-date'
import { useDispatch, useSelector } from 'react-redux'
import { IconButton, Stack } from '@mui/material'
import { deleteInvoices, getStudentInvoiceFile } from 'src/store/apps/invoices'

const useStudentInvoiceColumns = () => {
  const dispatch = useDispatch()
  const { attendanceStatuses } = useSelector(state => state.attendance)
  const [DeleteName, setDeleteName] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [drawerData, setDrawerData] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [isPdfLoading, setIsPdfLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteClick = params => {
    setIsDialogOpen(true)
    setSelectedId(params)
    setDeleteName(params.name)
  }
  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await dispatch(deleteInvoices({ selectedId: selectedId.id, studentId: selectedId.student.id }))
      setIsDialogOpen(false)
    } catch (error) {
      // Error handling is done in the store action
    } finally {
      setIsDeleting(false)
    }
  }
  const handleCloseDialog = () => {
    if (!isDeleting) {
      setIsDialogOpen(false)
    }
  }

  const handleVieInvoices = async file => {
    // Open dialog immediately
    setIsPdfLoading(true)
    setSelectedFile({ file: null, name: file?.fileName })

    // Load PDF in background
    try {
      const response = await dispatch(getStudentInvoiceFile(file?.id))
      if (response?.payload?.status == 200) {
        setSelectedFile({ file: response?.payload?.data, name: file?.fileName })
      } else {
        setSelectedFile(null)
      }
    } catch (error) {
      setSelectedFile(null)
    } finally {
      setIsPdfLoading(false)
    }
  }

  const handleCloseViewDialog = () => {
    setSelectedFile(null)
    setIsPdfLoading(false)
  }

  const [attendanceData, setAttendanceData] = useState([])
  const ability = useContext(AbilityContext)

  const columns = useMemo(
    () => [
      {
        headerName: <Translations text={'Full Name'} />,
        field: 'FullName',
        flex: 3,
        renderCell: ({ row }) => (
          <div>
            {row.student.firstName} {row.student.lastName}
          </div>
        )
      },
      {
        flex: 3,
        headerName: <Translations text={'Date'} />,
        renderCell: ({ row }) => <div>{convertDate(row.date)}</div>
      },
      {
        flex: 3,
        headerName: <Translations text={'File Name'} />,
        field: 'fileName'
      },
      {
        width: 200,
        field: 'action',
        headerName: <Translations text={'Action'} />,
        renderCell: params => {
          return (
            <Stack direction={'row'} alignItems={'center'}>
              {ability.can('delete', 'Course') && (
                <IconButton onClick={() => handleDeleteClick(params.row)}>
                  <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'>
                    <path
                      fill='currentColor'
                      d='M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zM8 9h8v10H8zm7.5-5l-1-1h-5l-1 1H5v2h14V4z'
                    ></path>
                  </svg>
                </IconButton>
              )}
              <IconButton onClick={() => handleVieInvoices(params?.row)}>
                <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'>
                  <g fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'>
                    <path d='M10 12a2 2 0 1 0 4 0a2 2 0 0 0-4 0' />
                    <path d='M21 12q-3.6 6-9 6t-9-6q3.6-6 9-6t9 6' />
                  </g>
                </svg>
              </IconButton>
            </Stack>
          )
        }
      }
    ],
    [attendanceStatuses]
  )

  return {
    columns,
    attendanceData,
    setAttendanceData,
    handleDeleteClick,
    handleDelete,
    handleCloseDialog,
    isDialogOpen,
    selectedFile,
    setSelectedFile,
    handleCloseViewDialog,
    isPdfLoading,
    isDeleting,
    DeleteName
  }
}

export default useStudentInvoiceColumns
