import { Card } from '@mui/material'
import { Box, Stack } from '@mui/system'
import React, { useEffect } from 'react'
import CustomDataGrid from 'src/@core/components/custom-datagrid'
import useCoursesColumns from '../hook/useCoursesColumns'
import CustomSearch from 'src/@core/components/custom-search'
import AddCourses from '../add'
import { useRouter } from 'next/router'
import CustomDialogDelete from 'src/@core/components/custom-delete'
import DrawerEdit from '../edit'
import CircularProgress from '@mui/material/CircularProgress'
import { useDispatch, useSelector } from 'react-redux'
import { fetchLocation } from 'src/store/apps/location'

export default function CoursesDataGrid({ rows, dataRooms, dataTeacher, SetSearch, status }) {
  const { columns, isDialogOpen, handleCloseDialog, handleDelete, drawerData, open, handleCloseDrawer, DeleteName } =
    useCoursesColumns()

  const { data: locationData, error } = useSelector(state => state.location)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchLocation(''))
  }, [dispatch])

  return (
    <>
      <Card>
        <Stack padding={4} direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
          <Box>
            <CustomSearch SetSearch={SetSearch} />
          </Box>
          <Box>
            <AddCourses dataRooms={dataRooms} dataTeacher={dataTeacher} />
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
        decsription={`Are you sure you want to delete the class ${DeleteName} ? `}
        onDelete={handleDelete}
      />
      {open && (
        <DrawerEdit
          open={open}
          handleCloseDrawer={handleCloseDrawer}
          dataDef={drawerData}
          locationData={locationData}
        />
      )}
    </>
  )
}
