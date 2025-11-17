import { Fragment, useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import Translations from 'src/layouts/components/Translations'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import toast, { Toaster } from 'react-hot-toast'
import { useDropzone } from 'react-dropzone'

const FileUploaderRestrictions = ({
  setFileBase64, // You can rename this to reflect the binary nature if needed
  setFileName,
  setValue,
  setError,
  removeFile,
  setRemoveFile,
  handleUpload,
  inputDisabled = false,
  loading = false
}) => {
  // ** State
  const [file, setFile] = useState(null)
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    if (removeFile) {
      handleRemoveFile()
      setRemoveFile(false)
    }
  }, [removeFile])

  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    maxSize: 10000000, // 10 MB
    accept: '*', // Adjust according to allowed file types
    disabled: loading || inputDisabled,
    onDrop: acceptedFiles => {
      setShowError(false)
      const newFile = acceptedFiles[0]
      if (newFile) {
        setFile(newFile)

        // Use FileReader to read the file as binary (ArrayBuffer)
        const reader = new FileReader()
        reader.onloadend = () => {
          const binaryString = reader.result // This will be an ArrayBuffer (binary data)
          setFileBase64(binaryString) // Set the binary data in state
          setFileName(newFile.name)
          //   setValue('attach', newFile)
        }

        // Read file as binary (ArrayBuffer)
        reader.readAsArrayBuffer(newFile)

        // Reset any previous errors
        // setError('attach', {
        //   type: 'manual',
        //   message: ''
        // })
      }
    },
    onDropRejected: () => {
      setShowError(true)
      // Handle rejected files (size or file type error)
    }
  })

  const renderFilePreview = file => {
    if (file.type.startsWith('image')) {
      return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file)} />
    } else {
      return <Icon icon='tabler:file-description' />
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setFileBase64(null) // Clear the binary data
    setFileName(null) // Clear file name
    // Reset the value and error (if using a form library)
    // setValue('attach', null)
    // setError('attach', {
    //   type: 'manual',
    //   message: ''
    // })
  }

  return (
    <Fragment>
      <div
        style={{
          width: '100%',
          minHeight: 'auto',
          height: '10rem',
          opacity: loading ? 0.6 : 1,
          pointerEvents: loading ? 'none' : 'auto',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
        {...(inputDisabled || loading ? {} : getRootProps())}
        className='dropzone'
      >
        <input {...getInputProps()} disabled={inputDisabled || loading} />
        <Box sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <Box
            sx={{
              mb: 7.75,
              width: 48,
              height: 48,
              display: 'flex',
              borderRadius: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.08)`
            }}
          >
            <Icon icon='tabler:upload' fontSize='1.75rem' />
          </Box>
          <Typography variant='h4' sx={{ mb: 2.5 }}>
            <Translations text={'Drop file here or click to upload.'} />
          </Typography>
          <Typography sx={{ pb: 2, color: 'text.secondary' }}>
            <Translations text={'Max 1 file and max size of 2 MB'} />
          </Typography>
        </Box>
      </div>
      {file && (
        <Fragment>
          <List>
            <ListItem key={file.name}>
              <div className='file-details'>
                <div className='file-preview'>{renderFilePreview(file)}</div>
                <div>
                  <Typography className='file-name'>{file.name}</Typography>
                  <Typography className='file-size' variant='body2'>
                    {Math.round(file.size / 100) / 10 > 1000
                      ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
                      : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
                  </Typography>
                </div>
              </div>
              <IconButton onClick={handleRemoveFile} disabled={loading}>
                <Icon icon='tabler:x' fontSize={20} />
              </IconButton>
            </ListItem>
          </List>
          <div className='buttons'>
            <Button color='error' variant='outlined' onClick={handleRemoveFile} disabled={loading}>
              <Translations text={'Remove'} />
            </Button>
            <Button type='submit' sx={{ mr: 2 }} variant='contained' onClick={handleUpload} disabled={loading}>
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={16} sx={{ color: 'inherit' }} />
                  <Translations text={'Uploading...'} />
                </Box>
              ) : (
                <Translations text={'Upload'} />
              )}
            </Button>
          </div>
        </Fragment>
      )}
      {showError && (
        <Typography sx={{ mb: 2.5, color: 'red', textAlign: 'center' }}>
          <Translations text={'You can only upload 1 file & maximum size of 10 MB'} />
        </Typography>
      )}
    </Fragment>
  )
}

export default FileUploaderRestrictions
