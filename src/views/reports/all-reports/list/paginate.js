import Box from '@mui/material/Box'
import Pagination from '@mui/material/Pagination'

const ReportsPaginate = ({ totalPages, currentPage, setCurrentPage }) => {
  const handlePageChange = (event, value) => {
    setCurrentPage(value)
  }
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
      <Pagination count={totalPages || 1} page={currentPage} onChange={handlePageChange} color='primary' />
    </Box>
  )
}

export default ReportsPaginate
