import { useState, useEffect } from 'react'
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
import TableHeader from './TableHeader'
import Pagination from '@mui/material/Pagination'
import useStudentsColumns from 'src/views/students/hooks/useStudentsColumns'
import AddReportDrawer from '../add-student-report/addReportDrawer'
import { useTranslation } from 'react-i18next'
import { Autocomplete } from '@mui/material'

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

const StudentsDataGrid = ({
  store,
  setValue,
  value,
  handleFilter,
  selectedCourse,
  setSelectedCourse,
  handleRowClick,
  currentPage,
  setCurrentPage,
  pageSize
}) => {
  const handleCourseChange = (event, newValue) => {
    setCurrentPage(1)
    setSelectedCourse(newValue ? newValue.value : '')
  }
  const { t } = useTranslation()
  const { columns, open, drawerData, handleCloseDrawer } = useStudentsColumns({
    courses: store?.coursesData,
    selectedCourse,
    currentPage,
    pageSize
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1)
      handleFilter(value)
    }, 700)

    return () => clearTimeout(timer)
  }, [value, handleFilter])

  return (
    <>
      <CardHeader title={t('Search Filters')} />
      <CardContent>
        <Grid container spacing={6}>
          <Grid item sm={4} xs={12}>
            <Autocomplete
              options={store?.coursesData?.map(course => ({ value: course.id, label: course.name }))}
              fullWidth
              id='autocomplete-courseFilter'
              getOptionLabel={option => option.label}
              value={
                selectedCourse
                  ? {
                      value: selectedCourse,
                      label: store?.coursesData?.find(course => course.id === selectedCourse)?.name || ''
                    }
                  : null
              }
              onChange={handleCourseChange}
              renderInput={params => (
                <CustomTextField
                  {...params}
                  fullWidth
                  sx={{ mb: 4 }}
                  placeholder={t('Select course')}
                  label={t('Course filter')}
                  id='validation-billing-select'
                  aria-describedby='validation-billing-select'
                />
              )}
            />
          </Grid>
        </Grid>
      </CardContent>
      <Divider sx={{ m: '0 !important' }} />
      <TableHeader value={value} setValue={setValue} handleFilter={handleFilter} />
      <Box sx={{ height: 'calc(100vh - 250px)' }}>
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
          <>
            <DataGrid
              rowHeight={62}
              rows={store?.data.students || []}
              columns={columns}
              hideFooter={true}
              disableRowSelectionOnClick
              onRowClick={handleRowClick}
              pagination={true}
              sx={{
                // overflowY: 'scroll',
                overflowX: 'scroll',
                ...customScrollbarStyles,
                fontSize: '1rem'
              }}
            />
          </>
        )}
      </Box>
      {open && <AddReportDrawer open={open} handleCloseDrawer={handleCloseDrawer} rowData={drawerData} />}
    </>
  )
}

export default StudentsDataGrid
