

import { useState, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Badge from '@mui/material/Badge'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import MuiMenu from '@mui/material/Menu'
import MuiMenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import PerfectScrollbarComponent from 'react-perfect-scrollbar'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Util Import
import { getInitials } from 'src/@core/utils/get-initials'
import { ReadNotification } from 'src/store/apps/notifications'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import { useRouter } from 'next/router'

// ** Styled Menu component
const Menu = styled(MuiMenu)(({ theme }) => ({
  '& .MuiMenu-paper': {
    width: 380,
    overflow: 'hidden',
    marginTop: theme.spacing(4.25),
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  '& .MuiMenu-list': {
    padding: 0,
    '& .MuiMenuItem-root': {
      margin: 0,
      borderRadius: 0,
      padding: theme.spacing(4, 6),
      '&:hover': {
        backgroundColor: theme.palette.action.hover
      }
    }
  }
}))

// ** Styled MenuItem component
const MenuItem = styled(MuiMenuItem)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  '&:not(:last-of-type)': {
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}))

// ** Styled PerfectScrollbar component
const PerfectScrollbar = styled(PerfectScrollbarComponent)({
  maxHeight: 349
})

// ** Styled Avatar component
const Avatar = styled(CustomAvatar)({
  width: 38,
  height: 38,
  fontSize: '1.125rem'
})

// ** Styled component for the title in MenuItems
const MenuItemTitle = styled(Typography)({
  fontWeight: 500,
  flex: '1 1 100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
})

// ** Styled component for the subtitle in MenuItems
const MenuItemSubtitle = styled(Typography)({
  flex: '1 1 100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
})

const ScrollWrapper = ({ children, hidden }) => {
  if (hidden) {
    return <Box sx={{ maxHeight: 349, overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
  } else {
    return <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>{children}</PerfectScrollbar>
  }
}

const NotificationDropdown = props => {
  // ** Props
  const { settings, notifications } = props
  console.log('🚀 ~ NotificationDropdown ~ notifications:', notifications?.notifications)

  // ** States
  const [anchorEl, setAnchorEl] = useState(null)
  const router = useRouter()
  // ** Hook
  const hidden = useMediaQuery(theme => theme.breakpoints.down('lg'))

  // ** Vars
  const { direction } = settings
  const dispatch = useDispatch()
  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  // Function to handle notification click
  const handleNotificationClick = notification => {
     dispatch(ReadNotification(`id=${notification.id}&AllRead=false`))
    router.push('/app'+notification.url)
    handleDropdownClose()
  }

  // Function to handle All Notifications readd
  const handleAllNotificationRead = () => {
    dispatch(ReadNotification('AllRead=true'))
    handleDropdownClose()
  }

  const handleDropdownClose = () => {
    setAnchorEl(null)
  }

  const RenderAvatar = ({ notification }) => {
    console.log("🚀 ~ RenderAvatar ~ notification:", notification)
    const { avatarAlt, avatarImg, avatarIcon, avatarText, avatarColor, notificationType } = notification;

    if (avatarImg) {
      return <CalendarMonthIcon/>;
    } else if (avatarIcon) {
      return (
        <CalendarMonthIcon/>
      );
    } else {
      // Determine icon based on notificationType
      let icon = null;
      switch (notificationType) {
        case 'event':
          icon = <CalendarTodayIcon />; // Replace with your desired Calendar Icon
          break;
        // Add more cases for other notification types...
        default:
          icon = getInitials(avatarText);
      }

      return (
        <Avatar skin="light" color={avatarColor}>
          <CalendarMonthIcon/>
        </Avatar>
      );
    }
  };

  return (
    <Fragment>
      <IconButton color='inherit' aria-haspopup='true' onClick={handleDropdownOpen} aria-controls='customized-menu'>
        {footer()}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <MenuItem
          disableRipple
          disableTouchRipple
          sx={{ cursor: 'default', userSelect: 'auto', backgroundColor: 'transparent !important' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography variant='h5' sx={{ cursor: 'text' }}>
              Notifications
            </Typography>
            <CustomChip skin='light' size='small' color='primary' label={`${notifications?.unReadCount} New`} />
          </Box>
        </MenuItem>
        <ScrollWrapper hidden={hidden}>
          {notifications?.notifications?.map((notification, index) => (
            <MenuItem
              key={index}
              disableRipple
              disableTouchRipple
              onClick={() => handleNotificationClick(notification)}
              sx={{
                backgroundColor: notification.read ? 'transparent' : 'rgba(255, 255, 255, 0.5)', // Change background if unread
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)'
                }
              }}
            >
              <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                <RenderAvatar notification={notification} />
                <Box sx={{ mr: 4, ml: 2.5, flex: '1 1', display: 'flex', overflow: 'hidden', flexDirection: 'column' }}>
                  <MenuItemTitle>{notification.notification}</MenuItemTitle>
                  <MenuItemSubtitle variant='body2'>
                    {moment(notification.date).format('DD-MM-YYYY HH:mm')}
                  </MenuItemSubtitle>
                </Box>
                <Typography variant='body2' sx={{ color: notification.read ? '#EA5455' : '#28C76F' }}>
                  {notification.read ? '' : 'read'}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </ScrollWrapper>
        <MenuItem
          disableRipple
          disableTouchRipple
          sx={{
            borderBottom: 0,
            cursor: 'default',
            userSelect: 'auto',
            backgroundColor: 'transparent !important',
            borderTop: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <Button fullWidth variant='contained' onClick={handleAllNotificationRead}>
            Read All Notifications
          </Button>
        </MenuItem>
      </Menu>
    </Fragment>
  )

  function footer() {
    return <Badge
      color='error'
      badgeContent={notifications.unReadCount}
      sx={{
        '& .MuiBadge-badge': { top: 4, right: 4 }
      }}
    >
      <Icon fontSize='1.625rem' icon='tabler:bell' />
    </Badge>
  }
}

export default NotificationDropdown
