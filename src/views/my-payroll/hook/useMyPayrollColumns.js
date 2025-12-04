import { useMemo, useState } from 'react'
import Translations from 'src/layouts/components/Translations'
import { convertDate } from 'src/@core/utils/convert-date'
import { useDispatch } from 'react-redux'
import { IconButton, Tooltip, useTheme } from '@mui/material'
import { getPayrollTeacherFile } from 'src/store/apps/payroll'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

const useMyPayrollColumns = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const theme = useTheme()
  const [selectedFile, setSelectedFile] = useState(null)
  const [isPdfLoading, setIsPdfLoading] = useState(false)

  const handleViewFile = async file => {
    setIsPdfLoading(true)
    setSelectedFile({ file: null, name: file.name || convertDate(file.timestamp) })

    try {
      const response = await dispatch(getPayrollTeacherFile(file?.id))
      // getPayrollTeacherFile returns the full axios response, so payload is the response object
      // The actual data is in response.payload.data
      if (response?.payload?.data) {
        setSelectedFile({ file: response.payload.data, name: file.name || convertDate(file.timestamp) })
      } else if (response?.payload) {
        // Fallback: if data is directly in payload
        setSelectedFile({ file: response.payload, name: file.name || convertDate(file.timestamp) })
      } else {
        toast.error(t('Error loading file'))
        setSelectedFile(null)
      }
    } catch (error) {
      toast.error(t('Error loading file'))
      setSelectedFile(null)
    } finally {
      setIsPdfLoading(false)
    }
  }

  const handleCloseViewDialog = () => {
    setSelectedFile(null)
    setIsPdfLoading(false)
  }

  const columns = useMemo(
    () => [
      {
        width: theme.breakpoints.up('sm') ? 200 : 200,
        field: 'action',
        headerName: <Translations text={'Actions'} />,
        renderCell: params => {
          return (
            <Tooltip title={<Translations text={'View file'} />}>
              <IconButton onClick={() => handleViewFile(params.row)} disabled={isPdfLoading}>
                <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'>
                  <g fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'>
                    <path d='M10 12a2 2 0 1 0 4 0a2 2 0 0 0-4 0' />
                    <path d='M21 12q-3.6 6-9 6t-9-6q3.6-6 9-6t9 6' />
                  </g>
                </svg>
              </IconButton>
            </Tooltip>
          )
        }
      },
      {
        headerName: <Translations text={'File Name'} />,
        field: 'name',
        width: theme.breakpoints.down('sm') ? 800 : 250,
        renderCell: ({ row }) => <div>{row.name || '------'}</div>
      },
      {
        width: theme.breakpoints.down('sm') ? 600 : 300,
        field: 'timestamp',
        headerName: <Translations text={'Date'} />,
        renderCell: ({ row }) => <div>{row.timestamp ? convertDate(row.timestamp) : '------'}</div>
      }
    ],
    [theme, isPdfLoading]
  )

  return {
    columns,
    selectedFile,
    setSelectedFile,
    handleCloseViewDialog,
    isPdfLoading
  }
}

export default useMyPayrollColumns
