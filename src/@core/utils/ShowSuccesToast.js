// toastUtils.js
import { GridCheckCircleIcon } from '@mui/x-data-grid'
import toast from 'react-hot-toast'

export const ShowSuccessToast = (message, ErrorMessageApi) => {
  toast.error(message, {
    icon: <GridCheckCircleIcon />,
    style: {
      border: '1px solid #32cd32',
      padding: '16px',
      color: '#F2F4F8',
      background: '#32cd32',
      borderRadius: '8px',
      marginRight: '8px',
      justifyContent: 'right',
      width: '100%',
      animation: 'custom-exit 1s ease',
      boxShadow: '0px 4px 9px 0px rgba(0, 0, 0, 0.06)'
    },
    iconTheme: {
      primary: '#F2F4F8',
      secondary: '#32cd32'
    },
     className: 'custom-toast'
  })
}
