import React from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Box } from '@mui/system'

const CustomDataGrid = ({ rows, columns, rowHeight, pageSize = 20 }) => {
  return (
    <Box sx={{ width: '100%', height: '500px' }}>
      <DataGrid
        columns={columns}
        rows={rows || []}
        pageSize={pageSize}
        pageSizeOptions={[20]}
        rowHeight={rowHeight}
        className='custom-data-grid'
      />
    </Box>
  )
}

export default CustomDataGrid
