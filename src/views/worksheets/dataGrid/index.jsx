import { Box, Stack } from '@mui/system'
import React, { useEffect } from 'react'
import CustomDataGrid from 'src/@core/components/custom-grid'
import CustomDialogDelete from 'src/@core/components/custom-delete'
import useWorksheetsColumns from '../hook/useWorksheetsColumns'
import { useDispatch, useSelector } from 'react-redux'
import ViewWorksheet from '../view'
import { useTranslation } from 'react-i18next'
import AddWorksheets from '../add'
import { fetchCourses } from 'src/store/apps/students'

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
  const { coursesData, error } = useSelector(state => state.students)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchCourses(''))
  }, [dispatch])

  return (
    <>
 
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
            <AddWorksheets dataUploadType={dataUploadType} data={coursesData} />
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
        decsription={`${t('Are you sure you want to delete the Worksheets')} ${DeleteName} ? `}
        onDelete={handleDelete}
      />

      <ViewWorksheet selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
    </>
  )
}
