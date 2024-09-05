import {
  Autocomplete,
  Avatar,
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
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import DrawerReportSlip from './drawer-report-slip'
import React, { useEffect, useContext } from 'react'
import { acceptReport, unAcceptReport, exportReport } from 'src/store/apps/reports'
import Translations from 'src/layouts/components/Translations'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import { downloadBase64File } from 'src/@core/utils/download-base64'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { useTranslation } from 'react-i18next'

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
  const ability = useContext(AbilityContext)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { acceptLoading, unAcceptLoading, exportLoading } = useSelector(state => state.reports)

  const handleReportApprove = async () => {
    const response = await dispatch(acceptReport(rowData.id))

    if (response?.payload?.status != 200)
      toast.error(<Translations text={'Report did not approve try again !'} />, 1000)
    else if (response?.payload?.status == 200) {
      toast.success(<Translations text={'Report approved successfully'} />, 1000)
      handleCloseDrawer()
    } else toast.error('Something went wrong')
  }

  const handleReportDisapprove = async () => {
    const response = await dispatch(unAcceptReport(rowData.id))

    if (response?.payload?.status !== 200) {
      toast.error(t('Report did not disapprove try again !'), 1000)
    } else if (response?.payload?.status === 200) {
      toast.success(t('Report disapproved successfully'), 1000)
      handleCloseDrawer()
    } else {
      toast.error(t('Something went wrong'))
    }
  }

  const handleExportReport = async () => {
    const response = await dispatch(exportReport(rowData.id))

    if (response?.payload?.status !== 200) {
      toast.error(t('Export failed try again !'), 1000)
    } else if (response?.payload?.status === 200) {
      downloadBase64File(
        response.payload.data,
        `${rowData?.student?.firstName} ${rowData?.student?.lastName}-report.pdf`
      )
    } else {
      toast.error(t('Something went wrong'))
    }
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
          {t('Report Preview')}
        </Typography>
        {reportStatus(rowData?.improved)}
      </Header>
      <Divider variant='middle' />

      <Stack padding={4} sx={{ gap: '8px' }}>
        {ability.can('export', 'Report') && rowData?.improved == true && (
          <Button color='primary' disabled={exportLoading} onClick={() => handleExportReport()} variant='contained'>
            {exportLoading ? (
              <CircularProgress size={30} />
            ) : (
              <>
                <Box sx={{ mr: 2 }}>
                  <Icon fontSize='1.125rem' icon='ph:export-bold' />
                </Box>
                <Translations text={'Export'} />
              </>
            )}
          </Button>
        )}
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
            {ability.can('approve', 'Report') && (
              <Box>
                {rowData?.improved === null && (
                  <>
                    <Button
                      type='button'
                      color='success'
                      sx={{ m: 2 }}
                      variant='contained'
                      onClick={() => handleReportApprove()}
                      disabled={acceptLoading || unAcceptLoading}
                    >
                      {t('Approve')}
                    </Button>

                    <Button
                      type='button'
                      color='error'
                      variant='contained'
                      disabled={acceptLoading || unAcceptLoading}
                      onClick={() => handleReportDisapprove()}
                    >
                      {t('Disapprove')}
                    </Button>
                  </>
                )}
              </Box>
            )}
            <Button
              type='button'
              color='secondary'
              variant='outlined'
              disabled={acceptLoading || unAcceptLoading}
              onClick={handleCloseDrawer}
            >
              {t('Close')}
            </Button>
          </Stack>
        </>
      </Stack>
    </Drawer>
  )
}
