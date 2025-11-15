import { useCallback, useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
const { useDropzone } = require('react-dropzone')
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'
import { Box } from '@mui/material'

const DropzoneWrapper = ({ row, onFileUpload, uploadSuccess }) => {
  const { t } = useTranslation()
  const [selectedFile, setSelectedFile] = useState(null)
  const [isHovered, setIsHovered] = useState(false)
  const prevUploadSuccessRef = useRef(0)

  // Clear file name when upload is successful (only when uploadSuccess increases)
  useEffect(() => {
    if (uploadSuccess > prevUploadSuccessRef.current) {
      setSelectedFile(null)
      prevUploadSuccessRef.current = uploadSuccess
    }
  }, [uploadSuccess])

  const onDrop = useCallback(
    acceptedFiles => {
      setSelectedFile(acceptedFiles[0])
      onFileUpload(acceptedFiles, row)
    },
    [onFileUpload, row]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'application/pdf' })

  const showIndicators = isDragActive || isHovered

  return (
    <Box
      {...getRootProps()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: 'relative',
        width: '100%',
        padding: '10px',
        textAlign: 'center',
        fontSize: '0.875rem',
        cursor: 'pointer',
        minHeight: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.3s ease',
        backgroundColor: isDragActive ? 'action.hover' : 'transparent',
        '&:hover': {
          backgroundColor: 'action.hover'
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: '3px',
          height: showIndicators ? '80%' : '0%',
          backgroundColor: 'primary.main',
          borderRadius: '0 2px 2px 0',
          transition: 'height 0.3s ease, opacity 0.3s ease',
          opacity: showIndicators ? 1 : 0,
          animation: showIndicators ? 'pulse 1.5s ease-in-out infinite' : 'none'
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: '3px',
          height: showIndicators ? '80%' : '0%',
          backgroundColor: 'primary.main',
          borderRadius: '2px 0 0 2px',
          transition: 'height 0.3s ease, opacity 0.3s ease',
          opacity: showIndicators ? 1 : 0,
          animation: showIndicators ? 'pulse 1.5s ease-in-out infinite' : 'none'
        },
        '@keyframes pulse': {
          '0%, 100%': {
            opacity: 1
          },
          '50%': {
            opacity: 0.6
          }
        }
      }}
    >
      <input {...getInputProps()} />
      {selectedFile ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            width: '100%',
            maxWidth: '100%',
            overflow: 'hidden'
          }}
        >
          <InsertDriveFileOutlinedIcon sx={{ color: 'error.main', fontSize: 24, flexShrink: 0 }} />
          <Box
            component='p'
            sx={{
              margin: 0,
              fontSize: '0.875rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 'calc(100% - 40px)',
              minWidth: 0
            }}
            title={selectedFile.name}
          >
            {selectedFile.name}
          </Box>
        </Box>
      ) : (
        <Box component='div'>
          {isDragActive ? (
            <Box component='p' sx={{ margin: 0, color: 'primary.main', fontWeight: 500 }}>
              {t('Drop the files here ...')}
            </Box>
          ) : (
            <Box component='p' sx={{ margin: 0, color: 'text.secondary' }}>
              {t('Drag & drop a PDF here')}
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}
export default DropzoneWrapper
