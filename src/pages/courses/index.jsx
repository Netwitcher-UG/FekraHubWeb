import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourses, fetchCoursesRoom, fetchTeacher } from 'src/store/apps/courses'
import CoursesDataGrid from 'src/views/courses/dataGrid'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'

export default function Index() {
  const [search, SetSearch] = useState('')

  const { data, status, error, dataRooms, dataTeacher } = useSelector(state => state.courses)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchCoursesRoom())
    dispatch(fetchTeacher())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchCourses(search))
  }, [dispatch, search])

  return (
    <Grid container spacing={6.5} sx={{ height: 'calc(100vh - 145px)', overflow: 'hidden' }}>
    <Grid item xs={12} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
    <CoursesDataGrid
      rows={data}
      dataRooms={dataRooms}
      dataTeacher={dataTeacher}
      SetSearch={SetSearch}
      search={search}
      status={status}
    />
    </Card>
    </Grid>
    </Grid>
  )
}
