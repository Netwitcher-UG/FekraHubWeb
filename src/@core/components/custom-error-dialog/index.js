import { Fragment } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Icon from 'src/@core/components/icon'
import Translations from 'src/layouts/components/Translations'

const CustomErrorDialog = ({ open, onClose, title, message }) => {
  return (
    <Fragment>
      <Dialog open={open} onClose={onClose} maxWidth='xs' fullWidth>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(6)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`],
            textAlign: 'center'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column'
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: 'error.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 4
              }}
            >
              <Icon icon='tabler:x' fontSize='3.5rem' sx={{ color: 'white' }} />
            </Box>
            <Typography variant='h4' sx={{ mb: 3, fontWeight: 700, color: 'text.primary' }}>
              {title ? <Translations text={title} /> : <Translations text={'Error!'} />}
            </Typography>
            <Typography sx={{ mb: 2, color: 'text.secondary', fontSize: '16px', lineHeight: '25px' }}>
              {message}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(6)} !important`, `${theme.spacing(8)} !important`]
          }}
        >
          <Button
            onClick={onClose}
            variant='contained'
            sx={{
              backgroundColor: '#6c757d',
              color: 'white',
              minWidth: 100,
              '&:hover': {
                backgroundColor: '#5a6268'
              }
            }}
          >
            <Translations text={'OK'} />
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default CustomErrorDialog
