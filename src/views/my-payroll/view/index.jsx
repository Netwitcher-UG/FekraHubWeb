import React from 'react'
import Typography from '@mui/material/Typography'
import { Dialog, DialogContent, DialogTitle, CircularProgress, Box } from '@mui/material'

export default function ViewPayrollFile({ selectedFile, setSelectedFile, isPdfLoading }) {
  return (
    <Dialog open={Boolean(selectedFile)} onClose={() => setSelectedFile(null)} maxWidth='xl' fullWidth>
      <DialogTitle>
        <Typography variant='h6'>{selectedFile?.name} </Typography>
      </DialogTitle>
      
      <DialogContent>
        {isPdfLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
            <CircularProgress />
          </Box>
        ) : (
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
            <iframe
              src={`data:application/pdf;base64,${selectedFile?.file?.data ? selectedFile?.file?.data : selectedFile?.file}`}
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
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

