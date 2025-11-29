import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEmployees } from 'src/store/apps/users'
import PayrollDataGrid from 'src/views/payroll/dataGrid'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'

export default function Index() {
  const { employeesData, loading } = useSelector(state => state.users)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchEmployees('RoleName=Teacher&RoleName=Secretariat'))
  }, [dispatch])

  return (
    <Grid container spacing={6.5} sx={{ height: 'calc(100vh - 145px)', overflow: 'hidden' }}>
      <Grid item xs={12} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <PayrollDataGrid rows={employeesData} loading={loading} />
        </Card>
      </Grid>
    </Grid>
  )
}
