import React from 'react'
import Typography from '@mui/material/Typography'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'

export default function ViewPayrollSlip({ selectedFile, setSelectedFile }) {
  return (
    <Dialog open={Boolean(selectedFile)} onClose={() => setSelectedFile(null)} maxWidth='xl' fullWidth>
      <DialogTitle>
        <Typography variant='h6'>{selectedFile?.name} </Typography>
      </DialogTitle>
      <DialogContent>
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
