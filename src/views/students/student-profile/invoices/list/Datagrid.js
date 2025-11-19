import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { DataGrid } from '@mui/x-data-grid'
import Alert from '@mui/material/Alert'
// import TableHeader from './TableHeader'
import { useDispatch } from 'react-redux'
import useStudentInvoiceColumns from '../hooks/useStudentsInvoiceColumns'
import CustomDialogDelete from 'src/@core/components/custom-delete'
import ViewInvoice from '../view'

const customScrollbarStyles = {
  '& ::-webkit-scrollbar': {
    height: 8
  },
  '& ::-webkit-scrollbar-thumb': {
    backgroundColor: '#888',
    borderRadius: 10,
    '&:hover': {
      backgroundColor: '#555'
    }
  }
}

const StudentsInvoiceDataGrid = ({
  store,
  setValue,
  invoice,
  value,
  handleFilter,
  selectedCourse,
  setSelectedCourse,
  handleRowClick,
  setCurrentPage,
  coursesData
}) => {
  const handleCourseChange = (event, newValue) => {
    setCurrentPage(1)
    setAttendanceData([])
    setSelectedCourse(newValue ? newValue.value : '')
  }
  const dispatch = useDispatch()

  const {
    columns,
    attendanceData,
    setAttendanceData,
    selectedFile,
    setSelectedFile,
    isDialogOpen,
    handleDelete,
    handleCloseDialog,
    handleDeleteClick,
    drawerData,
    open,
    handleCloseDrawer,
    DeleteName,
    handleCloseViewDialog,
    isPdfLoading,
    isDeleting
  } = useStudentInvoiceColumns()

  let isNotSchoolDay =
    store?.students?.isTodayAWorkDay === false && !store?.studentsLoading && store?.students?.students[0]

  return (
    <>
      <CardContent></CardContent>
      <Divider sx={{ m: '0 !important' }} />
      {isNotSchoolDay ? (
        <Grid item xs={12} sx={{ mt: 16, mb: 16, mx: 4 }}>
          <Alert severity='info'> There is no course today !</Alert>
        </Grid>
      ) : (
        <Box sx={{ height: 'calc(100vh - 250px)', width: '100%' }}>
          <>
            <DataGrid
              rowHeight={62}
              rows={invoice || []}
              columns={columns}
              hideFooter={true}
              disableRowSelectionOnClick
              onRowClick={handleRowClick}
              pagination={true}
              sx={{
                // overflowY: 'scroll',
                overflowX: 'scroll',
                ...customScrollbarStyles,
                fontSize: '1rem'
              }}
            />
          </>
        </Box>
      )}
      <CustomDialogDelete
        open={isDialogOpen}
        handleClose={handleCloseDialog}
        decsription={`Are you sure you want to delete the class ${DeleteName} ? `}
        onDelete={handleDelete}
        loading={isDeleting}
      />
      {selectedFile && (
        <ViewInvoice
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          isPdfLoading={isPdfLoading}
          onClose={handleCloseViewDialog}
        />
      )}
    </>
  )
}

export default StudentsInvoiceDataGrid
