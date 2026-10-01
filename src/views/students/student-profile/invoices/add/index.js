import { useState } from 'react'
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone'
import { AddStudentInvoiceFile } from 'src/store/apps/invoices'
import FileUploaderRestrictions from 'src/@core/components/inputs/FileUploaderRestrictions'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import Translations from 'src/layouts/components/Translations'

const invoiceAccept = {
  'application/pdf': ['.pdf'],
  'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp']
}

const mimeFromName = name => {
  const ext = name?.split('.').pop()?.toLowerCase()
  if (ext === 'pdf') return 'application/pdf'
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg'
  if (ext === 'png') return 'image/png'
  if (ext === 'gif') return 'image/gif'
  if (ext === 'webp') return 'image/webp'
  if (ext === 'bmp') return 'image/bmp'

  return ''
}

export default function Add({ student }) {
  const dispatch = useDispatch()
  const [fileBase64, setFileBase64] = useState(null)
  const [fileName, setFileName] = useState(null)
  const [fileType, setFileType] = useState(null)
  const [removeFile, setRemoveFile] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleUploadInvoice = async () => {
    setIsUploading(true)
    try {
      const formData = new FormData()
      const type = fileType || mimeFromName(fileName) || 'application/octet-stream'
      const file = new File([fileBase64], fileName || 'invoice', { type })
      formData.append('InvoiceFile', file)
      formData.append('studentId', student)

      const response = await dispatch(AddStudentInvoiceFile({ formData: formData, id: student }))
      // Check the structure of response and handle messages accordingly
      const errorMessage = response?.payload?.data || 'Something went wrong, please try again!'
      const successMessage = response?.payload?.data || 'File uploaded successfully'

      if (response?.payload?.status == 400 || response?.error) {
        toast.error(errorMessage)
      } else if (response?.payload?.status == 200 || response?.type?.includes('fulfilled')) {
        toast.success(<Translations text={successMessage} />, { duration: 1000 })
        setFileBase64(null)
        setFileName(null)
        setFileType(null)
        setRemoveFile(true)
      } else {
        toast.error(errorMessage)
      }
    } catch (error) {
      toast.error('Error uploading file')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <DropzoneWrapper sx={{ mt: 4, mb: 6, width: '100%' }}>
      <FileUploaderRestrictions
        setFileBase64={setFileBase64}
        setFileName={setFileName}
        setFileType={setFileType}
        handleUpload={handleUploadInvoice}
        removeFile={removeFile}
        setRemoveFile={setRemoveFile}
        loading={isUploading}
        accept={invoiceAccept}
        description='Images and PDF only. Max 1 file and max size of 2 MB'
        errorText='You can only upload images or PDF files'
      />
    </DropzoneWrapper>
  )
}
