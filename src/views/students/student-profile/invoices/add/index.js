import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { Dialog, DialogActions, DialogContent, DialogTitle, Icon, IconButton, Typography } from '@mui/material';
import Translations from 'src/layouts/components/Translations';
import DropzoneWrapper from 'src/@core/utils/DropZone';
import styled from '@emotion/styled';
import { useDispatch } from 'react-redux';
import { AddStudentInvoiceFile } from 'src/store/apps/invoices';


const CustomCloseButton = styled(IconButton)(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))

export default function Add({student}) {
  console.log("🚀 ~ Add ~ student:", student)
  const [open, setOpen] = React.useState(false);
  const [selectedFile, setSelectedFile]= React.useState()
  const dispatch = useDispatch()

  const handleFileUpload = React.useCallback((acceptedFiles) => {
    setSelectedFile(acceptedFiles[0])
    console.log('File uploaded:', acceptedFiles);
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedFile(null);
  };

  const handleSaveData = () => {
    try {
      const formData = new FormData()
      formData.append('invoiceFile',selectedFile)
      formData.append('studentId',student)
dispatch(AddStudentInvoiceFile({formData:formData,id:student}))
      handleClose();
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div>

      <Box sx={{ marginY:'24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>

<Button  onClick={handleOpen} variant='contained' >

  <Translations text={'Add New Invoice'} />
</Button>
</Box>


      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogTitle id='customized-dialog-title' sx={{ p: 4 }}>
          <Typography variant='h4' sx={{ fontWeight: '900' }}>
            <Translations text={'Add Invoice'} />
          </Typography>
          <CustomCloseButton aria-label='close' onClick={handleClose}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: theme => `${theme.spacing(4)} !important`, border: 'none' ,width:'400px' }}>
        <DropzoneWrapper onFileUpload={handleFileUpload}  />
        </DialogContent>
        <DialogActions sx={{ p: theme => `${theme.spacing(3)} !important` }}>
          <Button type='button' variant='outlined' onClick={handleClose}>
            <Translations text={'cancel'} />
          </Button>
          <Button disabled={!selectedFile}  type='button' variant='contained' onClick={handleSaveData}>
            <Translations text={'Add'} />
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
