// toastUtils.js
import toast, { ErrorIcon } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

export const ShowErrorToast = (message, ErrorMessageApi) => {
  const { t } = useTranslation()
  return toast.error(t(message), {
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
