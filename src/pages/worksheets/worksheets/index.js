import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUploadType, fetchWorksheet } from 'src/store/apps/worksheets/worksheets'

import WorksheetsDataGrid from 'src/views/worksheets/worksheets/dataGrid'

export default function Index() {
  const { status, error, data, dataUploadType } = useSelector(state => state.worksheet)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchWorksheet())
    dispatch(fetchUploadType())
  }, [dispatch])
  console.log('🚀 ~ Index ~ data:', data)

  return <WorksheetsDataGrid rows={data} dataUploadType={dataUploadType} status={status} />
}
