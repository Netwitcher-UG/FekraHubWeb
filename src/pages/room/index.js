import React, { useEffect } from 'react'
// TODO: Uncomment when API endpoint supports search
// import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourses, fetchCoursesRoom, fetchTeacher } from 'src/store/apps/courses'
import CoursesDataGrid from 'src/views/courses/dataGrid'
import RoomDataGrid from 'src/views/room/dataGrid'

export default function Index() {
  // TODO: Uncomment when API endpoint supports search
  // const [search, SetSearch] = useState('')
  const { status, error, dataRooms } = useSelector(state => state.courses)

  const dispatch = useDispatch()

  useEffect(() => {
    // TODO: Uncomment when API endpoint supports search
    // const timer = setTimeout(() => {
    //   dispatch(fetchCoursesRoom(search))
    // }, 700)
    // return () => clearTimeout(timer)
    dispatch(fetchCoursesRoom(''))
  }, [dispatch])
  // }, [dispatch, search])

  return <RoomDataGrid rows={dataRooms} status={status} />
  // return <RoomDataGrid rows={dataRooms} status={status} SetSearch={SetSearch} search={search} />
}
