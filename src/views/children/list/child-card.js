// ** MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Chip from 'src/@core/components/mui/chip'
import Grid from '@mui/material/Grid'
import { convertDate } from 'src/@core/utils/convert-date'
import { useRouter } from 'next/router'
// ** Custom Component Imports
import Icon from 'src/@core/components/icon'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { useTranslation } from 'react-i18next'

const ChildCard = props => {
  // ** Props
  const {
    child,
    sx,
    avatarIcon = 'ph:student-thin',
    avatarSize = 50,
    avatarColor = 'primary',
    avatarIconSize = '1.625rem',
    isPendingChild
  } = props

  const { firstName, lastName, birthday, course, gender } = child
  const router = useRouter()

  // ** Hook
  const { t } = useTranslation()
  return (
    <Card sx={{ ...sx }}>
      <CardContent sx={{ pb: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Grid sx={{ mb: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <CustomAvatar skin='light' color={avatarColor} sx={{ width: avatarSize, height: avatarSize }}>
            <Icon icon={avatarIcon} fontSize={avatarIconSize} />
          </CustomAvatar>
          {isPendingChild ? (
            <Chip label={t('Pending Approval')} color='warning' />
          ) : (
            <Chip label={course?.name} color='primary' />
          )}
        </Grid>
        <Typography
          variant='h5'
          color={isPendingChild ? 'secondary' : 'primary'}
          sx={{ cursor: isPendingChild ? 'auto' : 'pointer' }}
          onClick={() => (isPendingChild ? null : router.push(`/children/${child.id}`))}
        >
          <u>
            {' '}
            {firstName} {lastName}
          </u>
        </Typography>
        <Typography variant='body2'>{gender}</Typography>
        <Typography variant='body2'>{convertDate(birthday)}</Typography>
      </CardContent>
    </Card>
  )
}

export default ChildCard
