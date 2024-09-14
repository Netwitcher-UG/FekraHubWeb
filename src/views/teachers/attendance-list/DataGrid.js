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
import { DataGrid } from '@mui/x-data-grid'
// import TableHeader from './TableHeader'
import useTeachersAttendanceColumns from './hooks/useTeachersAttendanceColumns'
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

const TeachersAttendanceDataGrid = ({ loading, teacherAttendance, teacher }) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const handleClickOpen = () => setOpen(true)
  const { columns, attendanceStatuses, isDialogOpen, DeleteName, handleCloseDialog, handleDelete } =
    useTeachersAttendanceColumns()

  return (
    <>
      <TableHeader toggle={handleClickOpen} />
      <Box sx={{ height: 500 }}>
        {loading ? (
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
            rows={teacherAttendance || []}
            columns={columns}
            hideFooter={true}
            disableRowSelectionOnClick
            pagination={true}
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
      <AddRecord open={open} setOpen={setOpen} attendanceStatuses={attendanceStatuses} teacherId={teacher} />
    </>
  )
}

export default TeachersAttendanceDataGrid
