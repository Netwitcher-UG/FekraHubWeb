import { Fragment, useState } from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import { useTheme } from '@mui/material/styles'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import { Box } from '@mui/system'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined'
import { Typography } from '@mui/material'
import Translations from 'src/layouts/components/Translations'
import Icon from 'src/@core/components/icon'

const CustomDialogDelete = ({ open, handleClose, decsription, onDelete }) => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Fragment>
      <Dialog fullScreen={fullScreen} open={open} onClose={handleClose} aria-labelledby='responsive-dialog-title'>
        <DialogTitle id='responsive-dialog-title' sx={{}}>
          <Typography
            variant='h4'
            sx={{
              color: '#ce3446',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              '& svg': { mr: 2 }
            }}
          >
            <Translations text={'Alert'} />
            <Icon icon='mdi:alert-circle-outline' />
          </Typography>{' '}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{ textAlign: 'center', fontWeight: '400', fontSize: '16px', lineHeight: '25px', color: '#5A5A5A' }}
          >
            {decsription}
          </DialogContentText>
        </DialogContent>
        <DialogActions className='dialog-actions-dense' sx={{ textAlign: 'center', width: '100%' }}>
          <Box sx={{ textAlign: 'center', width: '100%', display: 'flex', justifyContent: 'center', gap: '24px' }}>
            <Button
              onClick={onDelete}
              sx={{
                width: '103px',
                height: '46px',
                borderRadius: '8px',
                padding: '8px 32px 8px 32px',
                backgroundColor: '#ce3446',
                color: '#F2F4F8',
                fontSize: '16px',
                fontWeight: '600',
                lineHeight: '30px',
                '&:hover': {
                  backgroundColor: '#ce3446'
                }
              }}
            >
              Delete
            </Button>

            <Button
              onClick={handleClose}
              sx={{
                width: '99px',
                height: '46px',
                borderRadius: '8px',
                padding: '8px 32px 8px 32px',
                backgroundColor: '#e0e0e0',
                color: '#5a5a5a',
                fontWeight: '600',
                fontSize: '16px',
                lineHeight: '30px',
                '&:hover': {
                  backgroundColor: '#e0e0e0'
                }
              }}
              variant='none'
            >
              cancel
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default CustomDialogDelete
