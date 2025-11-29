import { useState } from 'react'
import Box from '@mui/material/Box'
import AddRecord from './add-record'
import CustomDialogDelete from 'src/@core/components/custom-delete'
import TableHeader from './TableHeader'
import CustomDataGrid from 'src/@core/components/custom-grid'
import useTeachersAttendanceColumns from './hooks/useTeachersAttendanceColumns'
import { useTranslation } from 'react-i18next'

const TeachersAttendanceDataGrid = ({ loading, teacherAttendance, teacher }) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const handleClickOpen = () => setOpen(true)
  const { columns, attendanceStatuses, isDialogOpen, DeleteName, handleCloseDialog, handleDelete } =
    useTeachersAttendanceColumns()

  return (
    <>
      <TableHeader toggle={handleClickOpen} />

      <CustomDataGrid
        rows={teacherAttendance || []}
        columns={columns}
        loading={loading}
        sx={{
          height: '100%'
        }}
      />

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
