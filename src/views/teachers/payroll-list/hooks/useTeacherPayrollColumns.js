import { useMemo, useState, useContext, useCallback } from 'react'
import Translations from 'src/layouts/components/Translations'
import { convertDate } from 'src/@core/utils/convert-date'
import { checkCell } from 'src/@core/utils/check-cell'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import toast from 'react-hot-toast'
import { Stack } from '@mui/system'
import { deleteteacherPayroll, downloadTeacherPayrollslip } from 'src/store/apps/users'
import { IconButton, Tooltip } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Icon from 'src/@core/components/icon'

const useTeacherPayrollColumns = ({ teacher }) => {
  const dispatch = useDispatch()
  const { t, i18n } = useTranslation()
  const ability = useContext(AbilityContext)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [DeleteName, setDeleteName] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [isPdfLoading, setIsPdfLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteClick = useCallback(
    params => {
      setIsDialogOpen(true)
      setSelectedId({ id: params.id, selectedId: teacher })
      setDeleteName(convertDate(params.timestamp))
    },
    [teacher]
  )

  const handleCloseDialog = () => {
    if (!isDeleting) {
      setIsDialogOpen(false)
    }
  }

  const handleViewPayrollSlip = useCallback(
    async file => {
      // Open dialog immediately
      setIsPdfLoading(true)
      setSelectedFile({ file: null, name: file.timestamp })

      // Load PDF in background
      try {
        const response = await dispatch(downloadTeacherPayrollslip(file?.id))
        setSelectedFile({ file: response?.payload, name: file.timestamp })
      } catch (error) {
        toast.error(t('Error loading file'))
        setSelectedFile(null)
      } finally {
        setIsPdfLoading(false)
      }
    },
    [dispatch, t]
  )

  const handleCloseViewDialog = () => {
    setSelectedFile(null)
    setIsPdfLoading(false)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await dispatch(deleteteacherPayroll({ id: selectedId.id, teacherId: selectedId.selectedId }))
      // if (response?.payload?.status !== 200) toast.error(response?.payload?.data)
      toast.success(t('File deleted successfully'))
      setIsDialogOpen(false)
    } catch (error) {
      toast.error(t('Error deleting file'))
    } finally {
      setIsDeleting(false)
    }
  }

  const columns = useMemo(() => {
    const cols = []

    // Conditionally add the actions column first based on user's ability
    if (ability.can('manage', 'Payroll')) {
      cols.push({
        width: 200,
        field: 'action',
        headerName: <Translations text={'Actions'} />,
        renderCell: params => {
          return (
            <Stack direction={'row'} alignItems={'center'}>
              <Tooltip title={<Translations text={'Delete Payroll Slip'} />}>
                <IconButton color='error' onClick={() => handleDeleteClick(params.row)}>
                  <Icon icon='mdi:delete-outline' fontSize={25} />
                </IconButton>
              </Tooltip>
              <Tooltip title={<Translations text={'View Payroll Slip'} />}>
                <IconButton onClick={() => handleViewPayrollSlip(params?.row)}>
                  <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'>
                    <g fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'>
                      <path d='M10 12a2 2 0 1 0 4 0a2 2 0 0 0-4 0' />
                      <path d='M21 12q-3.6 6-9 6t-9-6q3.6-6 9-6t9 6' />
                    </g>
                  </svg>
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
        headerName: <Translations text={'Name'} />,
        field: 'name',
        renderCell: ({ row }) => <>{row.name || t('No name')}</>
      },
      {
        flex: 0.15,
        minWidth: 120,
        headerName: <Translations text={'Date'} />,
        field: 'timestamp',
        renderCell: ({ row }) => checkCell(convertDate(row.timestamp))
      }
    )

    return cols
  }, [ability, i18n.language, handleDeleteClick, handleViewPayrollSlip, t])

  return {
    columns,
    DeleteName,
    isDialogOpen,
    handleCloseDialog,
    handleDelete,
    selectedFile,
    setSelectedFile,
    handleCloseViewDialog,
    isPdfLoading,
    isDeleting
  }
}

export default useTeacherPayrollColumns
