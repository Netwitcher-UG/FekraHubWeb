import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import usePayrollColumns from '../hook/usePayrollColumns'
import CustomDataGrid from 'src/@core/components/custom-grid'
import ViewUploadedFilesDialog from '../ViewUploadedFilesDialog'

const PayrollDataGrid = ({ rows, loading }) => {
  const { columns, isViewFilesDialogOpen, handleCloseViewFilesDialog, selectedTeacher } = usePayrollColumns()

  return (
    <>
      <CardContent></CardContent>
      <Divider sx={{ m: '0 !important' }} />

      <Box>
        <CustomDataGrid
          rows={rows || []}
          columns={columns}
          loading={loading}
          sx={{
            height: '100%'
          }}
        />
      </Box>

      <ViewUploadedFilesDialog
        open={isViewFilesDialogOpen}
        onClose={handleCloseViewFilesDialog}
        teacherId={selectedTeacher?.id}
        teacherName={selectedTeacher?.name}
      />
    </>
  )
}

export default PayrollDataGrid
