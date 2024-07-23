import {
  Autocomplete,
  Avatar,
  Button,
  Checkbox,
  Chip,
  Divider,
  Drawer,
  Grid,
  Radio,
  TextField,
  Typography
} from '@mui/material'
import { Box, Stack } from '@mui/system'
import DrawerReportSlip from './drawer-report-slip'
import React, { useEffect } from 'react'
import { acceptReport, unAcceptReport } from 'src/store/apps/reports'
import Translations from 'src/layouts/components/Translations'
import toast from 'react-hot-toast'

import styled from '@emotion/styled'
import { useDispatch, useSelector } from 'react-redux'

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '24px',
  justifyContent: 'space-between',
  margin: '0px'
}))

export default function ReportPreviewDrawer({ open, handleCloseDrawer, rowData }) {
  const dispatch = useDispatch()
  const { acceptLoading, unAcceptLoading } = useSelector(state => state.reports)

  const handleReportApprove = async () => {
    const response = await dispatch(acceptReport(rowData.id))

    if (response?.payload?.status != 200)
      toast.error(<Translations text={'Report did not improved try again !'} />, 1000)
    else if (response?.payload?.status == 200) {
      toast.success(<Translations text={'Report approved successfully '} />, 1000)
      handleCloseDrawer()
    } else toast.error('Something went wrong')
  }

  const handleReportDisapprove = async () => {
    const response = await dispatch(unAcceptReport(rowData.id))

    if (response?.payload?.status != 200)
      toast.error(<Translations text={'Report did not disapproved try again !'} />, 1000)
    else if (response?.payload?.status == 200) {
      toast.success(<Translations text={'Report disapproved successfully '} />, 1000)
      handleCloseDrawer()
    } else toast.error('Something went wrong')
  }

  const reportStatus = imporved => {
    if (imporved === null) return <Chip label={<Translations text={'Not approved yet'} />} color='secondary' />
    else if (imporved === false) return <Chip label={<Translations text={'Disapproved'} />} color='error' />
    else if (imporved === true) return <Chip label={<Translations text={'Approved'} />} color='success' />
  }

  return (
    <Drawer
      open={open}
      anchor='lift'
      variant='temporary'
      onClose={handleCloseDrawer}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 400, sm: 600 } } }}
      PaperProps={{
        sx: {
          width: { xs: 400, sm: 600 }
        }
      }}
    >
      <Header>
        <Typography
          sx={{
            fontWeight: '800',
            fontSize: '22px'
          }}
        >
          Report Preview
        </Typography>
        {reportStatus(rowData?.improved)}
      </Header>
      <Divider variant='middle' />
      <Stack padding={4} sx={{ gap: '8px' }}>
        <>
          <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12} sm={12} lg={12}>
              <DrawerReportSlip data={rowData} />
            </Grid>
          </Grid>
          <Stack
            sx={{ p: theme => `${theme.spacing(3)} !important`, display: 'flex', justifyContent: 'space-between' }}
            direction={'row'}
            alignItems={'center'}
            justifyContent={'flex-start'}
            spacing={4}
          >
            <Box>
              {rowData.improved === null && (
                <>
                  <Button
                    type='button'
                    color='success'
                    sx={{ m: 2 }}
                    variant='contained'
                    onClick={() => handleReportApprove()}
                    disabled={acceptLoading || unAcceptLoading}
                  >
                    Approve
                  </Button>

                  <Button
                    type='button'
                    color='error'
                    variant='contained'
                    disabled={acceptLoading || unAcceptLoading}
                    onClick={() => handleReportDisapprove()}
                  >
                    Disapprove
                  </Button>
                </>
              )}
            </Box>
            <Button
              type='button'
              color='secondary'
              variant='outlined'
              disabled={acceptLoading || unAcceptLoading}
              onClick={handleCloseDrawer}
            >
              Close
            </Button>
          </Stack>
        </>
      </Stack>
    </Drawer>
  )
}
