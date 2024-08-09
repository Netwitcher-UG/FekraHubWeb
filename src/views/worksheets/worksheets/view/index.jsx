import { CircularProgress } from '@mui/material'
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DownloadUploadFile } from 'src/store/apps/worksheets/worksheets'

export default function View({ id }) {
  console.log('🚀 ~ View ~ id:', id)
  const { status, ShowFile } = useSelector(state => state.worksheet)
  console.log('🚀 ~ View ~ ShowFile:', ShowFile)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(DownloadUploadFile(id))
  }, [dispatch])

  return (
    <>
      {ShowFile ? (
        // <iframe
        //   style={{
        //     width: '100%',
        //     height: '100vh',
        //     border: 'none',
        //     borderRadius: 'inherit'
        //   }}
        //   src={`${ShowFile}`}
        // />
        <iframe src={`data:application/pdf;base64,${ShowFile}`} width='100%' height='800vh' title={'test'} />
      ) : (
        <div
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh' }}
        >
          <CircularProgress />
        </div>
      )}
    </>
  )
}
