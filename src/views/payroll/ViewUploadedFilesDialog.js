import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  CircularProgress,
  Typography,
  Box
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEmployeePayroll, downloadTeacherPayrollslip, deleteteacherPayroll } from 'src/store/apps/users'
import { convertDate } from 'src/@core/utils/convert-date'
import { useTranslation } from 'react-i18next'
import Translations from 'src/layouts/components/Translations'
import CustomDialogDelete from 'src/@core/components/custom-delete'
import ViewWorksheet from 'src/views/worksheets/view'
import toast from 'react-hot-toast'

const ViewUploadedFilesDialog = ({ open, onClose, teacherId, teacherName }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { employeePayrollData, employeePayrollLoading } = useSelector(state => state.users)
  const [downloadFileLoading, setDownloadFileLoading] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [fileToDelete, setFileToDelete] = useState(null)

  useEffect(() => {
    if (open && teacherId) {
      dispatch(fetchEmployeePayroll(teacherId))
    }
  }, [open, teacherId, dispatch])

  const handleViewFile = async file => {
    setDownloadFileLoading(file?.id)
    try {
      const response = await dispatch(downloadTeacherPayrollslip(file?.id))
      if (response?.payload) {
        setSelectedFile({ file: response.payload, name: convertDate(file.timestamp) })
      }
    } catch (error) {
      toast.error(t('Error loading file'))
    } finally {
      setDownloadFileLoading(null)
    }
  }

  const handleDeleteClick = file => {
    setFileToDelete(file)
    setIsDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (fileToDelete) {
      try {
        await dispatch(deleteteacherPayroll({ id: fileToDelete.id, teacherId: teacherId }))
        toast.success(t('File deleted successfully'))
        dispatch(fetchEmployeePayroll(teacherId))
        setIsDeleteDialogOpen(false)
        setFileToDelete(null)
      } catch (error) {
        toast.error(t('Error deleting file'))
      }
    }
  }

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false)
    setFileToDelete(null)
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
        <DialogTitle>
          <Stack direction='row' justifyContent='space-between' alignItems='center'>
            <Typography variant='h6'>
              <Translations text={'Uploaded Files'} /> - {teacherName}
            </Typography>
            <IconButton onClick={onClose} size='small'>
              <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'>
                <path
                  fill='currentColor'
                  d='M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z'
                />
              </svg>
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {employeePayrollLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
              <CircularProgress />
            </Box>
          ) : employeePayrollData?.payrolls?.length > 0 ? (
            <List>
              {employeePayrollData.payrolls.map(file => (
                <ListItem
                  key={file.id}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                  secondaryAction={
                    <Stack direction='row' spacing={1}>
                      {downloadFileLoading === file.id ? (
                        <CircularProgress size={24} />
                      ) : (
                        <IconButton edge='end' onClick={() => handleViewFile(file)} size='small'>
                          <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'>
                            <g
                              fill='none'
                              stroke='currentColor'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth='2'
                            >
                              <path d='M10 12a2 2 0 1 0 4 0a2 2 0 0 0-4 0' />
                              <path d='M21 12q-3.6 6-9 6t-9-6q3.6-6 9-6t9 6' />
                            </g>
                          </svg>
                        </IconButton>
                      )}
                      <IconButton edge='end' onClick={() => handleDeleteClick(file)} size='small' color='error'>
                        <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'>
                          <path
                            fill='currentColor'
                            d='M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zM8 9h8v10H8zm7.5-5l-1-1h-5l-1 1H5v2h14V4z'
                          />
                        </svg>
                      </IconButton>
                    </Stack>
                  }
                >
                  <ListItemText
                    primary={<Translations text={'Payroll File'} />}
                    secondary={convertDate(file.timestamp)}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant='body2' color='text.secondary'>
                <Translations text={'No uploaded files found'} />
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <CustomDialogDelete
        open={isDeleteDialogOpen}
        handleClose={handleCloseDeleteDialog}
        decsription={`${t('Are you sure you want to delete the file from')} ${convertDate(fileToDelete?.timestamp)}?`}
        onDelete={handleDelete}
      />

      <ViewWorksheet selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
    </>
  )
}

export default ViewUploadedFilesDialog
