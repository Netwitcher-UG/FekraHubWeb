import { Card } from '@mui/material'
import { Box, Stack } from '@mui/system'
import React from 'react'
import CustomDataGrid from 'src/@core/components/custom-datagrid'
import useCoursesColumns from '../hook/useCoursesColumns'
import CustomSearch from 'src/@core/components/custom-search'
import AddCourses from '../add'
import { useRouter } from 'next/router'
import CustomDialogDelete from 'src/@core/components/custom-delete'
import DrawerEdit from '../edit'

export default function CoursesDataGrid({ rows, dataRooms, dataTeacher }) {
  const {
    columns,
    isDialogOpen,
    handleCloseDialog,
    handleDelete,
    drawerData,
    open,
    handleOpenDrawer,
    handleCloseDrawer,
    DeleteName
  } = useCoursesColumns()

  return (
    <>
      <Card sx={{}}>
        <Stack padding={4} direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
          <Box>
            <CustomSearch />
          </Box>
          <Box>
            <AddCourses dataRooms={dataRooms} dataTeacher={dataTeacher} />
          </Box>
        </Stack>
        <Box sx={{ width: '100%', height: '500px', display: 'flex', flexDirection: 'column' }}>
          <CustomDataGrid
            columns={columns}
            // sx={}
            rows={rows}
          />
        </Box>
      </Card>
      <CustomDialogDelete
        open={isDialogOpen}
        handleClose={handleCloseDialog}
        decsription={`Are you sure you want to delete the class ${DeleteName} ? `}
        onDelete={handleDelete}
      />
      {open && <DrawerEdit open={open} handleCloseDrawer={handleCloseDrawer} dataDef={drawerData} />}
    </>
  )
}
