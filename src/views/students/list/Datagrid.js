import { useEffect } from 'react'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import CustomTextField from 'src/@core/components/mui/text-field'
import TableHeader from './TableHeader'
import useStudentsColumns from 'src/views/students/hooks/useStudentsColumns'
import AddReportDrawer from '../add-student-report/addReportDrawer'
import { useTranslation } from 'react-i18next'
import { Autocomplete } from '@mui/material'
import CustomDialogDelete from 'src/@core/components/custom-delete'
import EditStudentDialog from '../edit-student-dialog'
import CustomDataGrid from 'src/@core/components/custom-grid'

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
          <Grid item sm={3} xs={12}>
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
        <CustomDataGrid
          rows={store?.data.students || []}
          columns={columns}
          loading={store.loading}
          handleRowClick={handleRowClick}
          pagination={true}
          totalPages={store?.data?.totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          sx={{
            height: '100%'
          }}
        />
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
