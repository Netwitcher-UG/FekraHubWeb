// toastUtils.js
import toast, { ErrorIcon } from 'react-hot-toast'

export const ShowErrorToast = (message, ErrorMessageApi) => {
  return toast.error(message,
    {
      position: 'top-right',
    style: {
      padding: '16px',
      color: '#CE3446',
      border: '1px solid #CE3446',
      backgroundColor: '#fff'
    },
    className: 'custom-toast',
    theme: 'colored',
    closeButton: false,
    progressStyle: {
      backgroundColor: 'var(--mui-palette-primary-main)'
    }
  })

}
