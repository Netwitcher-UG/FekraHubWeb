import React from 'react'
import Typography from '@mui/material/Typography'
import { Dialog, DialogContent, DialogTitle, Skeleton, Box } from '@mui/material'

const IMAGE_MIME_BY_EXT = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  bmp: 'image/bmp',
  svg: 'image/svg+xml',
  avif: 'image/avif',
  tif: 'image/tiff',
  tiff: 'image/tiff'
}

const detectMimeFromBase64 = value => {
  if (typeof value !== 'string') return null
  const data = value.replace(/^data:[^;]+;base64,/, '')
  if (data.startsWith('JVBERi')) return 'application/pdf'
  if (data.startsWith('/9j/')) return 'image/jpeg'
  if (data.startsWith('iVBORw0KGgo')) return 'image/png'
  if (data.startsWith('R0lGOD')) return 'image/gif'
  if (data.startsWith('UklGR')) return 'image/webp'
  if (data.startsWith('Qk')) return 'image/bmp'

  return null
}

export const resolveInvoiceMime = (fileName, file) => {
  const ext = fileName?.split('.').pop()?.toLowerCase()
  if (ext === 'pdf') return 'application/pdf'
  if (IMAGE_MIME_BY_EXT[ext]) return IMAGE_MIME_BY_EXT[ext]

  return detectMimeFromBase64(file) || 'application/pdf'
}

const toDataUrl = (mime, value) => {
  if (typeof value !== 'string') return ''
  if (value.startsWith('data:')) return value

  return `data:${mime};base64,${value}`
}

export function InvoiceFilePreview({ file, name, title, minHeight = '600px' }) {
  const mime = resolveInvoiceMime(name, file)
  const src = toDataUrl(mime, file)
  const isImage = mime.startsWith('image/')
  const frameTitle = title || name || 'Invoice'

  return (
    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, minHeight }}>
      {isImage ? (
        <img
          src={src}
          alt={frameTitle}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      ) : (
        <iframe
          src={src}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none'
          }}
          title={frameTitle}
        />
      )}
    </div>
  )
}

export default function ViewInvoice({ selectedFile, isPdfLoading, onClose }) {
  return (
    <Dialog open={Boolean(selectedFile)} onClose={onClose} maxWidth='xl' fullWidth>
      <DialogTitle>
        <Typography variant='h6'>{selectedFile?.name} </Typography>
      </DialogTitle>
      <DialogContent>
        {isPdfLoading || !selectedFile?.file ? (
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, minHeight: '600px' }}>
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
          </div>
        ) : (
          <InvoiceFilePreview file={selectedFile.file} name={selectedFile.name} title={selectedFile.name} />
        )}
      </DialogContent>
    </Dialog>
  )
}
