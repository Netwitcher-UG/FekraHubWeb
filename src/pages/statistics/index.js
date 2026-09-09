import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { fetchStatisticsDashboard } from 'src/store/apps/statistics'
import StatisticsDashboard from 'src/views/statistics/StatisticsDashboard'

const StatisticsPage = () => {
  const dispatch = useDispatch()
  const { data, loading, error } = useSelector(state => state.statistics)

  useEffect(() => {
    dispatch(fetchStatisticsDashboard())
  }, [dispatch])

  return (
    <ApexChartWrapper>
      <StatisticsDashboard data={data} loading={loading} error={error} />
    </ApexChartWrapper>
  )
}

export default StatisticsPage
