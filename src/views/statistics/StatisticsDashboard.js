import { useMemo } from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import { useTranslation } from 'react-i18next'
import ChartCard, { useChartDefaults } from './ChartCard'
import { OverviewCards, DetailStatCards } from './StatCards'
import { StatisticsPageHeader, StatisticsSectionHeader } from './SectionHeaders'

const formatMonthLabel = (item, locale) => {
  if (item?.year && item?.month) {
    return new Date(item.year, item.month - 1, 1).toLocaleDateString(locale, {
      month: 'short',
      year: '2-digit'
    })
  }

  return item?.label || ''
}

const monthLabels = (series, locale) => (series || []).map(item => formatMonthLabel(item, locale))

const countSeries = (items, name) => [{ name, data: (items || []).map(item => item.count ?? 0) }]

const attendanceSeries = (items, labels) => [
  { name: labels.present, data: (items || []).map(item => item.present ?? 0) },
  { name: labels.absent, data: (items || []).map(item => item.absent ?? 0) },
  { name: labels.other, data: (items || []).map(item => item.other ?? 0) }
]

const formatDonutCenterName = (text, maxCharsPerLine = 10, maxLines = 2) => {
  const source = String(text || '').trim()
  if (!source) return ['']

  const parts = []
  source.split(/\s+/).forEach(word => {
    if (word.length <= maxCharsPerLine) {
      parts.push(word)
    } else {
      for (let i = 0; i < word.length; i += maxCharsPerLine) {
        parts.push(word.slice(i, i + maxCharsPerLine))
      }
    }
  })

  const lines = []
  let current = ''

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    const next = current ? `${current} ${part}` : part

    if (next.length <= maxCharsPerLine) {
      current = next
      continue
    }

    if (current) lines.push(current)
    current = part

    if (lines.length >= maxLines - 1) {
      const hasMore = i < parts.length - 1 || current.length > maxCharsPerLine
      let last = current.slice(0, maxCharsPerLine)
      if (hasMore || current.length > maxCharsPerLine) {
        last = `${current.slice(0, Math.max(1, maxCharsPerLine - 1))}…`
      }
      lines.push(last)
      current = ''
      break
    }
  }

  if (current && lines.length < maxLines) {
    lines.push(current.length > maxCharsPerLine ? `${current.slice(0, maxCharsPerLine - 1)}…` : current)
  }

  return lines.length ? lines : ['']
}

const applyDonutCenterLabel = (chartEl, text) => {
  const labelEl = chartEl?.querySelector?.('.apexcharts-datalabel-label')
  if (!labelEl) return

  const lines = formatDonutCenterName(text)
  const x = labelEl.getAttribute('x') || '0'

  while (labelEl.firstChild) {
    labelEl.removeChild(labelEl.firstChild)
  }

  lines.forEach((line, index) => {
    const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan')
    tspan.setAttribute('x', x)
    tspan.setAttribute('dy', index === 0 ? `${-((lines.length - 1) * 0.55)}em` : '1.15em')
    tspan.textContent = line
    labelEl.appendChild(tspan)
  })
}

