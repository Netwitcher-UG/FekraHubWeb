import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import Icon from 'src/@core/components/icon'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

export const StatisticsPageHeader = ({ title, lastUpdatedLabel, lastUpdatedValue }) => {
  const theme = useTheme()

  return (
    <Card
      sx={{
        position: 'relative',
        overflow: 'hidden',
        border: `1px solid ${hexToRGBA(theme.palette.primary.main, 0.18)}`,
        background: `linear-gradient(120deg, ${hexToRGBA(theme.palette.primary.main, 0.14)} 0%, ${hexToRGBA(
          theme.palette.primary.dark,
          0.1
        )} 55%, ${hexToRGBA(theme.palette.info.main, 0.12)} 100%)`,
        boxShadow: `0 8px 20px ${hexToRGBA(theme.palette.primary.main, 0.08)}`
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 88% 20%, ${hexToRGBA(theme.palette.primary.main, 0.1)} 0%, transparent 42%),
            radial-gradient(circle at 8% 90%, ${hexToRGBA(theme.palette.info.main, 0.08)} 0%, transparent 35%)`,
          pointerEvents: 'none'
        }}
      />
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          px: { xs: 4, md: 5 },
          py: { xs: 4, md: 4.5 }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: hexToRGBA(theme.palette.primary.main, 0.16),
              border: `1px solid ${hexToRGBA(theme.palette.primary.main, 0.22)}`,
              color: theme.palette.primary.main
            }}
          >
            <Icon icon='tabler:chart-bar' fontSize='1.85rem' />
          </Box>
          <Box>
            <Typography
              variant='h4'
              sx={{
                color: 'text.primary',
                fontWeight: 700,
                letterSpacing: '0.2px',
                lineHeight: 1.2
              }}
            >
              {title}
            </Typography>
            {lastUpdatedValue ? (
              <Chip
                size='small'
                icon={<Icon icon='tabler:clock' fontSize='0.95rem' />}
                label={`${lastUpdatedLabel}: ${lastUpdatedValue}`}
                sx={{
                  mt: 1.25,
                  height: 28,
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  background: hexToRGBA(theme.palette.primary.main, 0.1),
                  border: `1px solid ${hexToRGBA(theme.palette.primary.main, 0.18)}`,
                  '& .MuiChip-icon': { color: theme.palette.primary.main }
                }}
              />
            ) : null}
          </Box>
        </Box>
      </Box>
    </Card>
  )
}

export const StatisticsSectionHeader = ({ title, icon = 'tabler:list-details', sx }) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        mb: 4,
        display: 'flex',
        alignItems: 'center',
        gap: 2.5,
        px: 3,
        py: 2.25,
        borderRadius: 2,
        background: `linear-gradient(90deg, ${hexToRGBA(theme.palette.primary.main, 0.12)} 0%, ${hexToRGBA(
          theme.palette.primary.main,
          0.02
        )} 70%, transparent 100%)`,
        borderLeft: `4px solid ${theme.palette.primary.main}`,
        ...sx
      }}
    >
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: hexToRGBA(theme.palette.primary.main, 0.14),
          color: theme.palette.primary.main
        }}
      >
        <Icon icon={icon} fontSize='1.25rem' />
      </Box>
      <Typography variant='h5' sx={{ fontWeight: 700, color: 'text.primary', letterSpacing: '0.15px' }}>
        {title}
      </Typography>
    </Box>
  )
}
