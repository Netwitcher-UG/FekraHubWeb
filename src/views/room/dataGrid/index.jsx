import { Card } from '@mui/material'
import { Box, Stack } from '@mui/system'
import React from 'react'
import CustomDataGrid from 'src/@core/components/custom-grid'
import useRoomColumns from '../hook/useRoomColumns'
import CustomDialogDelete from 'src/@core/components/custom-delete'
import DrawerEdit from '../edit'
import CustomSearch from 'src/@core/components/custom-search'
import AddRoom from '../add'
import { useTranslation } from 'react-i18next'

export default function RoomDataGrid({ rows, SetSearch, status }) {
  const { columns, isDialogOpen, handleCloseDialog, handleDelete, drawerData, open, handleCloseDrawer, DeleteName } =
    useRoomColumns()
  const { t } = useTranslation()

  return (
    <>
      <Card>
      <Stack
          padding={4}
          direction={{ xs: 'column', sm: 'row' }}
          spacing={5}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <Box>
            <CustomSearch SetSearch={SetSearch} />
          </Box>
          <AddRoom />
        </Stack>

        <Box sx={{ height: 'calc(100vh - 255px)' }}>
          <CustomDataGrid
            columns={columns}
            rows={rows}
            loading={status === 'loading'}
            sx={{
              height: '100%'
            }}
          />
        </Box>
      </Card>
      <CustomDialogDelete
        open={isDialogOpen}
        handleClose={handleCloseDialog}
        decsription={`${t('Are you sure you want to delete the Room')} ${DeleteName} ? `}
        onDelete={handleDelete}
      />
      {open && <DrawerEdit open={open} handleCloseDrawer={handleCloseDrawer} dataDef={drawerData} />}
    </>
  )
}
