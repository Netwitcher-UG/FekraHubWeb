import { useMemo, useState, useContext, useCallback } from 'react'
import Translations from 'src/layouts/components/Translations'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { convertDate } from 'src/@core/utils/convert-date'
import { useDispatch, useSelector } from 'react-redux'
import { IconButton, Stack, Tooltip } from '@mui/material'
import { deleteInvoices, getStudentInvoiceFile } from 'src/store/apps/invoices'
import Icon from 'src/@core/components/icon'

const useStudentInvoiceColumns = () => {
  const dispatch = useDispatch()
  const { attendanceStatuses } = useSelector(state => state.attendance)
  const [DeleteName, setDeleteName] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [isPdfLoading, setIsPdfLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const ability = useContext(AbilityContext)

  const handleDeleteClick = useCallback(params => {
    setIsDialogOpen(true)
    setSelectedId(params)
    setDeleteName(params.name)
  }, [])

  const handleDelete = useCallback(async () => {
    setIsDeleting(true)
    try {
      await dispatch(deleteInvoices({ selectedId: selectedId.id, studentId: selectedId.student.id }))
      setIsDialogOpen(false)
    } catch (error) {
      // Error handling is done in the store action
    } finally {
      setIsDeleting(false)
    }
  }, [dispatch, selectedId])

  const handleCloseDialog = useCallback(() => {
    if (!isDeleting) {
      setIsDialogOpen(false)
    }
  }, [isDeleting])

  const handleVieInvoices = useCallback(
    async file => {
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
    },
    [dispatch]
  )

  const handleCloseViewDialog = () => {
    setSelectedFile(null)
    setIsPdfLoading(false)
  }

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
        headerName: <Translations text={'File Name'} />,
        field: 'fileName'
      },
      {
        flex: 3,
        headerName: <Translations text={'Date'} />,
        field: 'date',
        renderCell: ({ row }) => <div>{convertDate(row.date)}</div>
      },
      {
        width: 200,
        field: 'action',
        headerName: <Translations text={'Action'} />,
        renderCell: params => {
          return (
            <Stack direction={'row'} alignItems={'center'}>
              {ability.can('delete', 'Course') && (
                <Tooltip title={<Translations text={'Delete Invoice'} />}>
                  <IconButton color='error' onClick={() => handleDeleteClick(params.row)}>
                    <Icon icon='mdi:delete-outline' fontSize={25} />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title={<Translations text={'View Invoice'} />}>
                <IconButton onClick={() => handleVieInvoices(params?.row)}>
                  <Icon icon='mdi:eye-outline' fontSize={25} />
                </IconButton>
              </Tooltip>
            </Stack>
          )
        }
      }
    ],
    [ability, handleDeleteClick, handleVieInvoices]
  )

  return {
    columns,
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
