import { useMemo, useEffect, useState, useContext } from 'react'
import Translations from 'src/layouts/components/Translations'
import { convertDate } from 'src/@core/utils/convert-date'
import { checkCell } from 'src/@core/utils/check-cell'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import CircularProgress from '@mui/material'
import toast from 'react-hot-toast'
import { Stack } from '@mui/system'
import { deleteteacherPayroll, downloadTeacherPayrollslip } from 'src/store/apps/users'
import { IconButton, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

const useTeacherPayrollColumns = ({ teacher }) => {
  const dispatch = useDispatch()
  const { t, i18n } = useTranslation()
  const ability = useContext(AbilityContext)
  const [downloadFileLoading, setDownloadFileLoading] = useState(null)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [DeleteName, setDeleteName] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)

  const handleDeleteClick = params => {
    setIsDialogOpen(true)
    setSelectedId({ id: params.id, selectedId: teacher })
    setDeleteName(convertDate(params.timestamp))
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
  }

  const handleViewPayrollSlip = async file => {
    setDownloadFileLoading(file?.id)
    const response = await dispatch(downloadTeacherPayrollslip(file?.id))
    setSelectedFile({ file: response?.payload, name: file.timestamp })
    setDownloadFileLoading(null)
  }

  const handleDelete = async () => {
    const response = await dispatch(deleteteacherPayroll({ id: selectedId.id, teacherId: selectedId.selectedId }))
    if (response?.payload?.status !== 200) toast.error(response?.payload?.data)
    setIsDialogOpen(false)
  }

  const columns = useMemo(
    () => {
      const cols = [
        {
          flex: 0.15,
          minWidth: 120,
          headerName: <Translations text={'Date'} />,
          field: 'timestamp',
          renderCell: ({ row }) => checkCell(convertDate(row.timestamp))
        }
      ]

      // Conditionally add the actions column based on user's ability
      if (ability.can('manage', 'Payroll')) {
        cols.push({
          width: 200,
          field: 'action',
          headerName: <Translations text={'Action'} />,
          renderCell: params => {
            return (
              <Stack direction={'row'} alignItems={'center'}>
                <IconButton onClick={() => handleDeleteClick(params.row)}>
                  <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'>
                    <path
                      fill='currentColor'
                      d='M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zM8 9h8v10H8zm7.5-5l-1-1h-5l-1 1H5v2h14V4z'
                    ></path>
                  </svg>
                </IconButton>
                {downloadFileLoading == params?.row?.id ? (
                  <CircularProgress sx={{ ml: 2 }} size={22} />
                ) : (
                  <IconButton onClick={() => handleViewPayrollSlip(params?.row)}>
                    <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'>
                      <g
                        fill='none'
                        stroke='currentColor'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                        stroke-width='2'
                      >
                        <path d='M10 12a2 2 0 1 0 4 0a2 2 0 0 0-4 0' />
                        <path d='M21 12q-3.6 6-9 6t-9-6q3.6-6 9-6t9 6' />
                      </g>
                    </svg>
                  </IconButton>
                )}
              </Stack>
            )
          }
        })
      }

      return cols
    },
    [ability, i18n.language] // Add 'ability' to the dependency array
  )

  return { columns, DeleteName, isDialogOpen, handleCloseDialog, handleDelete, selectedFile, setSelectedFile }
}

export default useTeacherPayrollColumns
