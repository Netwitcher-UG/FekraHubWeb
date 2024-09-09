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
import { CircularProgress, IconButton, Stack } from '@mui/material'
import { deleteInvoices, getStudentInvoiceFile } from 'src/store/apps/invoices'


const useStudentInvoiceColumns = () => {
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
    dispatch(deleteInvoices({selectedId:selectedId.id,studentId:selectedId.student.id}))
    setIsDialogOpen(false)
  }
  const handleCloseDialog = () => {
    setIsDialogOpen(false)
  }

  const handleVieInvoices = async file => {
    setWorsheetLoading(file?.id)
    const response = await dispatch(getStudentInvoiceFile(file?.id))
    setSelectedFile({ file: response?.payload, name: file?.fileName })
    setWorsheetLoading(null)
  }

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
            {row.student.firstName} {row.student.lastName}
          </div>
        )
      },
      {
        flex:3,
        headerName: <Translations text={'Date'} />,
        renderCell: ({ row }) => <div>{convertDate(row.date)}</div>
      },
      {
        flex:3,
        headerName: <Translations text={'fileName'} />,
        field: 'fileName',
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
                            {worksheetLoading == params?.row?.id ? (
                <CircularProgress sx={{ ml: 2 }} size={22} />
              ) : (
                <IconButton onClick={() => handleVieInvoices(params?.row)}>
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
      }

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

export default useStudentInvoiceColumns
