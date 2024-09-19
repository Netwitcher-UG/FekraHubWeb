import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourses, fetchCoursesRoom, fetchTeacher } from 'src/store/apps/courses'
import { fetchEmployees } from 'src/store/apps/users'
import CoursesDataGrid from 'src/views/courses/dataGrid'
import PayrollDataGrid from 'src/views/payroll/dataGrid'

export default function Index() {

  const { employeesData, status, error } = useSelector(state => state.users)
  console.log("🚀 ~ Index ~ data:", employeesData)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchEmployees('RoleName=Teacher&RoleName=Secretariat'))
  }, [dispatch])


  return (
    <PayrollDataGrid
      rows={employeesData}
      status={status}
    />
  )
}
