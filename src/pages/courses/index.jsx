import React, { useEffect } from 'react'
import CoursesDataGrid from '../../features/courses/dataGrid'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourses, fetchCoursesRoom, fetchTeacher } from 'src/store/apps/courses'

export default function Index() {
  const { data, status, error, dataRooms, dataTeacher } = useSelector(state => state.courses)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchCourses())
    dispatch(fetchCoursesRoom())
    dispatch(fetchTeacher())
  }, [dispatch])

  return <CoursesDataGrid rows={data} dataRooms={dataRooms} dataTeacher={dataTeacher} />
}
