import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
const { useDropzone } = require('react-dropzone')
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'
const DropzoneWrapper = ({ row, onFileUpload }) => {
  const { t } = useTranslation()
  const [selectedFile, setSelectedFile] = useState(null)
  const onDrop = useCallback(
    acceptedFiles => {
      setSelectedFile(acceptedFiles[0])
      onFileUpload(acceptedFiles, row)
    },
    [onFileUpload, row]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'application/pdf' })

  return (
    <div
      {...getRootProps()}
      style={{ border: '1px dashed gray', padding: '10px', textAlign: 'center', fontSize: '0.5rem !important' }}
    >
      <input {...getInputProps()} />
      {selectedFile ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <InsertDriveFileOutlinedIcon size={24} style={{ marginRight: '10px', color: 'red' }} />
          <p>{selectedFile.name}</p>
        </div>
      ) : (
        <div>{isDragActive ? <p>{t('Drop the files here ...')}</p> : <p>{t('Drag & drop a PDF here')}</p>}</div>
      )}
    </div>
  )
}
export default DropzoneWrapper
