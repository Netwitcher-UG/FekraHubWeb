import { Card } from '@mui/material'
import { Box, Stack } from '@mui/system'
import React, { useEffect } from 'react'
import CustomDataGrid from 'src/@core/components/custom-datagrid'
import CircularProgress from '@mui/material/CircularProgress'
import CustomDialogDelete from 'src/@core/components/custom-delete'
import AdduWorksheets from '../add'
import useWorksheetsColumns from '../hook/useWorksheetsColumns'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourses } from 'src/store/apps/courses'
import ViewWorksheet from '../view'

export default function WorksheetsDataGrid({ rows, SetSearch, status, dataUploadType }) {
  const {
    columns,
    isDialogOpen,
    handleCloseDialog,
    handleDelete,
    drawerData,
    open,
    handleCloseDrawer,
    DeleteName,
    selectedFile,
    setSelectedFile
  } = useWorksheetsColumns()

  const { data, error } = useSelector(state => state.courses)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchCourses(''))
  }, [dispatch])

  return (
    <>
      <Card>
        <Stack>
          <Box
            sx={{
              py: 4,
              px: 6,
              rowGap: 2,
              columnGap: 4,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'flex-end'
            }}
          >
            <AdduWorksheets dataUploadType={dataUploadType} data={data} />
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
        decsription={`Are you sure you want to delete the Worksheets ${DeleteName} ? `}
        onDelete={handleDelete}
      />

      <ViewWorksheet selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
    </>
  )
}
