import { useState, useEffect } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
// import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'
import Alert from '@mui/material/Alert'
// import TableHeader from './TableHeader'
import { useDispatch } from 'react-redux'
import CustomDialogDelete from 'src/@core/components/custom-delete'
import ViewWorksheet from 'src/views/worksheets/view'
import usePayrollColumns from '../hook/usePayrollColumns'
import { useTranslation } from 'react-i18next'

const customScrollbarStyles = {
  '& ::-webkit-scrollbar': {
    height: 8
  },
  '& ::-webkit-scrollbar-thumb': {
    backgroundColor: '#888',
    borderRadius: 10,
    '&:hover': {
      backgroundColor: '#555'
    }
  }
}

const PayrollDataGrid = ({
  store,
  setValue,
  rows,
  value,
  handleFilter,
  selectedCourse,
  setSelectedCourse,
  handleRowClick,
  setCurrentPage,
  coursesData
}) => {
  console.log('🚀 ~ rows:', rows)
  const { t } = useTranslation()
  const handleCourseChange = (event, newValue) => {
    setCurrentPage(1)
    setAttendanceData([])
    setSelectedCourse(newValue ? newValue.value : '')
  }
  const dispatch = useDispatch()

  const {
    columns,
    attendanceData,
    setAttendanceData,
    selectedFile,
    setSelectedFile,
    isDialogOpen,
    handleDelete,
    handleCloseDialog,
    handleDeleteClick,
    drawerData,
    open,
    handleCloseDrawer,
    DeleteName
  } = usePayrollColumns()

  return (
    <>
      <CardContent></CardContent>
      <Divider sx={{ m: '0 !important' }} />

      <Box sx={{ height: 'calc(100vh - 250px)', width: '100%' }}>
        <>
          <DataGrid
            rowHeight={62}
            rows={rows || []}
            columns={columns}
            hideFooter={true}
            disableRowSelectionOnClick
            onRowClick={handleRowClick}
            pagination={true}
            sx={{
              // overflowY: 'scroll',
              overflowX: 'scroll',
              ...customScrollbarStyles,
              fontSize: '1rem'
            }}
          />
        </>
      </Box>

      <CustomDialogDelete
        open={isDialogOpen}
        handleClose={handleCloseDialog}
        decsription={`${t('Are you sure you want to delete file')} ${DeleteName} ? `}
        onDelete={handleDelete}
      />
      <ViewWorksheet selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
    </>
  )
}

export default PayrollDataGrid
