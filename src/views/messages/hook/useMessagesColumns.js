import { useMemo, useState, useCallback, useContext, useEffect } from 'react'
import Translations from 'src/layouts/components/Translations'
import Chip from '@mui/material/Chip'
// import Icon from 'src/@core/components/icon'
import { fetchAttendanceStatuses } from 'src/store/apps/attendance'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { convertDate } from 'src/@core/utils/convert-date'
// import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useDispatch, useSelector } from 'react-redux'
import { CircularProgress, IconButton, Stack, Typography } from '@mui/material'
import { deleteInvoices, getStudentInvoiceFile } from 'src/store/apps/invoices'
import DropzoneWrapper from 'src/@core/utils/DropZone'
import { AddPayrollFile, deletePayroll, getPayrollTeacherFile } from 'src/store/apps/payroll'


const useMessagesColumns = () => {
  const dispatch = useDispatch()
  const { attendanceStatuses } = useSelector(state => state.attendance)
  const [DeleteName, setDeleteName] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [drawerData, setDrawerData] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [worksheetLoading, setWorsheetLoading] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)

  const handleDeleteClick = params => {
    setIsDialogOpen(true)
    setSelectedId(params)
    setDeleteName(params.name)

  }
  const handleDelete = () => {
    dispatch(deletePayroll({selectedId:selectedId.payrolls[0].id,studentId:selectedId.payrolls[0].id}))
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
    console.log('File uploaded:', acceptedFiles, 'for row:', row);
    const formData = new FormData()
    formData.append('file',acceptedFiles[0])
    formData.append('UserID',row.id)
    dispatch(AddPayrollFile(formData))
  }, []);

  const [attendanceData, setAttendanceData] = useState([])
  const ability = useContext(AbilityContext)



  const columns = useMemo(
    () => [
      {
        headerName: <Translations text={'Full Name'} />,
        field: 'FullName',
        flex:3,
        renderCell: ({ row }) => (
          <div>
            {row.user[0].firstName} {row.user[0].lastName}
          </div>
        )
      },
      {
        headerName: <Translations text={'Email'} />,
        field: 'Email',
        flex:3,
        renderCell: ({ row }) => (
          <div>
            {row.user[0].email}
          </div>
        )
      },
      {
        flex:3,
        headerName: <Translations text={'Date'} />,
        renderCell: ({ row }) => <div>{row.date? convertDate( row.date):'------'}</div>
      },
      {
        headerName: <Translations text={'Message'} />,
        field: 'Message',
        flex:3,
        renderCell: ({ row }) => (
          <div>
            {row.message}
          </div>
        )
      },



    ],
    [attendanceStatuses]
  )

  return { columns, attendanceData, setAttendanceData,
    handleDeleteClick,
    handleDelete,
    handleCloseDialog,
    isDialogOpen,
    selectedFile,
    setSelectedFile,
    DeleteName }
}

export default useMessagesColumns
