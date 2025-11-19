import React from 'react'
import Typography from '@mui/material/Typography'
import { Dialog, DialogContent, DialogTitle, Skeleton, Box } from '@mui/material'

export default function ViewInvoice({ selectedFile, setSelectedFile, isPdfLoading, onClose }) {
  return (
    <Dialog open={Boolean(selectedFile)} onClose={onClose} maxWidth='xl' fullWidth>
      <DialogTitle>
        <Typography variant='h6'>{selectedFile?.name} </Typography>
      </DialogTitle>
      <DialogContent>
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, minHeight: '600px' }}>
          {isPdfLoading || !selectedFile?.file ? (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }}
            >
              <Skeleton variant='rectangular' width='100%' height='100%' animation='wave' />
            </Box>
          ) : (
            <iframe
              src={`data:application/pdf;base64,${selectedFile?.file}`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              title={selectedFile?.name}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
