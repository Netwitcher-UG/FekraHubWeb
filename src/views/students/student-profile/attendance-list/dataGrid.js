import { useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
// import CardContent from '@mui/material/CardContent'
// import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
// import Typography from '@mui/material/Typography'
// import CustomTextField from 'src/@core/components/mui/text-field'
// import MenuItem from '@mui/material/MenuItem'
import { DataGrid } from '@mui/x-data-grid'
// import Translations from 'src/layouts/components/Translations'
// import CardHeader from '@mui/material/CardHeader'
import CustomDialogDelete from 'src/@core/components/custom-delete'
import TableHeader from './TableHeader'
import AddReord from './add-record'
import { useSelector } from 'react-redux'
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

const StudentAttendanceDataGrid = ({
  columns,
  store,
  handleCloseDialog,
  handleDelete,
  isDialogOpen,
  DeleteName,
  handleRowClick,
  byParent,
  studentId
}) => {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()
  const handleClickOpen = () => setOpen(true)
  const { attendanceStatuses } = useSelector(state => state.attendance)

  return (
    <>
      <Divider sx={{ m: '0 !important' }} />
      <TableHeader toggle={handleClickOpen} />
      <Box sx={{ height: 500 }}>
        {(byParent ? store.childReportsLoading : store.loading) ? (
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
            rows={(byParent ? [] : store) || []}
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
      <AddReord open={open} setOpen={setOpen} attendanceStatuses={attendanceStatuses} studentId={studentId} />
    </>
  )
}

export default StudentAttendanceDataGrid