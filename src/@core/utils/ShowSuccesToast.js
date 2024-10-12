// toastUtils.js
import { GridCheckCircleIcon } from '@mui/x-data-grid'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

export const ShowSuccessToast = (message, ErrorMessageApi) => {
  const { t } = useTranslation()
  return toast.success(t(message), {
    style: {
      padding: '16px',
      color: '#F2F4F8)',
      border: '1px solid #32cd32',
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
