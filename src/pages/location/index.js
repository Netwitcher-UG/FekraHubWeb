import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchLocation } from 'src/store/apps/location'
import LocationDataGrid from 'src/views/location/dataGrid'

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

  return <LocationDataGrid rows={data} status={status} SetSearch={SetSearch} />
}
