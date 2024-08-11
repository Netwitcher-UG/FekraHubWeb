// toastUtils.js
import toast, { ErrorIcon } from 'react-hot-toast'

export const ShowErrorToast = (message, ErrorMessageApi) => {
  toast.error(message, {
    icon: <ErrorIcon />,
    // style: {
    //   border: '1px solid #CE3446',
    //   padding: '16px',
    //   color: '#F2F4F8',
    //   background: '#CE3446',
    //   borderRadius: '8px',
    //   marginRight: '8px',
    //   justifyContent: 'right',
    //   width: '100%',
    //   animation: 'custom-exit 1s ease',
    //   boxShadow: '0px 4px 9px 0px rgba(0, 0, 0, 0.06)'
    // },
    iconTheme: {
      primary: '#F2F4F8',
      secondary: '#CE3446'
    }
    // className: 'custom-toast'
  })
}
