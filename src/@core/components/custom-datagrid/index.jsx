import React from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Box } from '@mui/system'

const customScrollbarStyles = {
  '& ::-webkit-scrollbar': {
    height: 8
  },
  '& ::-webkit-scrollbar-thumb': {
    backgroundColor: '#888',
    borderRadius: 3,
    '&:hover': {
      backgroundColor: '#555'
    }
  }
}

const CustomDataGrid = ({ rows, columns, rowHeight, pageSize = 20 }) => {
  return (

      <DataGrid
        columns={columns}
        rows={rows || []}
        rowHeight={rowHeight}
        className='custom-data-grid'
        sx={{
          overflowY: 'scroll',
          overflowX: 'scroll',
          ...customScrollbarStyles,
          fontSize: '1rem',
          '& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell': {
            display: 'flex',
            alignItems: 'center'
          }
        }}
        hideFooter={true}
        disableRowSelectionOnClick
        pagination={true}
      />

  )
}

export default CustomDataGrid
