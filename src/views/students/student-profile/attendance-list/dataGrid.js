import { useState } from 'react'
import Divider from '@mui/material/Divider'
import CustomDialogDelete from 'src/@core/components/custom-delete'
import TableHeader from './TableHeader'
import AddReord from './add-record'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import CustomDataGrid from 'src/@core/components/custom-grid'

const StudentAttendanceDataGrid = ({
  columns,
  store,
  handleCloseDialog,
  handleDelete,
  isDialogOpen,
  DeleteName,
  handleRowClick = null,
  byParent,
  studentId
}) => {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()
  const handleClickOpen = () => setOpen(true)
  const { attendanceStatuses } = useSelector(state => state.attendance)

  const loading = byParent ? store.childReportsLoading : store.loading
  const rows = (byParent ? [] : store) || []

  return (
    <>
      <Divider sx={{ m: '0 !important' }} />
      <TableHeader toggle={handleClickOpen} />

      <CustomDataGrid
        rows={rows}
        columns={columns}
        handleRowClick={handleRowClick}
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
      <AddReord open={open} setOpen={setOpen} attendanceStatuses={attendanceStatuses} studentId={studentId} />
    </>
  )
}

export default StudentAttendanceDataGrid
