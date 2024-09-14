import { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import TeachersAttendanceDataGrid from './DataGrid'
import { useRouter } from 'next/router'
// import Divider from '@mui/material/Divider'
const TeacherAttendanceTab = ({ teacherAttendance, loading, teacher }) => {
  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <TeachersAttendanceDataGrid teacherAttendance={teacherAttendance} loading={loading} teacher={teacher} />
        </Card>
      </Grid>
    </Grid>
  )
}

export default TeacherAttendanceTab
