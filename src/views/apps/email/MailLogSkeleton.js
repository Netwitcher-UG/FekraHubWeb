// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Skeleton from '@mui/material/Skeleton'
import Avatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'

// ** Styled Component
import { styled } from '@mui/material/styles'

const MailItemSkeleton = styled(ListItem)(({ theme }) => ({
  paddingTop: theme.spacing(2.5),
  paddingBottom: theme.spacing(2.5),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none'
  }
}))

const MailLogSkeleton = ({ count = 5 }) => {
  return (
    <List sx={{ p: 0, backgroundColor: 'background.paper' }}>
      {Array.from({ length: count }).map((_, index) => (
        <MailItemSkeleton key={index}>
          {/* Left: Avatar and Sender Name Skeleton */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              minWidth: { xs: '140px', sm: '200px' },
              maxWidth: { xs: '140px', sm: '200px' },
              mr: 3
            }}
          >
            <Skeleton variant='circular' width={36} height={36} />
            <Skeleton variant='text' width={120} height={20} sx={{ flex: 1 }} />
          </Box>

          {/* Middle: Subject - Date | Message Preview Skeleton */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flex: 1,
              minWidth: 0,
              gap: 1,
              mr: 3
            }}
          >
            <Skeleton variant='text' width={150} height={18} />
            <Skeleton variant='text' width={120} height={16} />
            <Skeleton variant='text' width={200} height={16} sx={{ display: { xs: 'none', sm: 'block' }, flex: 1 }} />
          </Box>

          {/* Right: Timestamp Skeleton */}
          <Skeleton variant='text' width={70} height={16} sx={{ flexShrink: 0 }} />
        </MailItemSkeleton>
      ))}
    </List>
  )
}

export default MailLogSkeleton
