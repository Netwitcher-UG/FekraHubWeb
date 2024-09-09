import { useState, useEffect } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
// import Typography from '@mui/material/Typography'
import CustomTextField from 'src/@core/components/mui/text-field'
import { DataGrid } from '@mui/x-data-grid'
import { submitCourseAttendance, fetchStudentsWithAttendance } from 'src/store/apps/attendance'
import Button from '@mui/material/Button'
import Translations from 'src/layouts/components/Translations'
import CardHeader from '@mui/material/CardHeader'
import Icon from 'src/@core/components/icon'
import Alert from '@mui/material/Alert'
// import TableHeader from './TableHeader'
import useStudentAttendanceColumns from '../hooks/useStudentsInvoiceColumns'
import { Autocomplete } from '@mui/material'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import useStudentInvoiceColumns from '../hooks/useStudentsInvoiceColumns'
import CustomDialogDelete from 'src/@core/components/custom-delete'
import ViewWorksheet from 'src/views/worksheets/view'

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
  console.log("🚀 ~ invoice:", invoice)
  const handleCourseChange = (event, newValue) => {
    setCurrentPage(1)
    setAttendanceData([])
    setSelectedCourse(newValue ? newValue.value : '')
  }
  const dispatch = useDispatch()
  // const handelAttendanceSubmit = async () => {
  //   const response = await dispatch(submitCourseAttendance({ courseId: selectedCourse, data: attendanceData }))
  //   if (response?.payload?.status) {
  //     toast.success('Course attendance submitted successfully')
  //     dispatch(fetchStudentsWithAttendance({ courseId: selectedCourse }))
  //   } else {
  //     toast.error(response?.payload?.data)
  //   }
  // }



  const { columns, attendanceData, setAttendanceData ,   selectedFile,setSelectedFile, isDialogOpen,handleDelete, handleCloseDialog,handleDeleteClick, drawerData, open, handleCloseDrawer, DeleteName } = useStudentInvoiceColumns()




  let isNotSchoolDay =
    store?.students?.isTodayAWorkDay === false && !store?.studentsLoading && store?.students?.students[0]

  return (
    <>

      <CardContent>

      </CardContent>
      <Divider sx={{ m: '0 !important' }} />
      {isNotSchoolDay ? (
        <Grid item xs={12} sx={{ mt: 16, mb: 16, mx: 4 }}>
          <Alert severity='info'> There is no course today !</Alert>
        </Grid>
      ) : (
        <Box sx={{ height: 'calc(100vh - 250px)', width:'100%' }}>

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
      />
      <ViewWorksheet selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
    </>
  )
}

export default StudentsInvoiceDataGrid
