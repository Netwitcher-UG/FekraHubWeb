import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material/styles'
import Icon from 'src/@core/components/icon'
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const ChartCard = ({ title, subheader, icon = 'tabler:chart-area-line', type = 'line', height = 320, options, series }) => {
  const theme = useTheme()

  return (
    <Card sx={{ height: '100%', overflow: 'hidden' }}>
      <CardHeader
        avatar={
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: hexToRGBA(theme.palette.primary.main, 0.12),
              color: theme.palette.primary.main
            }}
          >
            <Icon icon={icon} fontSize='1.25rem' />
          </Box>
        }
        title={title}
        subheader={subheader}
        titleTypographyProps={{ variant: 'h6', sx: { fontWeight: 700, lineHeight: 1.25 } }}
        sx={{
          py: 2.5,
          px: 4,
          alignItems: 'center',
          background: `linear-gradient(90deg, ${hexToRGBA(theme.palette.primary.main, 0.08)} 0%, transparent 100%)`,
          borderBottom: `1px solid ${theme.palette.divider}`,
          '& .MuiCardHeader-avatar': {
            marginRight: 3,
            marginBottom: 0
          },
          '& .MuiCardHeader-content': {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }
        }}
      />
      <CardContent>
        <Box sx={{ minHeight: height }}>
          <ReactApexcharts type={type} height={height} options={options} series={series} />
        </Box>
      </CardContent>
    </Card>
  )
}

export const useChartDefaults = () => {
  const theme = useTheme()

  return {
    theme,
    colors: [
      theme.palette.primary.main,
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.error.main,
      theme.palette.info.main,
      theme.palette.secondary.main
    ],
    labelColor: theme.palette.text.disabled,
    borderColor: theme.palette.divider,
    legendColor: theme.palette.text.secondary
  }
}

export default ChartCard
