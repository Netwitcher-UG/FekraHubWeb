// ** React Imports
import { Fragment, useState } from 'react'

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
import { useTranslation } from 'react-i18next'

// ** Custom Components Imports
import MailDetailsDialog from './MailDetailsDialog'
import MailLogSkeleton from './MailLogSkeleton'

// ** Email App Component Imports
import { useSelector } from 'react-redux'

const MailItem = styled(ListItem)(({ theme }) => ({
  cursor: 'pointer',
  paddingTop: theme.spacing(2.5),
  paddingBottom: theme.spacing(2.5),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  justifyContent: 'space-between',
  alignItems: 'center',
  transition: 'background-color 0.15s ease-in-out',
  borderBottom: `1px solid ${theme.palette.divider}`,
  position: 'relative',
  '&:hover': {
    backgroundColor: `${
      theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'
    } !important`,
    boxShadow: 'none'
  },
  '&:last-child': {
    borderBottom: 'none'
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

  // ** Hooks
  const { t, i18n } = useTranslation()

  // ** State
  const [refresh, setRefresh] = useState(false)
  const [selectedMail, setSelectedMail] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const { messages, isLoading } = useSelector(state => state.email)
  console.log('🚀 ~ MailLog ~ messages:', messages)

  const handleMailClick = mail => {
    setSelectedMail(mail)
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setSelectedMail(null)
  }

  // Filter messages based on query
  const filteredMessages =
    messages?.filter(mail => {
      if (!query || query.trim() === '') {
        return true
      }

      const searchQuery = query.toLowerCase().trim()
      const subject = mail?.subject?.toLowerCase() || ''
      const messageContent = mail?.message?.replace(/<[^>]*>/g, '').toLowerCase() || ''
      const senderName = mail?.user?.[0]
        ? `${mail.user[0]?.firstName || ''} ${mail.user[0]?.lastName || ''}`.toLowerCase()
        : ''
      const senderEmail = mail?.externalEmails?.[0]?.email?.toLowerCase() || ''

      return (
        subject.includes(searchQuery) ||
        messageContent.includes(searchQuery) ||
        senderName.includes(searchQuery) ||
        senderEmail.includes(searchQuery)
      )
    }) || []

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
              placeholder={t('Search mail')}
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
              <Typography sx={{ fontSize: '20px' }}>{t('Sent')}</Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ m: '0 !important' }} />
        <Box sx={{ p: 0, position: 'relative', overflowX: 'hidden', height: 'calc(100% - 7.5625rem)' }}>
          <ScrollWrapper hidden={hidden}>
            {isLoading ? (
              <MailLogSkeleton count={8} />
            ) : filteredMessages && filteredMessages.length ? (
              <List sx={{ p: 0, backgroundColor: 'background.paper' }}>
                {filteredMessages.map((mail, index) => {
                  const mailReadToggleIcon = true ? 'tabler:mail' : 'tabler:mail-opened'

                  return (
                    <MailItem key={mail.id} onClick={() => handleMailClick(mail)}>
                      {/* Left: Avatar and Sender/Category Name */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          minWidth: { xs: '140px', sm: '200px' },
                          maxWidth: { xs: '140px', sm: '200px' },
                          mr: 3,
                          position: 'relative'
                        }}
                      >
                        <Avatar
                          alt={mail.user[0]?.firstName || mail.externalEmails[0]?.email}
                          src={mail.user[0]?.avatar || mail.externalEmails[0]?.avatar}
                          sx={{
                            width: '2.25rem',
                            height: '2.25rem',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            flexShrink: 0
                          }}
                        >
                          {mail.user[0]
                            ? (mail.user[0]?.firstName?.[0] || mail.user[0]?.lastName?.[0] || 'U').toUpperCase()
                            : mail.externalEmails[0]?.email?.[0]?.toUpperCase() || 'U'}
                        </Avatar>
                        <Typography
                          variant='body1'
                          noWrap
                          sx={{
                            fontWeight: 600,
                            color: 'text.primary',
                            fontSize: '0.875rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            flex: 1,
                            minWidth: 0,
                            position: 'relative',
                            '&::after': {
                              content: '""',
                              position: 'absolute',
                              bottom: '-2px',
                              left: 0,
                              width: '60%',
                              height: '2px',
                              backgroundColor: 'primary.main'
                            }
                          }}
                        >
                          {mail.user[0]
                            ? `${mail.user[0]?.firstName} ${mail.user[0]?.lastName}`.trim()
                            : mail.externalEmails[0]?.email || t('Unknown')}
                        </Typography>
                      </Box>

                      {/* Middle: Subject - Date | Message Preview */}
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
                        <Typography
                          variant='body1'
                          component='span'
                          sx={{
                            fontWeight: 600,
                            color: 'text.primary',
                            fontSize: '0.875rem',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            flexShrink: 0
                          }}
                        >
                          {mail?.subject || t('No Subject')}
                        </Typography>

                        <Typography
                          variant='body2'
                          component='span'
                          sx={{
                            color: 'text.secondary',
                            fontSize: '0.8125rem',
                            whiteSpace: 'nowrap',
                            flexShrink: 0
                          }}
                        >
                          -{' '}
                          {new Date(mail.date).toLocaleDateString(i18n.language === 'de' ? 'de-DE' : 'en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </Typography>

                        {mail.message && (
                          <>
                            <Typography
                              variant='body2'
                              component='span'
                              sx={{
                                color: 'text.secondary',
                                fontSize: '0.8125rem',
                                mx: 0.5,
                                flexShrink: 0
                              }}
                            >
                              |
                            </Typography>
                            <Typography
                              variant='body2'
                              component='span'
                              sx={{
                                color: 'text.secondary',
                                fontSize: '0.8125rem',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                flex: 1,
                                minWidth: 0,
                                display: { xs: 'none', sm: 'block' }
                              }}
                            >
                              {mail.message
                                .replace(/<[^>]*>/g, '')
                                .replace(/\s+/g, ' ')
                                .trim()}
                            </Typography>
                          </>
                        )}
                      </Box>

                      {/* Right: Timestamp */}
                      <Typography
                        variant='body2'
                        sx={{
                          minWidth: '70px',
                          textAlign: 'right',
                          whiteSpace: 'nowrap',
                          color: 'text.secondary',
                          fontSize: '0.8125rem',
                          fontWeight: 400,
                          flexShrink: 0
                        }}
                      >
                        {new Date(mail.date).toLocaleTimeString(i18n.language === 'de' ? 'de-DE' : 'en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: i18n.language !== 'de'
                        })}
                      </Typography>
                    </MailItem>
                  )
                })}
              </List>
            ) : (
              <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center', alignItems: 'center', '& svg': { mr: 2 } }}>
                <Icon icon='tabler:alert-octagon' />
                <Typography>{t('No Mails Found')}</Typography>
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
