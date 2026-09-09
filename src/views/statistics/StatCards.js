import Grid from '@mui/material/Grid'
import { useTranslation } from 'react-i18next'
import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'
import CardStatsHorizontal from 'src/@core/components/card-statistics/card-stats-horizontal'

const formatPercent = value => (value == null ? '0' : Number(value).toFixed(Number(value) % 1 === 0 ? 0 : 2))

export const OverviewCards = ({ data }) => {
  const { t } = useTranslation()

  if (!data) return null

  const { users, students, courses, reports, events, resources, contracts, documents } = data

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatsHorizontalWithDetails
          title={t('Users')}
          stats={users?.total ?? 0}
          trendDiff={formatPercent(users?.activePercentage)}
          subtitle={t('{{count}} active', { count: users?.active ?? 0 })}
          icon='tabler:users'
          avatarColor='primary'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatsHorizontalWithDetails
          title={t('Students')}
          stats={students?.total ?? 0}
          trendDiff={formatPercent(students?.activePercentage)}
          subtitle={t('{{count}} active', { count: students?.active ?? 0 })}
          icon='ph:student'
          avatarColor='success'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatsHorizontalWithDetails
          title={t('Courses')}
          stats={courses?.total ?? 0}
          trendDiff={formatPercent(courses?.activePercentage)}
          subtitle={t('{{count}} active', { count: courses?.active ?? 0 })}
          icon='fluent-mdl2:publish-course'
          avatarColor='info'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatsHorizontalWithDetails
          title={t('Reports')}
          stats={reports?.total ?? 0}
          trendDiff={formatPercent(reports?.acceptedPercentage)}
          subtitle={t('{{count}} accepted', { count: reports?.accepted ?? 0 })}
          icon='carbon:report'
          avatarColor='warning'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatsHorizontal
          stats={events?.total ?? 0}
          title={t('Events')}
          icon='tabler:calendar-event'
          avatarColor='secondary'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatsHorizontal
          stats={contracts?.studentContracts?.total ?? 0}
          title={t('Student Contracts')}
          icon='tabler:file-text'
          avatarColor='primary'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatsHorizontal
          stats={documents?.invoices?.total ?? 0}
          title={t('Invoices')}
          icon='tabler:receipt'
          avatarColor='success'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatsHorizontal
          stats={documents?.payrolls?.total ?? 0}
          title={t('Payrolls')}
          icon='tabler:cash'
          avatarColor='info'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <CardStatsHorizontal
          stats={resources?.rooms ?? 0}
          title={t('Rooms')}
          icon='fluent:conference-room-24-regular'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <CardStatsHorizontal
          stats={resources?.locations ?? 0}
          title={t('Locations')}
          icon='ep:map-location'
          avatarColor='warning'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <CardStatsHorizontal
          stats={resources?.uploads ?? 0}
          title={t('Uploads')}
          icon='tabler:upload'
          avatarColor='secondary'
        />
      </Grid>
    </Grid>
  )
}

export const DetailStatCards = ({ data }) => {
  const { t } = useTranslation()

  if (!data) return null

  const { users, students, admissions, courses, attendance } = data

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatsHorizontalWithDetails
          title={t('Email Confirmed')}
          stats={users?.emailConfirmed ?? 0}
          trendDiff={formatPercent(users?.emailConfirmedPercentage)}
          subtitle={t('{{count}} not confirmed', { count: users?.emailNotConfirmed ?? 0 })}
          icon='tabler:mail-check'
          avatarColor='success'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatsHorizontalWithDetails
          title={t('Fully Approved Students')}
          stats={students?.fullyApproved ?? 0}
          trendDiff={formatPercent(students?.fullyApprovedPercentage)}
          subtitle={t('{{count}} admin approved', { count: students?.adminApproved ?? 0 })}
          icon='tabler:user-check'
          avatarColor='primary'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatsHorizontalWithDetails
          title={t('Assigned to Course')}
          stats={students?.assignedToCourse ?? 0}
          trendDiff={formatPercent(students?.assignedToCoursePercentage)}
          subtitle={t('{{count}} unassigned', { count: students?.unassignedToCourse ?? 0 })}
          icon='tabler:books'
          avatarColor='info'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatsHorizontal
          stats={`${formatPercent(courses?.occupancyPercentage)}%`}
          title={t('Course Occupancy')}
          icon='tabler:chart-pie'
          avatarColor='warning'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatsHorizontal
          stats={admissions?.pendingAdminApproval ?? 0}
          title={t('Pending Admin Approval')}
          icon='tabler:clock'
          avatarColor='warning'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatsHorizontal
          stats={admissions?.awaitingParentApproval ?? 0}
          title={t('Awaiting Parent Approval')}
          icon='tabler:user-question'
          avatarColor='info'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatsHorizontal
          stats={attendance?.students?.today?.present ?? 0}
          title={t('Students Present Today')}
          icon='tabler:calendar-check'
          avatarColor='success'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatsHorizontal
          stats={attendance?.teachers?.today?.present ?? 0}
          title={t('Teachers Present Today')}
          icon='tabler:chalkboard'
          avatarColor='primary'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatsHorizontal stats={users?.admins ?? 0} title={t('Admins')} icon='tabler:shield' avatarColor='error' />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatsHorizontal
          stats={users?.secretaries ?? 0}
          title={t('Secretaries')}
          icon='tabler:briefcase'
          avatarColor='secondary'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatsHorizontal
          stats={users?.parents ?? 0}
          title={t('Parents')}
          icon='tabler:users-group'
          avatarColor='primary'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatsHorizontal
          stats={users?.teachers ?? 0}
          title={t('Teachers')}
          icon='ph:chalkboard-teacher'
          avatarColor='info'
        />
      </Grid>
    </Grid>
  )
}
