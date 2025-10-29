import { useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'
import useStudentsApprovalsColumns from './useStudentsColumns'
import ApproveDialog from './ApproveDialog'
import RejectDialog from './RejectDialog'

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

const StudentsApprovalsDataGrid = ({
  store,

  courses
}) => {
  const [openApproveDialog, setOpenApproveDialog] = useState(false)
  const [openRejectDialog, setOpenRejectDialog] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)

  const handleApproveClick = student => {
    setSelectedStudent(student)
    setOpenApproveDialog(true)
  }

  const handleRejectClick = student => {
    setSelectedStudent(student)
    setOpenRejectDialog(true)
  }

  const handleCloseApproveDialog = () => {
    setOpenApproveDialog(false)
    setSelectedStudent(null)
  }

  const handleCloseRejectDialog = () => {
    setOpenRejectDialog(false)
    setSelectedStudent(null)
  }

  const { columns } = useStudentsApprovalsColumns(handleApproveClick, handleRejectClick)
  console.log(courses)
  return (
    <>
      <Box sx={{ height: 'calc(100vh - 250px)' }}>
        {store.studentsApprovalsLoading ? (
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
          <>
            <DataGrid
              rowHeight={62}
              rows={store?.studentsApprovals || []}
              columns={columns}
              hideFooter={true}
              disableRowSelectionOnClick
              pagination={true}
              sx={{
                // overflowY: 'scroll',
                overflowX: 'scroll',
                ...customScrollbarStyles,
                fontSize: '1rem'
              }}
            />
          </>
        )}
      </Box>
      <ApproveDialog
        open={openApproveDialog}
        handleClose={handleCloseApproveDialog}
        courses={courses}
        student={selectedStudent}
      />
      <RejectDialog open={openRejectDialog} handleClose={handleCloseRejectDialog} student={selectedStudent} />
    </>
  )
}

export default StudentsApprovalsDataGrid
