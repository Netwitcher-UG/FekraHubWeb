import { useState } from 'react'
import Box from '@mui/material/Box'
import useStudentsApprovalsColumns from './useStudentsApprovalsColumns'
import ApproveDialog from './ApproveDialog'
import RejectDialog from './RejectDialog'
import StudentDetailsDialog from './StudentDetailsDialog'
import CustomDataGrid from 'src/@core/components/custom-grid'

const StudentsApprovalsDataGrid = ({
  store,

  courses
}) => {
  const [openApproveDialog, setOpenApproveDialog] = useState(false)
  const [openRejectDialog, setOpenRejectDialog] = useState(false)
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
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

  const handleRowClick = params => {
    setSelectedStudent(params.row)
    setOpenDetailsDialog(true)
  }

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false)
    setSelectedStudent(null)
  }

  const { columns } = useStudentsApprovalsColumns(handleApproveClick, handleRejectClick)
  return (
    <>
      <Box>
        <CustomDataGrid
          rows={store?.studentsApprovals || []}
          columns={columns}
          loading={store.studentsApprovalsLoading}
          handleRowClick={handleRowClick}
          sx={{
            height: '100%',
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'action.hover'
            }
          }}
        />
      </Box>
      <ApproveDialog
        open={openApproveDialog}
        handleClose={handleCloseApproveDialog}
        courses={courses}
        student={selectedStudent}
      />
      <RejectDialog open={openRejectDialog} handleClose={handleCloseRejectDialog} student={selectedStudent} />
      <StudentDetailsDialog open={openDetailsDialog} handleClose={handleCloseDetailsDialog} student={selectedStudent} />
    </>
  )
}

export default StudentsApprovalsDataGrid
