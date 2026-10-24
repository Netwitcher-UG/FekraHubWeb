import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import CustomDataGrid from 'src/@core/components/custom-grid'

const StudentReportsDataGrid = ({
  columns,
  store,
  handleRowClick,
  byParent,
  currentPage,
  setCurrentPage,
  totalPages
}) => {
  const loading = byParent ? store.childReportsLoading : store.loading
  const rows = (byParent ? store?.childReports : store?.data?.reports) || []
  const paginationEnabled = !byParent

  return (
    <>
      <Divider sx={{ m: '0 !important' }} />
      <Box sx={{ height: 500, display: 'flex', flexDirection: 'column' }}>
        <CustomDataGrid
          rows={rows}
          columns={columns}
          handleRowClick={handleRowClick}
          loading={loading}
          pagination={paginationEnabled}
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          sx={{
            flex: 1,
            minHeight: 0
          }}
        />
      </Box>
    </>
  )
}

export default StudentReportsDataGrid
