import { Card } from '@mui/material'
import { Box, Stack } from '@mui/system'
import React from 'react'
import CustomDataGrid from 'src/@core/components/custom-datagrid'
import useLocationColumns from '../hook/useLocationColumns'
import CircularProgress from '@mui/material/CircularProgress'
import CustomDialogDelete from 'src/@core/components/custom-delete'
import DrawerEdit from '../edit'
import CustomSearch from 'src/@core/components/custom-search'
import AddLocation from '../add'

export default function LocationDataGrid({ rows, SetSearch, status }) {
  const { columns, isDialogOpen, handleCloseDialog, handleDelete, drawerData, open, handleCloseDrawer, DeleteName } =
    useLocationColumns()

  return (
    <>
      <Card>
        <Stack padding={4} direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
          <Box>
            <CustomSearch SetSearch={SetSearch} />
          </Box>
          <Box>
            <AddLocation />
          </Box>
        </Stack>
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
      <CustomDialogDelete
        open={isDialogOpen}
        handleClose={handleCloseDialog}
        decsription={`Are you sure you want to delete the location ${DeleteName} ? `}
        onDelete={handleDelete}
      />
      {open && <DrawerEdit open={open} handleCloseDrawer={handleCloseDrawer} dataDef={drawerData} />}
    </>
  )
}
