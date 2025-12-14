import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PayrollDataGrid from 'src/views/payroll/dataGrid'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import { fetchEmployeesPayrollInfo } from 'src/store/apps/payroll'

export default function Index() {
  const { employeesPayrollInfo, employeesPayrollInfoLoading } = useSelector(state => state.payroll)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchEmployeesPayrollInfo())
  }, [dispatch])
  return (
    <Grid container spacing={6.5} sx={{ height: 'calc(100vh - 145px)', overflow: 'hidden' }}>
      <Grid item xs={12} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <PayrollDataGrid rows={employeesPayrollInfo} loading={employeesPayrollInfoLoading} />
        </Card>
      </Grid>
    </Grid>
  )
}
