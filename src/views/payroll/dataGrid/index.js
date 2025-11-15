import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Skeleton from '@mui/material/Skeleton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import usePayrollColumns from '../hook/usePayrollColumns'
import CustomDataGrid from 'src/@core/components/custom-datagrid'
import ViewUploadedFilesDialog from '../ViewUploadedFilesDialog'

const PayrollDataGrid = ({ rows, loading }) => {
  const { columns, isViewFilesDialogOpen, handleCloseViewFilesDialog, selectedTeacher } = usePayrollColumns()

  const SkeletonRow = () => (
    <TableRow>
      <TableCell>
        <Skeleton variant='text' width={150} height={40} />
      </TableCell>
      <TableCell>
        <Skeleton variant='text' width={120} height={40} />
      </TableCell>
      <TableCell>
        <Skeleton variant='rectangular' width={400} height={60} sx={{ borderRadius: 1 }} />
      </TableCell>
      <TableCell>
        <Skeleton variant='circular' width={40} height={40} />
      </TableCell>
    </TableRow>
  )

  return (
    <>
      <CardContent></CardContent>
      <Divider sx={{ m: '0 !important' }} />

      <Box sx={{ height: 'calc(100vh - 250px)', width: '100%' }}>
        {loading ? (
          <TableContainer component={Paper} sx={{ boxShadow: 'none', height: '100%' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Skeleton variant='text' width={150} height={10} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant='text' width={120} height={10} />
                  </TableCell>
                  <TableCell align='center'>
                    <Skeleton variant='text' width={100} height={10} sx={{ mx: 'auto' }} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant='text' width={80} height={10} />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...Array(5)].map((_, index) => (
                  <SkeletonRow key={index} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <CustomDataGrid rowHeight={62} rows={rows || []} columns={columns} />
        )}
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
