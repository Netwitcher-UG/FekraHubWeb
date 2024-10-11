import { useMemo, useState, useCallback, useContext, useEffect } from 'react'
import Translations from 'src/layouts/components/Translations'
import Chip from '@mui/material/Chip'
// import Icon from 'src/@core/components/icon'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { convertDate } from 'src/@core/utils/convert-date'
// import IconButton from '@mui/material/IconButton'
import { useDispatch, useSelector } from 'react-redux'
import { CircularProgress, IconButton, Stack, Typography } from '@mui/material'
import DropzoneWrapper from 'src/@core/utils/DropZone'
import { AddPayrollFile, deletePayroll, getPayrollTeacherFile } from 'src/store/apps/payroll'
import { useTranslation } from 'react-i18next'

const usePayrollColumns = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { attendanceStatuses } = useSelector(state => state.attendance)
  const [DeleteName, setDeleteName] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  // const [drawerData, setDrawerData] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [worksheetLoading, setWorsheetLoading] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)

  const handleDeleteClick = params => {
    setIsDialogOpen(true)
    setSelectedId(params)
    setDeleteName(params.name)
  }
  const handleDelete = () => {
    dispatch(deletePayroll({ selectedId: selectedId.payrolls[0].id, studentId: selectedId.payrolls[0].id }))
    setIsDialogOpen(false)
  }
  const handleCloseDialog = () => {
    setIsDialogOpen(false)
  }

  const handleViewPayroll = async file => {
    setWorsheetLoading(file?.id)
    const response = await dispatch(getPayrollTeacherFile(file?.payrolls[0].id))
    setSelectedFile({ file: response?.payload, name: file?.fileName })
    setWorsheetLoading(null)
  }

  const handleFileUpload = useCallback((acceptedFiles, row) => {
    // Handle the uploaded file, e.g., sending to the server
    console.log('File uploaded:', acceptedFiles, 'for row:', row)
    const formData = new FormData()
    console.log(acceptedFiles[0])
    formData.append('file', acceptedFiles[0])
    formData.append('UserID', row.id)
    dispatch(AddPayrollFile(formData))
  }, [])

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
            {row.firstName} {row.lastName}
          </div>
        )
      },
      {
        flex: 3,
        headerName: <Translations text={'Date'} />,
        renderCell: ({ row }) => <div>{row.payrolls ? convertDate(row.payrolls?.[0].timestamp) : '------'}</div>
      },
      {
        headerName: <Translations text={'Upload PDF'} />,
        field: 'uploadPdf',
        flex: 2,
        renderCell: ({ row }) => {
          if (row.roles === 'Admin') {
            return <DropzoneWrapper row={row} onFileUpload={handleFileUpload} />
          } else if (row.payrolls) {
            return <Typography sx={{ color: '#7E73F1' }}>{t('already has payroll')}</Typography>
          } else {
            return <DropzoneWrapper row={row} onFileUpload={handleFileUpload} />
          }
        }
      },
      {
        width: 200,
        field: 'action',
        headerName: <Translations text={'Action'} />,
        renderCell: params => {
          return (
            <Stack direction={'row'} alignItems={'center'}>
              {params.row.payrolls && (
                <>
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
                  {worksheetLoading === params?.row?.id ? (
                    <CircularProgress sx={{ ml: 2 }} size={22} />
                  ) : (
                    <IconButton onClick={() => handleViewPayroll(params?.row)}>
                      <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'>
                        <g
                          fill='none'
                          stroke='currentColor'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                        >
                          <path d='M10 12a2 2 0 1 0 4 0a2 2 0 0 0-4 0' />
                          <path d='M21 12q-3.6 6-9 6t-9-6q3.6-6 9-6t9 6' />
                        </g>
                      </svg>
                    </IconButton>
                  )}
                </>
              )}
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
    DeleteName
  }
}

export default usePayrollColumns
