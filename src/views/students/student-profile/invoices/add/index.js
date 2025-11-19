import { useState } from 'react'
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone'
import { AddStudentInvoiceFile } from 'src/store/apps/invoices'
import FileUploaderRestrictions from 'src/@core/components/inputs/FileUploaderRestrictions'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import Translations from 'src/layouts/components/Translations'

export default function Add({ student }) {
  const dispatch = useDispatch()
  const [fileBase64, setFileBase64] = useState(null)
  const [fileName, setFileName] = useState(null)
  const [removeFile, setRemoveFile] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleUploadInvoice = async () => {
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('invoiceFile', new Blob([fileBase64]))
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
    <DropzoneWrapper sx={{ mt: 4, width: '100%' }}>
      <FileUploaderRestrictions
        setFileBase64={setFileBase64}
        setFileName={setFileName}
        handleUpload={handleUploadInvoice}
        removeFile={removeFile}
        setRemoveFile={setRemoveFile}
        loading={isUploading}
      />
    </DropzoneWrapper>
  )
}
