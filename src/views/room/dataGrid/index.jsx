import { Card } from '@mui/material'
import { Box, Stack } from '@mui/system'
import React from 'react'
import CustomDataGrid from 'src/@core/components/custom-datagrid'
import useRoomColumns from '../hook/useRoomColumns'
import CircularProgress from '@mui/material/CircularProgress'

export default function RoomDataGrid({ rows, dataRooms, dataTeacher, SetSearch, status }) {
  const { columns } = useRoomColumns()

  return (
    <>
      <Card>
        <Box sx={{ height: 500 }}>
          {status === 'loading' ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '90%',
                zIndex: 10
              }}
            >
              <CircularProgress size={100} />
            </Box>
          ) : (
            <CustomDataGrid columns={columns} rowHeight={62} rows={rows} />
          )}
        </Box>
      </Card>
    </>
  )
}
