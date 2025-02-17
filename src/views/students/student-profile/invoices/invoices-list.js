import React from 'react'
import InvoiceCard from './invoice-card'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import StudentsInvoiceDataGrid from './list/Datagrid'
import TableHeader from './list/TableHeader'
import InvoiceCardbyParent from './invoice-card-byParent'
import Add from './add'
// import Divider from '@mui/material/Divider'
// import Button from '@mui/material/Button'
// import Icon from 'src/@core/components/icon'
import Translations from 'src/layouts/components/Translations'

const InvoicesList = ({ invoicesData, student, loading, byParent }) => {
  const renderData =
    invoicesData?.length > 0 && !loading ? (
      <>
        {byParent ? (
          invoicesData?.map((invoice, index) => (
            <Grid item xs={14} sm={7} md={4} lg={4} xl={4} key={index}>
              <InvoiceCardbyParent invoice={invoice} byParent={byParent} />
            </Grid>
          ))
        ) : (
          <>
            <Add student={student} />
            <StudentsInvoiceDataGrid invoice={invoicesData} byParent={byParent} />
          </>
        )}
      </>
    ) : (
      <Grid item xs={12}>
        <Alert severity='info'>
          {' '}
          <Translations text={'No invoices yet'} />{' '}
        </Alert>
        {byParent ? null : <Add student={student} />}
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

export default InvoicesList
