import { useState, useEffect } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import AddRecord from './add-record'
import Divider from '@mui/material/Divider'
import CustomDialogDelete from 'src/@core/components/custom-delete'
import TableHeader from './TableHeader'
// import Typography from '@mui/material/Typography'
import CustomTextField from 'src/@core/components/mui/text-field'
import { DataGrid } from '@mui/x-data-grid'
import Translations from 'src/layouts/components/Translations'
import CardHeader from '@mui/material/CardHeader'
// import TableHeader from './TableHeader'
import useTeachersAttendanceColumns from '../hooks/useTeachersAttendanceColumns'
import { Autocomplete } from '@mui/material'
import { useTranslation } from 'react-i18next'
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

const TeachersAttendanceDataGrid = ({
  store,
  setValue,
  value,
  handleFilter,
  selectedTeacher,
  setSelectedTeacher,
  handleRowClick,
  setCurrentPage,
  teacherNames
}) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const handleClickOpen = () => setOpen(true)
  const handleTeacherChange = (event, newValue) => {
    setCurrentPage(1)
    setSelectedTeacher(newValue ? newValue.value : '')
  }

  const { columns, attendanceStatuses, isDialogOpen, DeleteName, handleCloseDialog, handleDelete } =
    useTeachersAttendanceColumns()
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1)
      handleFilter(value)
    }, 700)

    return () => clearTimeout(timer)
  }, [value, handleFilter])

  useEffect(() => {
    // Automatically select the first course when the options are available and no course is selected
    if (!selectedTeacher && teacherNames?.length > 0) {
      setSelectedTeacher(teacherNames[0].id)
    }
  }, [teacherNames, selectedTeacher, setSelectedTeacher])

  return (
    <>
      <CardHeader title={t('Search Filters')} />
      <CardContent>
        <Grid container spacing={6} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Grid item sm={4} xs={12}>
            <Autocomplete
              options={teacherNames?.map(teacher => ({
                value: teacher.id,
                label: `${teacher.firstName} ${teacher.lastName}`
              }))}
              fullWidth
              disableClearable={true}
              id='autocomplete-courseFilter'
              getOptionLabel={option => option.label}
              value={
                selectedTeacher
                  ? {
                      value: selectedTeacher,
                      label:
                        `${teacherNames?.find(teacher => teacher.id === selectedTeacher)?.firstName} ${
                          teacherNames?.find(teacher => teacher.id === selectedTeacher)?.lastName
                        }` || ''
                    }
                  : null
              }
              onChange={handleTeacherChange}
              renderInput={params => (
                <CustomTextField
                  {...params}
                  fullWidth
                  sx={{ mb: 4 }}
                  placeholder={t('Select Teacher')}
                  label={t('Teachers filter')}
                  id='validation-billing-select'
                  aria-describedby='validation-billing-select'
                />
              )}
            />
          </Grid>
        </Grid>
      </CardContent>
      <Divider sx={{ m: '0 !important' }} />
      <TableHeader toggle={handleClickOpen} />
      <Box sx={{ height: 500 }}>
        {!selectedTeacher ? null : store.teacherAttendanceLoading ? (
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
            rows={store?.teacherAttendance || []}
            columns={columns}
            hideFooter={true}
            disableRowSelectionOnClick
            pagination={true}
            onRowClick={handleRowClick}
            sx={{
              overflowY: 'scroll',
              overflowX: 'scroll',
              ...customScrollbarStyles,
              fontSize: '1rem'
            }}
          />
        )}
      </Box>
      <CustomDialogDelete
        open={isDialogOpen}
        handleClose={handleCloseDialog}
        decsription={`${t('Are you sure you want to delete record for')} ${DeleteName} ? `}
        onDelete={handleDelete}
      />
      <AddRecord open={open} setOpen={setOpen} attendanceStatuses={attendanceStatuses} teacherId={selectedTeacher} />
    </>
  )
}

export default TeachersAttendanceDataGrid
