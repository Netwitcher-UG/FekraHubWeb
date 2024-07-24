import { useState, useEffect, useCallback } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CustomTextField from 'src/@core/components/mui/text-field'
import MenuItem from '@mui/material/MenuItem'
import { DataGrid } from '@mui/x-data-grid'
import Translations from 'src/layouts/components/Translations'
import CardHeader from '@mui/material/CardHeader'
import ReportPreviewDrawer from '../preview-report/report-drawer'
// import TableHeader from './TableHeader'

const customScrollbarStyles = {
  '& ::-webkit-scrollbar': {
    height: 8
  },
  '& ::-webkit-scrollbar-thumb': {
    backgroundColor: '#888',
    borderRadius: 10,
    '&:hover': {
      backgroundColor: '#555'
    }
  }
}

const ReportsDataGrid = ({
  columns,
  store
  // setValue,
  // value,
  // handleFilter,
  // selectedCourse,
  // setSelectedCourse,
  // handleRowClick
}) => {
  const [drawerData, setDrawerData] = useState(null)
  const [open, setOpen] = useState(false)

  const handleOpenDrawer = useCallback(params => {
    setDrawerData(params.row)
    setOpen(true)
  }, [])

  const handleCloseDrawer = useCallback(() => {
    setOpen(false)
    setDrawerData(null)
  }, [])

  //   const handleCourseChange = e => {
  //     setSelectedCourse(e.target.value)
  //   }

  //   useEffect(() => {
  //     const timer = setTimeout(() => {
  //       handleFilter(value)
  //     }, 700)

  //     return () => clearTimeout(timer)
  //   }, [value, handleFilter])

  return (
    <>
      {/* <CardHeader title='Search Filters' /> */}
      {/* <CardContent>
        <Grid container spacing={6}>
          <Grid item sm={4} xs={12}>
            <CustomTextField
              select
              fullWidth
              defaultValue=''
              label={<Translations text={'Course'} />}
              value={selectedCourse}
              onChange={handleCourseChange}
              SelectProps={{
                displayEmpty: true
              }}
            >
              <MenuItem value=''>
                <em>
                  <Translations text={'Select Course'} />
                </em>
              </MenuItem>
              <MenuItem value={0}>None</MenuItem>
              {store?.coursesData.map(course => (
                <MenuItem key={course.id} value={course.id}>
                  {course.name}
                </MenuItem>
              ))}
            </CustomTextField>
          </Grid>
        </Grid>
      </CardContent> */}
      <Divider sx={{ m: '0 !important' }} />
      {/* <TableHeader value={value} setValue={setValue} handleFilter={handleFilter} /> */}
      <Box sx={{ height: 500 }}>
        {store.loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '90%',
              zIndex: 10
            }}
          >
            <CircularProgress size={100} />
          </Box>
        ) : (
          <DataGrid
            rowHeight={62}
            rows={store?.data || []}
            columns={columns}
            hideFooter={true}
            disableRowSelectionOnClick
            pagination={true}
            onRowClick={handleOpenDrawer}
            sx={{
              overflowY: 'scroll',
              overflowX: 'scroll',
              ...customScrollbarStyles,
              fontSize: '1rem'
            }}
          />
        )}
      </Box>
      {open && <ReportPreviewDrawer open={open} handleCloseDrawer={handleCloseDrawer} rowData={drawerData} />}
    </>
  )
}

export default ReportsDataGrid
