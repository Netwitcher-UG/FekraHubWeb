import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUploadType, fetchWorksheet } from 'src/store/apps/worksheets'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import WorksheetsDataGrid from 'src/views/worksheets/dataGrid'

export default function Index() {
  const { status, error, data, dataUploadType } = useSelector(state => state.worksheet)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchWorksheet())
    dispatch(fetchUploadType())
  }, [dispatch])

  return (
    <Grid container spacing={6.5} sx={{ height: 'calc(100vh - 145px)', overflow: 'hidden' }}>
      <Grid item xs={12} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <WorksheetsDataGrid rows={data} dataUploadType={dataUploadType} status={status} />
        </Card>
      </Grid>
    </Grid>
  )
}
