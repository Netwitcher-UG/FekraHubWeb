import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourses, fetchCoursesRoom, fetchTeacher } from 'src/store/apps/courses'
import CoursesDataGrid from 'src/views/courses/dataGrid'

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
    <CoursesDataGrid
      rows={data}
      dataRooms={dataRooms}
      dataTeacher={dataTeacher}
      SetSearch={SetSearch}
      status={status}
    />
  )
}
