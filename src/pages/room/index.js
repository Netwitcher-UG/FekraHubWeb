import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourses, fetchCoursesRoom, fetchTeacher } from 'src/store/apps/courses'
import CoursesDataGrid from 'src/views/courses/dataGrid'
import RoomDataGrid from 'src/views/room/dataGrid'

export default function Index() {
  const { status, error, dataRooms } = useSelector(state => state.courses)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchCoursesRoom())
  }, [dispatch])

  return <RoomDataGrid rows={dataRooms} status={status} />
}
