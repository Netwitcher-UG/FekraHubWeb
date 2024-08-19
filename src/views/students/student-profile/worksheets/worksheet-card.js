// ** MUI Imports
import Card from '@mui/material/Card'
import { useState, useEffect } from 'react'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { convertDate } from 'src/@core/utils/convert-date'
import { useRouter } from 'next/router'
import { getChildWorksheetFile, DownloadUploadFile } from 'src/store/apps/worksheets'
import { useDispatch, useSelector } from 'react-redux'
// ** Custom Component Imports
import Icon from 'src/@core/components/icon'
import CircularProgress from '@mui/material/CircularProgress'
import CustomAvatar from 'src/@core/components/mui/avatar'
import toast from 'react-hot-toast'

import { Dialog, DialogContent, DialogTitle } from '@mui/material'

const WorksheetCard = props => {
  // ** Props
  const {
    worksheet,
    sx,
    byParent,
    avatarIcon = 'la:file-alt-solid',
    avatarSize = 80,
    avatarColor = 'secondary',
    avatarIconSize = '3.125rem'
  } = props

  const { id, date, fileName, typeUPload } = worksheet
  const [isHovered, setIsHovered] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [invoiceLoading, setInvoiceLoading] = useState(false)

  // ** Hook
  const theme = useTheme()
  const dispatch = useDispatch()

  const handleViewContract = async () => {
    setInvoiceLoading(true)
    const response = byParent ? await dispatch(getChildWorksheetFile(id)) : await dispatch(DownloadUploadFile(id))
    if (byParent ? response?.payload?.status == 200 : !response?.error) {
      setSelectedFile(byParent ? response?.payload?.data : response?.payload)
      setIsHovered(false)
    } else toast.error('Somthing went wrong !')
    setInvoiceLoading(false)
  }

  return (
    <Card sx={{ ...sx }}>
      <CardContent sx={{ pb: 0, display: 'flex', flexDirection: 'column' }}>
        <Grid sx={{ mb: 2.5, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', mb: 6 }}>
          {invoiceLoading ? (
            <CircularProgress size={50} />
          ) : (
            <CustomAvatar
              skin='light'
              color={isHovered ? 'primary' : avatarColor}
              sx={{ width: avatarSize, height: avatarSize, cursor: 'pointer' }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => handleViewContract()}
            >
              <Icon icon={isHovered ? 'hugeicons:view' : avatarIcon} fontSize={avatarIconSize} />
            </CustomAvatar>
          )}
        </Grid>

        <Typography variant='h6'>{fileName}</Typography>
        <Grid sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography variant='body2' sx={{ my: 0.5, display: 'flex', alignItems: 'center' }}>
            Date: {convertDate(date)}
          </Typography>
          <Typography variant='body2' sx={{ my: 0.5, display: 'flex', alignItems: 'center' }}>
            Type: {typeUPload}
          </Typography>
          {/* <Typography variant='body2' sx={{ my: 0.5, display: 'flex', alignItems: 'center' }}>
            Course: {courses?.name}
          </Typography> */}
        </Grid>
      </CardContent>

      <Dialog open={Boolean(selectedFile)} onClose={() => setSelectedFile(null)} maxWidth='xl' fullWidth>
        <DialogTitle>
          <Typography variant='h6'>{fileName}</Typography>
        </DialogTitle>
        <DialogContent>
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
            <iframe
              src={`data:application/pdf;base64,${selectedFile}`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              title={fileName}
            />
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default WorksheetCard
