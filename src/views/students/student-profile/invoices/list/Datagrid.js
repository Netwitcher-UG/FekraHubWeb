import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import useStudentInvoiceColumns from '../hooks/useStudentsInvoiceColumns'
import CustomDialogDelete from 'src/@core/components/custom-delete'
import ViewInvoice from '../view'
import CustomDataGrid from 'src/@core/components/custom-grid'

const StudentsInvoiceDataGrid = ({ invoice, handleRowClick = null }) => {
  const {
    columns,
    selectedFile,
    setSelectedFile,
    isDialogOpen,
    handleDelete,
    handleCloseDialog,
    DeleteName,
    handleCloseViewDialog,
    isPdfLoading,
    isDeleting
  } = useStudentInvoiceColumns()

  return (
    <>
      <Divider sx={{ m: '0 !important' }} />
      <Box sx={{ height: 'calc(100vh - 250px)', width: '100%', display: 'flex', flexDirection: 'column' }}>
        <CustomDataGrid
          rows={invoice || []}
          columns={columns}
          handleRowClick={handleRowClick}
          loading={false}
          sx={{
            flex: 1,
            minHeight: 0
          }}
        />
      </Box>
      <CustomDialogDelete
        open={isDialogOpen}
        handleClose={handleCloseDialog}
        decsription={`Are you sure you want to delete the invoice ${DeleteName} ? `}
        onDelete={handleDelete}
        loading={isDeleting}
      />
      {selectedFile && (
        <ViewInvoice
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          isPdfLoading={isPdfLoading}
          onClose={handleCloseViewDialog}
        />
      )}
    </>
  )
}

export default StudentsInvoiceDataGrid
