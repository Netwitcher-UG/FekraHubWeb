// import { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
// import { useSelector, useDispatch } from 'react-redux'
import useAttendanceColumns from '../../hooks/useAttendanceColumns'
import StudentAttendanceDataGrid from './dataGrid'
const StudentAttendanceTab = ({ store, byParent, studentId }) => {
  // const [value, setValue] = useState('')
  // const [selectedCourse, setSelectedCourse] = useState(0)
  // const [searchTerm, setSearchTerm] = useState('')
  const { columns, handleCloseDialog, handleDelete, isDialogOpen, DeleteName } = useAttendanceColumns()

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <StudentAttendanceDataGrid
            columns={columns}
            store={store}
            handleCloseDialog={handleCloseDialog}
            handleDelete={handleDelete}
            isDialogOpen={isDialogOpen}
            DeleteName={DeleteName}
            studentId={studentId}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default StudentAttendanceTab
