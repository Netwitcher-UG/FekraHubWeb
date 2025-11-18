import Box from '@mui/material/Box'
import Pagination from '@mui/material/Pagination'

const StudentsPaginate = ({ totalPages, currentPage, setCurrentPage }) => {
  const handlePageChange = (event, value) => {
    setCurrentPage(value)
  }
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 2, flexShrink: 0 }}>
      <Pagination count={totalPages || 1} page={currentPage} onChange={handlePageChange} color='primary' />
    </Box>
  )
}

export default StudentsPaginate
