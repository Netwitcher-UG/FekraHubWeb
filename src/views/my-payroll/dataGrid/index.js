import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import useMyPayrollColumns from '../hook/useMyPayrollColumns'
import CustomDataGrid from 'src/@core/components/custom-grid'
import ViewPayrollFile from '../view'

const MyPayrollDataGrid = ({ rows, loading }) => {
  const { columns, selectedFile, setSelectedFile, handleCloseViewDialog, isPdfLoading } = useMyPayrollColumns()

  return (
    <>
      <CardContent></CardContent>
      <Divider sx={{ m: '0 !important' }} />

      <CustomDataGrid
        rows={rows || []}
        columns={columns}
        loading={loading}
        sx={{
          height: '100%'
        }}
      />

      <ViewPayrollFile selectedFile={selectedFile} setSelectedFile={setSelectedFile} isPdfLoading={isPdfLoading} />
    </>
  )
}

export default MyPayrollDataGrid
