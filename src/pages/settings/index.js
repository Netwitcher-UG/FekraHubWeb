import React from 'react'
import { Grid } from '@mui/material'
import Card from '@mui/material/Card'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import Icon from 'src/@core/components/icon'
import BasicInfo from 'src/views/settings/BasicInfo'
import EmailSettings from 'src/views/settings/EmailSettings'
import ReportsSettings from 'src/views/settings/ReportsSettings'

const SettingsPage = () => {
  const { t } = useTranslation()

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<Icon icon='tabler:chevron-down' />}>
              <Typography variant='h6'>{t('Basic Info')}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <BasicInfo />
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<Icon icon='tabler:chevron-down' />}>
              <Typography variant='h6'>{t('Email Settings')}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <EmailSettings />
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<Icon icon='tabler:chevron-down' />}>
              <Typography variant='h6'>{t('Reports Settings')}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ReportsSettings />
            </AccordionDetails>
          </Accordion>
        </Card>
      </Grid>
    </Grid>
  )
}

export default SettingsPage
