import { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import TeacherPayrollDatagrid from './DataGrid'
// import Divider from '@mui/material/Divider'
const TeacherPayrolltab = ({ teacherPayrollData, loading, teacher }) => {
  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <TeacherPayrollDatagrid teacherPayrollData={teacherPayrollData} loading={loading} teacher={teacher} />
        </Card>
      </Grid>
    </Grid>
  )
}

export default TeacherPayrolltab
