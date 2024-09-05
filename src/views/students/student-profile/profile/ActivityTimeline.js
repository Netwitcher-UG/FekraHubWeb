// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
// import Avatar from '@mui/material/Avatar'
import { styled } from '@mui/material/styles'
import { Grid } from '@mui/material'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline from '@mui/lab/Timeline'
import { convertDate } from 'src/@core/utils/convert-date'
import { useTranslation } from 'react-i18next'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Import

// Styled Timeline component
const Timeline = styled(MuiTimeline)({
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none'
    }
  }
})

const ActivityTimeline = ({ recent, setValue }) => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader
        title={t('Recent Files')}
        sx={{ '& .MuiCardHeader-avatar': { mr: 3 } }}
        titleTypographyProps={{ sx: { color: 'text.primary' } }}
        avatar={<Icon fontSize='1.25rem' icon='tabler:list-details' />}
      />
      <CardContent>
        <Timeline>
          {recent?.report?.length > 0 && (
            <>
              <Grid sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='body2' sx={{ mb: 4, mt: 4, color: 'primary.main', textTransform: 'uppercase' }}>
                  {t('Reports')}
                </Typography>
                <Typography
                  onClick={() => setValue('2')}
                  variant='body2'
                  sx={{ mb: 4, mt: 4, color: 'primary.main', cursor: 'pointer' }}
                >
                  {t('View all reports')}
                </Typography>
              </Grid>
              {recent?.report.map((report, index) => (
                <TimelineItem key={index}>
                  <TimelineSeparator>
                    <TimelineDot color='primary' />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent sx={{ mt: 0 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Typography variant='h6' sx={{ mr: 2 }}>
                        {report?.month}.{report?.year}
                      </Typography>
                      <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                        {convertDate(report?.creationDate)}
                      </Typography>
                    </Box>
                    <Typography variant='body2'>
                      {t('Recent report for the {{month}}th month', { month: report?.month })}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </>
          )}
          {recent?.workSheet?.length > 0 && (
            <>
              <Grid sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='body2' sx={{ mb: 4, mt: 4, color: 'primary.main', textTransform: 'uppercase' }}>
                  {t('Worksheets')}
                </Typography>
                <Typography
                  onClick={() => setValue('5')}
                  variant='body2'
                  sx={{ mb: 4, mt: 4, color: 'primary.main', cursor: 'pointer' }}
                >
                  {t('View all Worksheets')}
                </Typography>
              </Grid>
              {recent?.workSheet.map((workSheet, index) => (
                <TimelineItem key={index}>
                  <TimelineSeparator>
                    <TimelineDot color='info' />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent sx={{ mt: 0, mb: theme => `${theme.spacing(2)} !important` }}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Typography variant='h6' sx={{ mr: 2 }}>
                        {workSheet?.fileName}
                      </Typography>
                      <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                        {convertDate(workSheet?.date)}
                      </Typography>
                    </Box>
                    <Typography variant='body2' sx={{ mb: 3 }}>
                      {t('Recent Worksheet file')}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </>
          )}
          {recent?.invoice?.length > 0 && (
            <>
              <Grid sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='body2' sx={{ mb: 4, mt: 4, color: 'primary.main', textTransform: 'uppercase' }}>
                  {t('Invoices')}
                </Typography>
                <Typography
                  onClick={() => setValue('4')}
                  variant='body2'
                  sx={{ mb: 4, mt: 4, color: 'primary.main', cursor: 'pointer' }}
                >
                  {t('View all invoices')}
                </Typography>
              </Grid>
              {recent?.invoice.map((invoice, index) => (
                <TimelineItem key={index}>
                  <TimelineSeparator>
                    <TimelineDot color='secondary' />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent sx={{ mt: 0 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Typography variant='h6' sx={{ mr: 2 }}>
                        {invoice?.fileName}
                      </Typography>
                      <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                        {convertDate(invoice?.date)}
                      </Typography>
                    </Box>
                    <Typography variant='body2'>{t('Recent invoice')}</Typography>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </>
          )}
        </Timeline>
        {recent?.invoice?.length == 0 && recent?.workSheet?.length == 0 && recent?.report?.length == 0 && (
          <Typography
            variant='h4'
            sx={{
              mb: 4,
              mt: 4,
              color: 'secondary.main',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            {t('None')}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

export default ActivityTimeline
