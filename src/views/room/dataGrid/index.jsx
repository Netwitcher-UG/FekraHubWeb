import { Card } from '@mui/material'
import { Box, Stack } from '@mui/system'
import React from 'react'
import CustomDataGrid from 'src/@core/components/custom-grid'
import useRoomColumns from '../hook/useRoomColumns'
import CustomDialogDelete from 'src/@core/components/custom-delete'
import DrawerEdit from '../edit'
// TODO: Uncomment when API endpoint supports search
// import CustomSearch from 'src/@core/components/custom-search'
import AddRoom from '../add'
import { useTranslation } from 'react-i18next'

// TODO: Uncomment when API endpoint supports search
// export default function RoomDataGrid({ rows, SetSearch, search, status }) {
export default function RoomDataGrid({ rows, status }) {
  const { columns, isDialogOpen, handleCloseDialog, handleDelete, drawerData, open, handleCloseDrawer, DeleteName } =
    useRoomColumns()
  const { t } = useTranslation()

  return (
    <>
      <Card>
      {/* TODO: Change justifyContent to 'space-between' when uncommenting search */}
      <Stack
          padding={4}
          direction={{ xs: 'column', sm: 'row' }}
          spacing={5}
          alignItems={'center'}
          justifyContent={'flex-end'}
        >
          {/* TODO: Uncomment when API endpoint supports search */}
          {/* <Box>
            <CustomSearch SetSearch={SetSearch} value={search} />
          </Box> */}
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