const StatisticsDashboard = ({ data, loading, error }) => {
  const { t, i18n } = useTranslation()
  const { colors, labelColor, borderColor, legendColor, theme } = useChartDefaults()
  const dateLocale = i18n.language === 'de' ? 'de-DE' : 'en-US'

  const monthAxisLabels = useMemo(
    () => ({
      rotate: -45,
      rotateAlways: true,
      hideOverlappingLabels: false,
      trim: false,
      style: { colors: labelColor, fontSize: '11px' }
    }),
    [labelColor]
  )

  const formatGeneratedAt = value => {
    if (!value) return null

    try {
      return new Date(value).toLocaleString(dateLocale)
    } catch (err) {
      return value
    }
  }

  const lineOptions = useMemo(
    () => ({
      chart: {
        parentHeightOffset: 0,
        toolbar: { show: false },
        zoom: { enabled: false }
      },
      colors,
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 3 },
      grid: {
        borderColor,
        strokeDashArray: 4,
        padding: { bottom: 8 },
        xaxis: { lines: { show: false } }
      },
      xaxis: {
        categories: [],
        labels: monthAxisLabels,
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        labels: { style: { colors: labelColor, fontSize: '12px' } }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        labels: { colors: legendColor },
        markers: { width: 10, height: 10, offsetX: -3 }
      },
      tooltip: { shared: true }
    }),
    [colors, borderColor, labelColor, legendColor, monthAxisLabels]
  )

  const barOptions = useMemo(
    () => ({
      chart: {
        parentHeightOffset: 0,
        toolbar: { show: false },
        stacked: false
      },
      colors,
      dataLabels: { enabled: false },
      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: '45%',
          endingShape: 'rounded'
        }
      },
      grid: {
        borderColor,
        strokeDashArray: 4,
        padding: { bottom: 8 },
        xaxis: { lines: { show: false } }
      },
      xaxis: {
        categories: [],
        labels: monthAxisLabels,
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        labels: { style: { colors: labelColor, fontSize: '12px' } }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        labels: { colors: legendColor }
      }
    }),
    [colors, borderColor, labelColor, legendColor, monthAxisLabels]
  )

  const stackedBarOptions = useMemo(
    () => ({
      ...barOptions,
      chart: { ...barOptions.chart, stacked: true },
      colors: [theme.palette.success.main, theme.palette.error.main, theme.palette.warning.main]
    }),
    [barOptions, theme]
  )

  const donutOptions = useMemo(
    () => ({
      chart: {
        parentHeightOffset: 0,
        events: {
          mounted: (chartContext) => {
            requestAnimationFrame(() => applyDonutCenterLabel(chartContext.el, t('Total')))
          },
          updated: (chartContext) => {
            requestAnimationFrame(() => applyDonutCenterLabel(chartContext.el, t('Total')))
          },
          dataPointMouseEnter: (event, chartContext, config) => {
            const name = chartContext?.w?.globals?.seriesNames?.[config.dataPointIndex]
            requestAnimationFrame(() => applyDonutCenterLabel(chartContext.el, name))
          },
          dataPointMouseLeave: (event, chartContext) => {
            requestAnimationFrame(() => applyDonutCenterLabel(chartContext.el, t('Total')))
          }
        }
      },
      labels: [],
      colors,
      legend: {
        position: 'bottom',
        labels: { colors: legendColor },
        fontSize: '12px'
      },
      stroke: { width: 0 },
      dataLabels: {
        enabled: true,
        style: { fontSize: '11px', fontWeight: 600 },
        formatter: val => `${Math.round(val)}%`
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              name: {
                show: true,
                color: legendColor,
                fontSize: '11px',
                fontWeight: 500,
                offsetY: -4,
                formatter: val => formatDonutCenterName(val)
              },
              value: {
                show: true,
                color: theme.palette.text.primary,
                fontSize: '16px',
                fontWeight: 700,
                offsetY: 8,
                formatter: val => `${val}`
              },
              total: {
                show: true,
                showAlways: true,
                label: t('Total'),
                fontSize: '11px',
                fontWeight: 500,
                color: legendColor,
                formatter: w => w.globals.seriesTotals.reduce((a, b) => a + b, 0)
              }
            }
          }
        }
      }
    }),
    [colors, legendColor, theme, t]
  )

  const horizontalBarOptions = useMemo(
    () => ({
      chart: {
        parentHeightOffset: 0,
        toolbar: { show: false }
      },
      colors: [theme.palette.primary.main, theme.palette.success.main],
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 6,
          barHeight: '70%',
          dataLabels: { position: 'top' }
        }
      },
      dataLabels: { enabled: false },
      grid: {
        borderColor,
        xaxis: { lines: { show: false } }
      },
      xaxis: {
        categories: [],
        labels: { style: { colors: labelColor, fontSize: '12px' } }
      },
      yaxis: {
        labels: { style: { colors: labelColor, fontSize: '12px' }, maxWidth: 140 }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        labels: { colors: legendColor }
      },
      tooltip: {
        y: {
          formatter: val => `${val}`
        }
      }
    }),
    [theme, borderColor, labelColor, legendColor]
  )

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 320 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity='error'>
        {t('Failed to load statistics')}: {error}
      </Alert>
    )
  }

  if (!data) {
    return <Alert severity='info'>{t('No statistics data available.')}</Alert>
  }

  const charts = data.charts || {}
  const usersChartCategories = monthLabels(charts.usersRegisteredPerMonth, dateLocale)
  const studentsChartCategories = monthLabels(charts.studentsAddedPerMonth, dateLocale)
  const reportsChartCategories = monthLabels(charts.reportsPerMonth, dateLocale)
  const attendanceStudentCategories = monthLabels(charts.studentAttendancePerMonth, dateLocale)
  const attendanceTeacherCategories = monthLabels(charts.teacherAttendancePerMonth, dateLocale)
  const studentsPerCourse = charts.studentsPerCourse || []
  const attendanceLabels = {
    present: t('Present'),
    absent: t('Absent'),
    other: t('Other')
  }

  const userRoleSeries = [
    data.users?.admins ?? 0,
    data.users?.secretaries ?? 0,
    data.users?.parents ?? 0,
    data.users?.teachers ?? 0
  ]

  const courseStatusSeries = [data.courses?.active ?? 0, data.courses?.upcoming ?? 0, data.courses?.finished ?? 0]

  const reportsStatusSeries = [data.reports?.accepted ?? 0, data.reports?.pending ?? 0, data.reports?.notAccepted ?? 0]

  const admissionsSeries = [
    data.admissions?.pendingAdminApproval ?? 0,
    data.admissions?.awaitingParentApproval ?? 0,
    data.admissions?.approvedByAdmin ?? 0,
    data.admissions?.fullyApproved ?? 0
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <StatisticsPageHeader
          title={t('Statistics')}
          lastUpdatedLabel={t('Last updated')}
          lastUpdatedValue={data.generatedAtUtc ? formatGeneratedAt(data.generatedAtUtc) : null}
        />
      </Grid>

      <Grid item xs={12}>
        <OverviewCards data={data} />
      </Grid>

      <Grid item xs={12}>
        <StatisticsSectionHeader title={t('Details')} icon='tabler:list-details' />
        <DetailStatCards data={data} />
      </Grid>

      <Grid item xs={12} md={6}>
        <ChartCard
          title={t('Users Registered Per Month')}
          icon='tabler:users'
          type='area'
          height={360}
          options={{
            ...lineOptions,
            colors: [theme.palette.primary.main],
            xaxis: { ...lineOptions.xaxis, categories: usersChartCategories }
          }}
          series={countSeries(charts.usersRegisteredPerMonth, t('Users'))}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <ChartCard
          title={t('Students Added Per Month')}
          icon='ph:student'
          type='area'
          height={360}
          options={{
            ...lineOptions,
            colors: [theme.palette.success.main],
            xaxis: { ...lineOptions.xaxis, categories: studentsChartCategories }
          }}
          series={countSeries(charts.studentsAddedPerMonth, t('Students'))}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <ChartCard
          title={t('Reports / Invoices / Events Per Month')}
          icon='tabler:chart-bar'
          type='bar'
          height={360}
          options={{
            ...barOptions,
            xaxis: { ...barOptions.xaxis, categories: reportsChartCategories }
          }}
          series={[
            { name: t('Reports'), data: (charts.reportsPerMonth || []).map(item => item.count ?? 0) },
            { name: t('Invoices'), data: (charts.invoicesPerMonth || []).map(item => item.count ?? 0) },
            { name: t('Events'), data: (charts.eventsPerMonth || []).map(item => item.count ?? 0) }
          ]}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <ChartCard
          title={t('Students Per Course')}
          icon='tabler:books'
          type='bar'
          height={Math.max(320, studentsPerCourse.length * 36)}
          options={{
            ...horizontalBarOptions,
            xaxis: {
              ...horizontalBarOptions.xaxis,
              categories: studentsPerCourse.map(item => item.courseName)
            }
          }}
          series={[
            { name: t('Assigned'), data: studentsPerCourse.map(item => item.assignedStudents ?? 0) },
            { name: t('Active'), data: studentsPerCourse.map(item => item.activeStudents ?? 0) }
          ]}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <ChartCard
          title={t('Student Attendance Per Month')}
          icon='tabler:calendar-check'
          type='bar'
          height={360}
          options={{
            ...stackedBarOptions,
            xaxis: { ...stackedBarOptions.xaxis, categories: attendanceStudentCategories }
          }}
          series={attendanceSeries(charts.studentAttendancePerMonth, attendanceLabels)}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <ChartCard
          title={t('Teacher Attendance Per Month')}
          icon='tabler:chalkboard'
          type='bar'
          height={360}
          options={{
            ...stackedBarOptions,
            xaxis: { ...stackedBarOptions.xaxis, categories: attendanceTeacherCategories }
          }}
          series={attendanceSeries(charts.teacherAttendancePerMonth, attendanceLabels)}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <ChartCard
          title={t('Users by Role')}
          icon='tabler:chart-donut-3'
          type='donut'
          height={300}
          options={{
            ...donutOptions,
            labels: [t('Admins'), t('Secretaries'), t('Parents'), t('Teachers')]
          }}
          series={userRoleSeries}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <ChartCard
          title={t('Courses Status')}
          icon='fluent-mdl2:publish-course'
          type='donut'
          height={300}
          options={{ ...donutOptions, labels: [t('Active'), t('Upcoming'), t('Finished')] }}
          series={courseStatusSeries}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <ChartCard
          title={t('Reports Status')}
          icon='carbon:report'
          type='donut'
          height={300}
          options={{ ...donutOptions, labels: [t('Accepted'), t('Pending'), t('Not Accepted')] }}
          series={reportsStatusSeries}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <ChartCard
          title={t('Admissions Pipeline')}
          icon='tabler:git-branch'
          type='donut'
          height={300}
          options={{
            ...donutOptions,
            labels: [t('Pending Admin'), t('Awaiting Parent'), t('Approved by Admin'), t('Fully Approved')]
          }}
          series={admissionsSeries}
        />
      </Grid>
    </Grid>
  )
}

export default StatisticsDashboard
