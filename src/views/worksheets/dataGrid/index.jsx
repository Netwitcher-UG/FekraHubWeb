import { Card } from '@mui/material'
import { Box, Stack } from '@mui/system'
import React, { useEffect } from 'react'
import CustomDataGrid from 'src/@core/components/custom-datagrid'
import CircularProgress from '@mui/material/CircularProgress'
import CustomDialogDelete from 'src/@core/components/custom-delete'
import useWorksheetsColumns from '../hook/useWorksheetsColumns'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourses } from 'src/store/apps/courses'
import ViewWorksheet from '../view'
import { useTranslation } from 'react-i18next'
import AddWorksheets from '../add'

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
  const { t } = useTranslation()
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
            <AddWorksheets dataUploadType={dataUploadType} data={data} />
          </Box>
        </Stack>
        <Box sx={{ height: 'calc(100vh - 255px)' }}>
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
        decsription={`${t('Are you sure you want to delete the Worksheets')} ${DeleteName} ? `}
        onDelete={handleDelete}
      />

      <ViewWorksheet selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
    </>
  )
}
