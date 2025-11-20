import { useState, useEffect } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
// import CardContent from '@mui/material/CardContent'
// import Grid from '@mui/material/Grid'
// import AddRecord from './add-record'
import Divider from '@mui/material/Divider'
import CustomDialogDelete from 'src/@core/components/custom-delete'
// import TableHeader from './TableHeader'
// import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'
import useTeacherPayrollColumns from './hooks/useTeacherPayrollColumns'
import { useTranslation } from 'react-i18next'
import ViewPayrollSlip from './view'
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone'
import { uploadPaysilp } from 'src/store/apps/users'
import FileUploaderRestrictions from 'src/@core/components/inputs/FileUploaderRestrictions'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import Translations from 'src/layouts/components/Translations'
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

const TeacherPayrollDatagrid = ({ loading, teacherPayrollData, teacher }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  // const [open, setOpen] = useState(false)
  const [fileBase64, setFileBase64] = useState(null)
  const [fileName, setFileName] = useState(null)
  const [removeFile, setRemoveFile] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const handleUploadSlip = async () => {
    setIsUploading(true)
    try {
      const formData = new FormData()
      // Create a File object from the Blob to include the filename
      const file = new File([fileBase64], fileName || 'payroll.pdf', { type: 'application/pdf' })
      formData.append('file', file)
      formData.append('UserID', teacher)
      const response = await dispatch(uploadPaysilp({ data: formData, teacherId: teacher }))
      // Check the structure of response and handle messages accordingly
      const errorMessage = response?.payload?.data || 'Something went wrong, please try again!'
      const successMessage = response?.payload?.data || 'File uploaded successfully'

      if (response?.payload?.status == 400) {
        toast.error(errorMessage)
      } else if (response?.payload?.status == 200) {
        toast.success(<Translations text={successMessage} />, { duration: 1000 })
        setFileBase64(null)
        setFileName(null)
        setRemoveFile(true)
      } else {
        toast.error(errorMessage)
      }
    } catch (error) {
      toast.error('Error uploading file')
    } finally {
      setIsUploading(false)
    }
  }
  // const handleClickOpen = () => setOpen(true)
  const {
    columns,
    attendanceStatuses,
    isDialogOpen,
    DeleteName,
    handleCloseDialog,
    handleDelete,
    selectedFile,
    setSelectedFile,
    handleCloseViewDialog,
    isPdfLoading,
    isDeleting
  } = useTeacherPayrollColumns({ teacher })

  return (
    <>
      <DropzoneWrapper sx={{ mb: 4, width: '100%' }}>
        <FileUploaderRestrictions
          setFileBase64={setFileBase64}
          setFileName={setFileName}
          handleUpload={handleUploadSlip}
          removeFile={removeFile}
          setRemoveFile={setRemoveFile}
          loading={isUploading}
        />
      </DropzoneWrapper>
      {/* <TableHeader toggle={handleClickOpen} /> */}
      <Box sx={{ height: 500 }}>
        {loading ? (
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
          <DataGrid
            rowHeight={62}
            rows={teacherPayrollData?.teacherPayrolls || []}
            columns={columns}
            hideFooter={true}
            disableRowSelectionOnClick
            pagination={true}
            sx={{
              overflowY: 'scroll',
              overflowX: 'scroll',
              ...customScrollbarStyles,
              fontSize: '1rem'
            }}
          />
        )}
      </Box>
      <CustomDialogDelete
        open={isDialogOpen}
        handleClose={handleCloseDialog}
        decsription={`${t('Are you sure you want to delete payrollSlip For')} ${DeleteName} ? `}
        onDelete={handleDelete}
        loading={isDeleting}
      />
      {selectedFile && (
        <ViewPayrollSlip
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          isPdfLoading={isPdfLoading}
          onClose={handleCloseViewDialog}
        />
      )}
      {/* <AddRecord open={open} setOpen={setOpen} attendanceStatuses={attendanceStatuses} teacherId={teacher} /> */}
    </>
  )
}

export default TeacherPayrollDatagrid
