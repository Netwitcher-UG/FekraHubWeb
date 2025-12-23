import { Card } from '@mui/material'
import { Box, Stack } from '@mui/system'
import React from 'react'
import CustomDataGrid from 'src/@core/components/custom-grid'
import useLocationColumns from '../hook/useLocationColumns'
import CustomDialogDelete from 'src/@core/components/custom-delete'
import DrawerEdit from '../edit'
import CustomSearch from 'src/@core/components/custom-search'
import AddLocation from '../add'
import { useTranslation } from 'react-i18next'

export default function LocationDataGrid({ rows, SetSearch, search, status }) {
  const { columns, isDialogOpen, handleCloseDialog, handleDelete, drawerData, open, handleCloseDrawer, DeleteName } =
    useLocationColumns()
  const { t } = useTranslation()
  return (
    <>
        <Stack
          padding={4}
          direction={{ xs: 'column', sm: 'row' }}
          spacing={5}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <Box>
            <CustomSearch SetSearch={SetSearch} value={search} />
          </Box>
          <Box>
            <AddLocation />
          </Box>
        </Stack>
      
          <CustomDataGrid
            columns={columns}
            rows={rows}
            loading={status === 'loading'}
            sx={{
              height: '100%'
            }}
          />
      
      <CustomDialogDelete
        open={isDialogOpen}
        handleClose={handleCloseDialog}
        decsription={`${t('Are you sure you want to delete the location')} ${DeleteName} ? `}
        onDelete={handleDelete}
      />
      {open && <DrawerEdit open={open} handleCloseDrawer={handleCloseDrawer} dataDef={drawerData} />}
    </>
  )
}
