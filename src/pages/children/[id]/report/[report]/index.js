// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'

// ** Third Party Components
import axios from 'axios'
import { useRouter } from 'next/router'
// ** Demo Components Imports

import PreviewReport from 'src/views/reports/students-reports/report-preview'

import { fetchSingleChildReport } from 'src/store/apps/reports'
import { useDispatch, useSelector } from 'react-redux'

const ReportPreview = () => {
  // ** State
  const [error, setError] = useState(false)
  const [data, setData] = useState(null)

  const router = useRouter()
  const dispatch = useDispatch()
  const { report: id } = router.query
  useEffect(() => {
    const getReport = async () => {
      if (id) {
        const response = await dispatch(fetchSingleChildReport(id))
        if (response?.payload?.status == 404) setError(true)
        else setData(response?.payload)
        // console.log(response?.payload)
      }
    }

    getReport()
  }, [id])

  if (data) {
    return (
      <>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <PreviewReport data={data} sx={{ width: '100%' }} />
          </Grid>
        </Grid>
      </>
    )
  } else if (error) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity='error'>Report with the id: {id} does not exist. Please check the list of reports </Alert>
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}

export default ReportPreview
