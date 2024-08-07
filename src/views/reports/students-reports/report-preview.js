// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import Divider from '@mui/material/Divider'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import TableContainer from '@mui/material/TableContainer'
import TableCell from '@mui/material/TableCell'
import Translations from 'src/layouts/components/Translations'
import { convertDate } from 'src/@core/utils/convert-date'
import CircularProgress from '@mui/material/CircularProgress'
import { exportReport } from 'src/store/apps/reports'
import { Button } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { downloadBase64File } from 'src/@core/utils/download-base64'
import { AbilityContext } from 'src/layouts/components/acl/Can'
// ** Configs
import themeConfig from 'src/configs/themeConfig'

const MUITableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 0,
  paddingLeft: '0 !important',
  paddingRight: '0 !important',
  '&:not(:last-child)': {
    paddingRight: `${theme.spacing(2)} !important`
  }
}))

const PreviewReport = ({ data }) => {
  const ability = useContext(AbilityContext)
  // ** Hook
  const singleElement = data?.reports ? (data?.reports[0] ? data?.reports[0] : data?.reports) : null

  const parsedData = JSON.parse(singleElement?.data)

  const parsedDataArray = Object.entries(parsedData).map(([key, value]) => ({ key, value }))
  const { exportLoading } = useSelector(state => state.reports)
  const dispatch = useDispatch()
  const handleExportReport = async () => {
    const response = await dispatch(exportReport(singleElement.id))

    if (response?.payload?.status != 200) {
      toast.error(<Translations text={'Export failed try again !'} />, 1000)
    } else if (response?.payload?.status == 200) {
      downloadBase64File(
        response.payload.data,
        `${singleElement?.student?.firstName} ${singleElement?.student?.lastName}-report.pdf`
      )
    } else {
      toast.error('Something went wrong')
    }
  }

  const theme = useTheme()
  if (singleElement) {
    return (
      <>
        {ability.can('export', 'Report') && (
          <Button
            color='primary'
            disabled={exportLoading}
            onClick={() => handleExportReport()}
            variant='contained'
            sx={{ mb: 4 }}
          >
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
        <Card>
          <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}>
            <Grid container>
              <Grid item sm={6} xs={12} sx={{ mb: { sm: 0, xs: 4 } }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ mb: 6, display: 'flex', alignItems: 'center' }}>
                    <svg width={34} viewBox='0 0 32 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
                      <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        fill={theme.palette.primary.main}
                        d='M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z'
                      />
                      <path
                        fill='#161616'
                        opacity={0.06}
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z'
                      />
                      <path
                        fill='#161616'
                        opacity={0.06}
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z'
                      />
                      <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        fill={theme.palette.primary.main}
                        d='M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z'
                      />
                    </svg>
                    <Typography variant='h4' sx={{ ml: 2.5, fontWeight: 700, lineHeight: '24px' }}>
                      {themeConfig.templateName}
                    </Typography>
                  </Box>
                  <div>
                    <Typography sx={{ mb: 2, color: 'text.secondary' }}>Student's Monthly Report</Typography>
                  </div>
                </Box>
              </Grid>
              <Grid item sm={6} xs={12}>
                <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                  <Table sx={{ maxWidth: '300px' }}>
                    <TableBody sx={{ '& .MuiTableCell-root': { py: `${theme.spacing(1.5)} !important` } }}>
                      <TableRow>
                        <MUITableCell>
                          <Typography variant='h4'>Report Date:</Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography variant='h4'>{`${convertDate(singleElement.creationDate)}`}</Typography>
                        </MUITableCell>
                      </TableRow>
                      <TableRow>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>Course Name:</Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>
                            {singleElement.student?.course?.name}
                          </Typography>
                        </MUITableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}>
            <Grid container>
              <Grid item xs={12} sm={6} sx={{ mb: { lg: 0, xs: 4 } }}>
                <Typography variant='h6' sx={{ mb: 6 }}>
                  Teacher Name:
                </Typography>
                <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>
                  {singleElement.teacherFirstName} {singleElement.teacherLastName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: ['flex-start', 'flex-end'] }}>
                <div>
                  <Typography variant='h6' sx={{ mb: 6 }}>
                    Student:
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableBody sx={{ '& .MuiTableCell-root': { py: `${theme.spacing(0.75)} !important` } }}>
                        <TableRow>
                          <MUITableCell>
                            <Typography sx={{ color: 'text.secondary' }}>
                              Name: {singleElement.student?.firstName} {singleElement.student?.lastName}
                            </Typography>
                          </MUITableCell>
                        </TableRow>
                        <TableRow>
                          <MUITableCell>
                            <Typography sx={{ color: 'text.secondary' }}>
                              BirthDate: {convertDate(singleElement.student?.birthday)}
                            </Typography>
                          </MUITableCell>
                        </TableRow>
                        <TableRow>
                          <MUITableCell>
                            <Typography sx={{ color: 'text.secondary' }}>
                              Nationality: {singleElement.student?.nationality}
                            </Typography>
                          </MUITableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Result</TableCell>
                </TableRow>
              </TableHead>
              <TableBody
                sx={{
                  '& .MuiTableCell-root': {
                    py: `${theme.spacing(2.5)} !important`,
                    fontSize: theme.typography.body1.fontSize
                  }
                }}
              >
                {parsedDataArray.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.key}</TableCell>
                    <TableCell>{item.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Divider />
          <CardContent sx={{ px: [6, 10] }}>
            <Typography sx={{ color: 'text.secondary' }}>
              <Typography component='span' sx={{ fontWeight: 500, color: 'text.info !important' }}></Typography>
              Report Genrated by {themeConfig.templateName}
            </Typography>
          </CardContent>
        </Card>
      </>
    )
  } else {
    return <CircularProgress size={100} />
  }
}

export default PreviewReport
