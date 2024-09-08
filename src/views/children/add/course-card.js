// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
// import Checkbox from '@mui/material/Checkbox'
// import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import { convertDate } from 'src/@core/utils/convert-date'
import { useRouter } from 'next/router'
// ** Custom Component Imports
import Icon from 'src/@core/components/icon'
import CustomAvatar from 'src/@core/components/mui/avatar'
// import PricingTable from 'src/views/pages/pricing/PricingTable'
import { useTranslation } from 'react-i18next'

const CourseCard = props => {
  // ** Props
  const {
    course,
    sx,
    avatarIcon = 'carbon:course',
    avatarSize = 55,
    avatarColor = 'primary',
    avatarIconSize = '1.625rem',
    setSelectedCourse,
    selectedCourse
  } = props
  const { t } = useTranslation()
  const { id, name, capacity, startDate, endDate, lessons, price } = course
  const router = useRouter()

  // ** Hook
  const theme = useTheme()

  const handleSelect = () => {
    if (selectedCourse === id) {
      setSelectedCourse(null)
    } else {
      setSelectedCourse(id)
    }
  }

  return (
    <Card
      sx={{
        ...sx,
        backgroundColor: selectedCourse === id ? theme.palette.primary.light : theme.palette.background.paper,
        cursor: 'pointer'
      }}
      onClick={handleSelect}
    >
      <CardContent sx={{ pb: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Grid
          sx={{
            mb: 2.5,
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
        >
          <CustomAvatar
            skin='light'
            color={selectedCourse === id ? 'secondary' : avatarColor}
            sx={{ width: avatarSize, height: avatarSize }}
          >
            <Icon icon={avatarIcon} fontSize={avatarIconSize} />
          </CustomAvatar>
          <Typography variant='h5' color={selectedCourse === id ? 'success' : 'primary'} sx={{ m: 2 }}>
            {name}
          </Typography>
        </Grid>

        <Typography variant='body2' sx={{ my: 0.5, display: 'flex', alignItems: 'center' }}>
          {t('Start Date')}: {convertDate(startDate)} &nbsp; <Icon icon={'uiw:date'} fontSize={'0.9rem'} />
        </Typography>
        <Typography sx={{ my: 0.5, display: 'flex', alignItems: 'center' }} variant='body2'>
          {t('End Date')}: {convertDate(endDate)} &nbsp; <Icon icon={'uiw:date'} fontSize={'0.9rem'} />
        </Typography>
        <Typography sx={{ my: 0.5, display: 'flex', alignItems: 'center' }} variant='body2'>
          {t('Vacancies')}: {capacity} &nbsp; <Icon icon={'gravity-ui:persons'} fontSize={'0.9rem'} />
        </Typography>
        <Typography sx={{ my: 0.5, display: 'flex', alignItems: 'center' }} variant='body2'>
          {t('Lessons')}: {lessons} &nbsp;{' '}
          <Icon icon={'material-symbols-light:play-lesson-outline'} fontSize={'0.9rem'} />
        </Typography>
        <Typography sx={{ my: 0.5, display: 'flex', alignItems: 'center' }} variant='body2'>
          {t('Price')}: {price} €
        </Typography>

        {/* <FormControlLabel
          control={<Checkbox checked={selectedCourse === id} onChange={handleSelect} color='success' />}
          label='Select this course'
          sx={{ mt: 2 }}
        /> */}
      </CardContent>
    </Card>
  )
}

export default CourseCard
