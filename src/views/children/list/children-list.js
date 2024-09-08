import React from 'react'
import ChildCard from './child-card'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Icon from 'src/@core/components/icon'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

const ChildrenList = ({ childrenData, loading }) => {
  const router = useRouter()
  const { t } = useTranslation()

  const renderData =
    childrenData?.length > 0 && !loading ? (
      childrenData.map((child, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <ChildCard child={child} />
        </Grid>
      ))
    ) : (
      <Grid item xs={12}>
        <Alert severity='info'> {t('No registered children yet')}</Alert>
      </Grid>
    )

  return loading ? (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}
    >
      <CircularProgress size={100} />
    </Box>
  ) : (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Button color='success' onClick={() => router.push('/children/add-child')} variant='contained' sx={{ mb: 2 }}>
          <Box sx={{ mr: 2 }}>
            <Icon fontSize='1.125rem' icon='mingcute:user-add-line' />
          </Box>
          {t('Add New Child')}
        </Button>
        <Divider sx={{ my: 2 }} />
      </Grid>
      {renderData}
    </Grid>
  )
}

export default ChildrenList
