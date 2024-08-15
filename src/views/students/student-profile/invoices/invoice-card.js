// ** MUI Imports
import Card from '@mui/material/Card'
import { useState, useEffect } from 'react'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { convertDate } from 'src/@core/utils/convert-date'
import { useRouter } from 'next/router'
import { getChildInvoiceFile, getStudentInvoiceFile } from 'src/store/apps/invoices'
import { useDispatch, useSelector } from 'react-redux'
// ** Custom Component Imports
import Icon from 'src/@core/components/icon'
import CircularProgress from '@mui/material/CircularProgress'
import CustomAvatar from 'src/@core/components/mui/avatar'
import toast from 'react-hot-toast'

import { Dialog, DialogContent, DialogTitle } from '@mui/material'

const InvoiceCard = props => {
  // ** Props
  const {
    invoice,
    sx,
    byParent,
    avatarIcon = 'la:file-invoice-dollar',
    avatarSize = 100,
    avatarColor = 'secondary',
    avatarIconSize = '3.625rem'
  } = props

  const { id, date } = invoice
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [invoiceLoading, setInvoiceLoading] = useState(false)

  // ** Hook
  const theme = useTheme()
  const dispatch = useDispatch()

  const handleViewContract = async () => {
    setInvoiceLoading(true)
    const response = byParent ? await dispatch(getChildInvoiceFile(id)) : await dispatch(getStudentInvoiceFile(id))
    if (response?.payload?.status == 200) {
      setSelectedFile(response?.payload?.data)
      setIsHovered(false)
    } else toast.error('Somthing went wrong !')
    setInvoiceLoading(false)
  }

  return (
    <Card sx={{ ...sx }}>
      <CardContent sx={{ pb: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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

        <Typography variant='h6'>{convertDate(date)}</Typography>
      </CardContent>

      <Dialog open={Boolean(selectedFile)} onClose={() => setSelectedFile(null)} maxWidth='xl' fullWidth>
        <DialogTitle>
          <Typography variant='h6'>{convertDate(date)} Invoice</Typography>
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
              title={`${convertDate(date)} Contract`}
            />
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default InvoiceCard
