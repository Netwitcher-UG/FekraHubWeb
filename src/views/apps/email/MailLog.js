// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Input from '@mui/material/Input'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'

import Backdrop from '@mui/material/Backdrop'

import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import CircularProgress from '@mui/material/CircularProgress'
import ListItem from '@mui/material/ListItem'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Custom Components Imports
import MailDetailsDialog from './MailDetailsDialog'

// ** Email App Component Imports

import { fetchMails } from 'src/store/apps/email'
import { useSelector } from 'react-redux'

const MailItem = styled(ListItem)(({ theme }) => ({
  cursor: 'pointer',
  paddingTop: theme.spacing(2.25),
  paddingBottom: theme.spacing(2.25),
  justifyContent: 'space-between',
  transition: 'border 0.15s ease-in-out, transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
  '&:not(:first-child)': {
    borderTop: `1px solid ${theme.palette.divider}`
  },
  '&:hover': {
    zIndex: 2,
    boxShadow: theme.shadows[3]
  },
  [theme.breakpoints.up('xs')]: {
    paddingLeft: theme.spacing(2.5),
    paddingRight: theme.spacing(2.5)
  },
  [theme.breakpoints.up('sm')]: {
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5)
  }
}))

const ScrollWrapper = ({ children, hidden }) => {
  if (hidden) {
    return <Box sx={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
  } else {
    return <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>{children}</PerfectScrollbar>
  }
}

const MailLog = props => {
  // ** Props
  const {
    store,
    query,
    hidden,
    lgAbove,
    dispatch,
    setQuery,
    direction,
    updateMail,
    routeParams,
    labelColors,
    paginateMail,
    getCurrentMail,
    mailDetailsOpen,
    updateMailLabel,
    handleSelectMail,
    setMailDetailsOpen,
    handleSelectAllMail,
    handleLeftSidebarToggle
  } = props

  // ** State
  const [refresh, setRefresh] = useState(false)
  const [selectedMail, setSelectedMail] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const { messages } = useSelector(state => state.email)
  console.log('🚀 ~ MailLog ~ messages:', messages)

  const handleMailClick = mail => {
    setSelectedMail(mail)
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setSelectedMail(null)
  }

  useEffect(() => {
    dispatch(fetchMails())
  }, [dispatch])

  return (
    <Box sx={{ width: '100%', overflow: 'hidden', position: 'relative', '& .ps__rail-y': { zIndex: 5 } }}>
      <Box sx={{ height: '100%', backgroundColor: 'background.paper' }}>
        <Box sx={{ px: 5, py: 3.75 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            {lgAbove ? null : (
              <IconButton onClick={handleLeftSidebarToggle} sx={{ mr: 1, ml: -2 }}>
                <Icon icon='tabler:menu-2' fontSize={20} />
              </IconButton>
            )}
            <Input
              value={query}
              placeholder='Search mail'
              onChange={e => setQuery(e.target.value)}
              sx={{ width: '100%', '&:before, &:after': { display: 'none' } }}
              startAdornment={
                <InputAdornment position='start' sx={{ color: 'text.disabled' }}>
                  <Icon icon='tabler:search' />
                </InputAdornment>
              }
            />
          </Box>
        </Box>
        <Divider sx={{ m: '0 !important' }} />
        <Box sx={{ py: 2, px: { xs: 2.5, sm: 5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '20px' }}>Sent</Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ m: '0 !important' }} />
        <Box sx={{ p: 0, position: 'relative', overflowX: 'hidden', height: 'calc(100% - 7.5625rem)' }}>
          <ScrollWrapper hidden={hidden}>
            {messages && messages.length ? (
              <List sx={{ p: 0 }}>
                {messages.map(mail => {
                  const mailReadToggleIcon = true ? 'tabler:mail' : 'tabler:mail-opened'

                  return (
                    <MailItem
                      key={mail.id}
                      sx={{ backgroundColor: true ? 'action.hover' : 'background.paper' }}
                      onClick={() => handleMailClick(mail)}
                    >
                      <Box sx={{ mr: 4, display: 'flex', overflow: 'hidden', alignItems: 'center' }}>
                        <Avatar
                          alt={mail.user[0]?.firstName}
                          src={mail.user[0]?.firstName}
                          sx={{ mr: 3, width: '2rem', height: '2rem' }}
                        />
                        <Box
                          sx={{
                            display: 'flex',
                            overflow: 'hidden',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'flex-start', sm: 'center' }
                          }}
                        >
                          {mail.user.slice(0, 3).map((user, index) => (
                            <Typography
                              key={index}
                              variant='h6'
                              sx={{
                                mr: 3,
                                fontWeight: 500,
                                whiteSpace: 'nowrap',
                                width: ['100%', 'auto'],
                                overflow: ['hidden', 'unset'],
                                textOverflow: ['ellipsis', 'unset']
                              }}
                            >
                              {user?.firstName + ' ' + user?.lastName + (index < 2 ? ' - ' : '')}{' '}
                              {/* Add dash after all but last */}
                            </Typography>
                          ))}

                          {/* If more than 3 emails, show "..." */}
                          {mail.user.length > 3 && (
                            <Typography
                              variant='h6'
                              sx={{
                                fontWeight: 500,
                                whiteSpace: 'nowrap'
                              }}
                            >
                              ...
                            </Typography>
                          )}

                          {mail.externalEmails.slice(0, 3).map((user, index) => (
                            <Typography
                              key={index}
                              variant='h6'
                              sx={{
                                mr: 3,
                                fontWeight: 500,
                                whiteSpace: 'nowrap',
                                width: ['100%', 'auto'],
                                overflow: ['hidden', 'unset'],
                                textOverflow: ['ellipsis', 'unset']
                              }}
                            >
                              {user?.email + (index < 2 ? ' - ' : '')} {/* Add dash after all but last */}
                            </Typography>
                          ))}

                          {/* If more than 3 emails, show "..." */}
                          {mail.externalEmails.length > 3 && (
                            <Typography
                              variant='h6'
                              sx={{
                                fontWeight: 500,
                                whiteSpace: 'nowrap'
                              }}
                            >
                              ...
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      <Box
                        className='mail-info-right'
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
                      >
                        <Typography noWrap sx={{ width: '100%', color: 'text.secondary' }}>
                          {mail?.subject}
                        </Typography>
                        <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
                          {' '}
                          <div dangerouslySetInnerHTML={{ __html: mail.message }} />
                        </Box>
                        <Typography
                          variant='body2'
                          sx={{ minWidth: '50px', textAlign: 'right', whiteSpace: 'nowrap', color: 'text.disabled' }}
                        >
                          {new Date(mail.date).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </Typography>
                      </Box>
                    </MailItem>
                  )
                })}
              </List>
            ) : (
              <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center', alignItems: 'center', '& svg': { mr: 2 } }}>
                <Icon icon='tabler:alert-octagon' />
                <Typography>No Mails Found</Typography>
              </Box>
            )}
          </ScrollWrapper>
          <Backdrop
            open={refresh}
            onClick={() => setRefresh(false)}
            sx={{
              zIndex: 5,
              position: 'absolute',
              color: 'common.white',
              backgroundColor: 'action.disabledBackground'
            }}
          >
            <CircularProgress color='inherit' />
          </Backdrop>
        </Box>
      </Box>

      <MailDetailsDialog open={dialogOpen} handleClose={handleDialogClose} mail={selectedMail} />
    </Box>
  )
}

export default MailLog
