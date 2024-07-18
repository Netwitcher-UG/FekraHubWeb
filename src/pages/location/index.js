import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchLocation } from 'src/store/apps/location'
import LocationDataGrid from 'src/views/location/dataGrid'

export default function Index() {
  const { data, status, error } = useSelector(state => state.location)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchLocation())
  }, [dispatch])

  return <LocationDataGrid rows={data} status={status} />
}
