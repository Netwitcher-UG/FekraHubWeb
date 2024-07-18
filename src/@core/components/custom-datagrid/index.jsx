import React from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Box } from '@mui/system'

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
        sx={{
          overflowY: 'scroll',
          overflowX: 'scroll',
          ...customScrollbarStyles,
          fontSize: '1rem'
        }}
        hideFooter={true}
        disableRowSelectionOnClick
        pagination={true}
      />
    </Box>
  )
}

export default CustomDataGrid
