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
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import TableContainer from '@mui/material/TableContainer'
import TableCell from '@mui/material/TableCell'
import { convertDate } from 'src/@core/utils/convert-date'
import CircularProgress from '@mui/material/CircularProgress'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'

// ** Configs
import themeConfig from 'src/configs/themeConfig'
import { useEffect } from 'react'

const MUITableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 0,
  paddingLeft: '0 !important',
  paddingRight: '0 !important',
  '&:not(:last-child)': {
    paddingRight: `${theme.spacing(2)} !important`
  }
}))

const DrawerReportSlip = ({ data }) => {
  // ** Hook
  const { t } = useTranslation()
  const singleElement = data ? data : null

  const parsedData = JSON.parse(singleElement?.data)

  const parsedDataArray = Object.entries(parsedData).map(([key, value]) => ({ key, value }))

  const theme = useTheme()
  if (singleElement) {
    return (
      <Card>
        <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}>
          <Grid container sx={{ display: 'flex', flexDirection: 'column' }}>
            <Grid item sm={6} xs={12} sx={{ mb: { sm: 4, xs: 4 } }}>
              <Box>
                <Box sx={{ mb: 6, display: 'flex', alignItems: 'center' }}>
                  <Image width={34} height={40} src={'/images/favicon.png'} />

                  <Typography variant='h5' sx={{ ml: 2.5, fontWeight: 700, lineHeight: '24px' }}>
                    {themeConfig.templateName}
                  </Typography>
                </Box>
                <div>
                  <Typography sx={{ mb: 2, color: 'text.secondary' }}>{t("Student's Monthly Report")}</Typography>
                </div>
              </Box>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                <Table sx={{ maxWidth: '300px' }}>
                  <TableBody sx={{ '& .MuiTableCell-root': { py: `${theme.spacing(1.5)} !important` } }}>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant='h5'>{t('Report Date')}:</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography variant='h5'>
                          {singleElement?.month}.{singleElement?.year}
                        </Typography>
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>
                        <Typography sx={{ color: 'text.secondary' }}>{t('Course Name')}:</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography sx={{ color: 'text.secondary' }}>{singleElement.student?.course?.name}</Typography>
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
                {t('Teacher Name')}:
              </Typography>
              <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>
                {singleElement.teacherFirstName} {singleElement.teacherLastName}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: ['flex-start', 'flex-end'] }}>
              <div>
                <Typography variant='h6' sx={{ mb: 6 }}>
                  {t('Student')}:
                </Typography>
                <TableContainer>
                  <Table>
                    <TableBody sx={{ '& .MuiTableCell-root': { py: `${theme.spacing(0.75)} !important` } }}>
                      <TableRow>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>
                            {t('Name')}: {singleElement.student?.firstName} {singleElement.student?.lastName}
                          </Typography>
                        </MUITableCell>
                      </TableRow>
                      <TableRow>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>
                            {t('BirthDate')}: {convertDate(singleElement.student?.birthday)}
                          </Typography>
                        </MUITableCell>
                      </TableRow>
                      <TableRow>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>
                            {t('Nationality')}: {singleElement.student?.nationality}
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
                <TableCell>{t('Type')}</TableCell>
                <TableCell>{t('Result')}</TableCell>
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
                  <TableCell>{t(item.key)}</TableCell>
                  <TableCell>{t(item.value)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    )
  } else {
    return <CircularProgress size={100} />
  }
}

export default DrawerReportSlip
