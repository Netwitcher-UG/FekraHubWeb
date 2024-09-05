import React from 'react'
import WorksheetCard from './worksheet-card'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import Translations from 'src/layouts/components/Translations'
// import Divider from '@mui/material/Divider'
// import Button from '@mui/material/Button'
// import Icon from 'src/@core/components/icon'

const WorksheetsList = ({ worksheetData, loading, byParent }) => {
  const renderData =
    worksheetData?.length > 0 && !loading ? (
      worksheetData.map((worksheet, index) => (
        <Grid item xs={14} sm={7} md={4} lg={4} xl={4} key={index}>
          <WorksheetCard worksheet={worksheet} byParent={byParent} />
        </Grid>
      ))
    ) : (
      <Grid item xs={12}>
        <Alert severity='info'>
          {' '}
          <Translations text={'No worksheets yet'} />
        </Alert>
      </Grid>
    )

  return loading ? (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}
    >
      <CircularProgress size={100} />
    </Box>
  ) : (
    <Grid container spacing={6}>
      {renderData}
    </Grid>
  )
}

export default WorksheetsList
