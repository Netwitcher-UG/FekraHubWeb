import { useMemo, useState, useCallback } from 'react'
import Translations from 'src/layouts/components/Translations'
import { convertDate } from 'src/@core/utils/convert-date'
import { useDispatch, useSelector } from 'react-redux'
import { IconButton, Tooltip, useTheme } from '@mui/material'
import DropzoneWrapper from 'src/@core/utils/DropZone'
import { AddPayrollFile } from 'src/store/apps/payroll'
import { useTranslation } from 'react-i18next'

const usePayrollColumns = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { attendanceStatuses } = useSelector(state => state.attendance)
  const theme = useTheme()
  console.log('🚀 ~ usePayrollColumns ~ theme:', theme.breakpoints.down('md') ? true : false)
  const [isViewFilesDialogOpen, setIsViewFilesDialogOpen] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [uploadSuccessKeys, setUploadSuccessKeys] = useState({})

  const handleFileUpload = useCallback(
    async (acceptedFiles, row) => {
      // Handle the uploaded file, e.g., sending to the server
      console.log('File uploaded:', acceptedFiles, 'for row:', row)
      const formData = new FormData()
      console.log(acceptedFiles[0])
      formData.append('file', acceptedFiles[0])
      formData.append('UserID', row.id)
      const response = await dispatch(AddPayrollFile(formData))
      // The AddPayrollFile action already dispatches fetchEmployees on success
      // so the data will be automatically refetched
      if (response?.error) {
        console.error('Upload failed:', response.error)
      } else if (response?.payload || response?.type?.includes('fulfilled')) {
        // Clear the file name from dropzone after successful upload for this specific row
        setUploadSuccessKeys(prev => ({
          ...prev,
          [row.id]: (prev[row.id] || 0) + 1
        }))
      }
    },
    [dispatch]
  )

  const handleViewUploadedFiles = row => {
    setSelectedTeacher({ id: row.id, name: `${row.firstName} ${row.lastName}` })
    setIsViewFilesDialogOpen(true)
  }

  const handleCloseViewFilesDialog = () => {
    setIsViewFilesDialogOpen(false)
    setSelectedTeacher(null)
  }

  const [attendanceData, setAttendanceData] = useState([])

  const columns = useMemo(
    () => [
      {
        headerName: <Translations text={'Full Name'} />,
        field: 'FullName',
        width: theme.breakpoints.down('sm') ? 400 : 150,
        renderCell: ({ row }) => (
          <div>
            {row.firstName} {row.lastName}
          </div>
        )
      },
      {
        width: theme.breakpoints.down('sm') ? 300 : 300,
        headerName: <Translations text={'Latest Payroll Date'} />,
        renderCell: ({ row }) => <div>{row.lastPayrollDate ? convertDate(row.lastPayrollDate) : '------'}</div>
      },
      {
        headerName: <Translations text={'Upload PDF'} />,
        field: 'uploadPdf',
        width: theme.breakpoints.down('sm') ? 300 : 400,
        headerAlign: 'center',
        renderCell: ({ row }) => {
          return (
            <DropzoneWrapper row={row} onFileUpload={handleFileUpload} uploadSuccess={uploadSuccessKeys[row.id] || 0} />
          )
        }
      },
      {
        width: theme.breakpoints.up('sm') ? 200 : 200,
        field: 'action',
        headerName: <Translations text={'Action'} />,
        renderCell: params => {
          return (
            <Tooltip title={<Translations text={'View uploaded files'} />}>
              <IconButton onClick={() => handleViewUploadedFiles(params.row)}>
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
      }
    ],
    [attendanceStatuses, theme, handleFileUpload, handleViewUploadedFiles]
  )

  return {
    columns,
    attendanceData,
    setAttendanceData,
    isViewFilesDialogOpen,
    handleCloseViewFilesDialog,
    selectedTeacher
  }
}

export default usePayrollColumns
