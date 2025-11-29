import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchLocation } from 'src/store/apps/location'
import LocationDataGrid from 'src/views/location/dataGrid'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'

export default function Index() {
  const [search, SetSearch] = useState('')

  const { data, status, error } = useSelector(state => state.location)

  const dispatch = useDispatch()

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchLocation(search))
    }, 700)

    return () => clearTimeout(timer)
  }, [dispatch, search])

  return (
    <Grid container spacing={6.5} sx={{ height: 'calc(100vh - 145px)', overflow: 'hidden' }}>
      <Grid item xs={12} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <LocationDataGrid rows={data} status={status} SetSearch={SetSearch} />
        </Card>
      </Grid>
    </Grid>
  )
}
