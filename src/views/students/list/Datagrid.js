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
import CustomDialogDelete from 'src/@core/components/custom-delete'
import EditStudentDialog from '../edit-student-dialog'

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
  const {
    columns,
    open,
    drawerData,
    handleCloseDrawer,
    isDialogOpen,
    handleCloseDialog,
    handleDelete,
    DeleteName,
    isDeleting,
    isEditDialogOpen,
    handleCloseEditDialog,
    editStudentData
  } = useStudentsColumns({
    courses: store?.coursesData,
    selectedCourse,
    currentPage,
    pageSize,
    search: value
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1)
      handleFilter(value)
    }, 700)

    return () => clearTimeout(timer)
  }, [value, handleFilter])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1, overflow: 'hidden' }}>
      <CardContent sx={{ flexShrink: 0, pb: 0 }}>
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
      <Divider sx={{ m: '0 !important', flexShrink: 0 }} />
      <Box sx={{ flexShrink: 0 }}>
        <TableHeader value={value} setValue={setValue} handleFilter={handleFilter} />
      </Box>
      <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {store.loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              zIndex: 10
            }}
          >
            <CircularProgress size={100} />
          </Box>
        ) : (
          <DataGrid
            rowHeight={62}
            rows={store?.data.students || []}
            columns={columns}
            hideFooter={true}
            disableRowSelectionOnClick
            onRowClick={handleRowClick}
            pagination={true}
            sx={{
              height: '100%',
              overflowX: 'auto',
              ...customScrollbarStyles,
              fontSize: '1rem',
              '& .MuiDataGrid-virtualScroller': {
                overflowY: 'auto'
              },
              '& .MuiDataGrid-row:hover': {
                cursor: 'pointer'
              }
            }}
          />
        )}
      </Box>
      {open && <AddReportDrawer open={open} handleCloseDrawer={handleCloseDrawer} rowData={drawerData} />}
      <CustomDialogDelete
        open={isDialogOpen}
        handleClose={handleCloseDialog}
        decsription={`${t('Are you sure you want to delete the student')} ${DeleteName} ? `}
        onDelete={handleDelete}
        loading={isDeleting}
      />
      <EditStudentDialog
        open={isEditDialogOpen}
        handleClose={handleCloseEditDialog}
        studentData={editStudentData}
        search={value}
        selectedCourse={selectedCourse}
        currentPage={currentPage}
        pageSize={pageSize}
      />
    </Box>
  )
}

export default StudentsDataGrid
