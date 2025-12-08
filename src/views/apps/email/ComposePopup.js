// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import List from '@mui/material/List'
import Input from '@mui/material/Input'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import ListItem from '@mui/material/ListItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import { createFilterOptions } from '@mui/material/Autocomplete'

// ** Third Party Imports
import { useTranslation } from 'react-i18next'

// ** Custom Component Imports
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import { EditorState, convertToRaw } from 'draft-js'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'
import CustomAvatar from 'src/@core/components/mui/avatar'
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'

// ** Styled Component Imports
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { stateToHTML } from 'draft-js-export-html'
// ** Styles
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { fetchEmployees } from 'src/store/apps/users'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsersMail, postMail } from 'src/store/apps/email'
import { fetchCourses } from 'src/store/apps/courses'
import { fetchAllRole } from 'src/store/apps/roles'

const filter = createFilterOptions()

const ComposePopup = props => {
  // ** Props
  const { mdAbove, composeOpen, composePopupWidth, toggleComposeOpen } = props

  // ** Hooks
  const { t } = useTranslation()

  const { users } = useSelector(state => state.email)
  const { data, status, error, dataRooms, dataTeacher } = useSelector(state => state.courses)
  const { roles } = useSelector(state => state.roles)
  const [attachments, setAttachments] = useState([]) // Store multiple files

  // Handle multiple file selection
  const handleFileChange = event => {
    const selectedFiles = Array.from(event.target.files) // Convert FileList to an array
    setAttachments(prevFiles => [...prevFiles, ...selectedFiles]) // Append new files to existing ones
    console.log('Selected files:', selectedFiles)
  }

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchUsersMail())
    dispatch(fetchCourses(''))
    dispatch(fetchAllRole())
  }, [dispatch])
  // ** States
  const [emailTo, setEmailTo] = useState([])
  const [ccValue, setccValue] = useState([])
  const [subjectValue, setSubjectValue] = useState('')
  const [bccValue, setbccValue] = useState([])
  const [CoursesValue, setCoursesValue] = useState([])
  const [messageValue, setMessageValue] = useState(EditorState.createEmpty())
  const [messageSend, setMessageSend] = useState()

  const [visibility, setVisibility] = useState({
    cc: false,
    bcc: false
  })

  const getRawContentState = () => {
    const contentState = messageValue.getCurrentContent()

    return JSON.stringify(convertToRaw(contentState))
  }
  const toggleVisibility = value => setVisibility({ ...visibility, [value]: !visibility[value] })

  const handleMailDelete = (value, state, setState) => {
    const arr = state
    const index = arr.findIndex(i => i.value === value)
    arr.splice(index, 1)
    setState([...arr])
  }
  const handleEmailSend = () => {
    const contentState = messageValue.getCurrentContent()
    const htmlContent = stateToHTML(contentState)
    setEmailTo(emailTo)
    setccValue(ccValue)
    setbccValue(bccValue)
    setVisibility(visibility)
    setMessageValue(messageValue)
    setSubjectValue(subjectValue)
    const formData = new FormData()
    formData.append('subject', subjectValue)
    if (emailTo.length > 0) {
      formData.append('Emails', emailTo)
    }
    if (CoursesValue.length > 0) {
      formData.append('CourseId', CoursesValue)
    }
    if (bccValue.length > 0) {
      formData.append('Role', bccValue)
    }
    formData.append('Message', htmlContent)

    if (attachments.length > 0) {
      for (let i = 0; i < attachments.length; i++) {
        formData.append('files', attachments[i]) // Append each file, 'files[]' indicates an array
      }
    }

    dispatch(postMail(formData))
    handlePopupClose()
  }
  const handlePopupClose = () => {
    toggleComposeOpen()
    setEmailTo([])
    setccValue([])
    setbccValue([])
    setCoursesValue([])
    setSubjectValue('')
    setMessageValue(EditorState.createEmpty())
    setVisibility({
      cc: false,
      bcc: false
    })
    setAttachments([])
  }

  const handleMinimize = () => {
    toggleComposeOpen()
    setEmailTo(emailTo)
    setccValue(ccValue)
    setbccValue(bccValue)
    setVisibility(visibility)
    setMessageValue(messageValue)
    setSubjectValue(subjectValue)
  }

  const renderCustomChips = (array, getTagProps, state, setState) => {
    return array.map((item, index) => (
      <Chip
        size='small'
        key={item.value}
        label={item}
        {...getTagProps({ index })}
        deleteIcon={<Icon icon='tabler:x' />}
        onDelete={() => handleMailDelete(item.value, state, setState)}
      />
    ))
  }

  const renderListItem = (props, option, array, setState) => {
    return (
      <ListItem
        {...props}
        key={option.value}
        sx={{ cursor: 'pointer' }}
        onClick={() => setState([...array, option.email])}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {option.length ? (
            <CustomAvatar src={option.email} alt={option.email} sx={{ mr: 3, width: 22, height: 22 }} />
          ) : (
            <CustomAvatar skin='light' color='primary' sx={{ mr: 3, width: 22, height: 22, fontSize: '.75rem' }}>
              {getInitials(option.email)}
            </CustomAvatar>
          )}
          <Typography sx={{ fontSize: theme => theme.typography.body2.fontSize }}>
            {option.role + ' : ' + option.email}
          </Typography>
        </Box>
      </ListItem>
    )
  }
  const renderListItemCourses = (props, option, array, CoursesValue, setState, setCourse) => {
    return (
      <ListItem
        {...props}
        key={option.value}
        sx={{ cursor: 'pointer' }}
        onClick={() => {
          setState([...array, option.name])
          setCourse([...CoursesValue, option.id])
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {option.length ? (
            <CustomAvatar src={option.name} alt={option.name} sx={{ mr: 3, width: 22, height: 22 }} />
          ) : (
            <CustomAvatar skin='light' color='primary' sx={{ mr: 3, width: 22, height: 22, fontSize: '.75rem' }}>
              {getInitials(option.name)}
            </CustomAvatar>
          )}
          <Typography sx={{ fontSize: theme => theme.typography.body2.fontSize }}>{option.name}</Typography>
        </Box>
      </ListItem>
    )
  }
  const renderListItemRoles = (props, option, array, setState) => {
    return (
      <ListItem {...props} key={option.value} sx={{ cursor: 'pointer' }} onClick={() => setState([...array, option])}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {option.length ? (
            <CustomAvatar src={option} alt={option} sx={{ mr: 3, width: 22, height: 22 }} />
          ) : (
            <CustomAvatar skin='light' color='primary' sx={{ mr: 3, width: 22, height: 22, fontSize: '.75rem' }}>
              {getInitials(option)}
            </CustomAvatar>
          )}
          <Typography sx={{ fontSize: theme => theme.typography.body2.fontSize }}>{option}</Typography>
        </Box>
      </ListItem>
    )
  }
  // Local image upload callback
  const uploadImageCallback = file => {
    return new Promise((resolve, reject) => {
      try {
        // Create a local URL for the uploaded image
        const imageUrl = URL.createObjectURL(file)

        // Resolve with the local image URL (this will insert the image into the editor)
        resolve({ data: { link: imageUrl } })
      } catch (error) {
        reject(error.toString())
      }
    })
  }
  const addNewOption = (options, params) => {
    const filtered = filter(options, params)
    const { inputValue } = params
    const isExisting = options.some(option => inputValue === option.email)
    if (inputValue !== '' && !isExisting) {
      filtered.push({
        email: inputValue,
        value: inputValue
      })
    }

    // @ts-ignore
    return filtered
  }

  return (
    <Drawer
      hideBackdrop
      elevation={18}
      anchor='bottom'
      open={composeOpen}
      variant='temporary'
      onClose={toggleComposeOpen}
      sx={{
        top: 'auto',
        left: 'auto',
        display: 'block',
        bottom: theme => theme.spacing(5),
        zIndex: theme => theme.zIndex.drawer + 1,
        right: theme => theme.spacing(mdAbove ? 6 : 4),
        '& .Mui-focused': { boxShadow: 'none !important' },
        '& .MuiDrawer-paper': {
          borderRadius: 1,
          position: 'static',
          width: composePopupWidth
        }
      }}
    >
      <Box
        sx={{
          px: 5,
          py: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'action.hover'
        }}
      >
        <Typography variant='h5' sx={{ fontWeight: 500 }}>
          {t('Compose Mail')}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton sx={{ p: 1, mr: 2 }} onClick={handleMinimize}>
            <Icon icon='tabler:minus' fontSize={20} />
          </IconButton>
          <IconButton sx={{ p: 1 }} onClick={handlePopupClose}>
            <Icon icon='tabler:x' fontSize={20} />
          </IconButton>
        </Box>
      </Box>
      <Box
        sx={{
          px: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: theme => `1px solid ${theme.palette.divider}`
        }}
      >
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
          <div>
            <InputLabel
              htmlFor='email-to-select'
              sx={{ mr: 3, fontSize: theme => theme.typography.body2.fontSize, lineHeight: 1.539 }}
            >
              {t('To:')}
            </InputLabel>
          </div>
          <CustomAutocomplete
            multiple
            freeSolo
            value={emailTo}
            clearIcon={false}
            id='email-to-select'
            filterSelectedOptions
            options={users}
            ListboxComponent={List}
            filterOptions={addNewOption}
            getOptionLabel={option => option.email}
            renderOption={(props, option) => renderListItem(props, option, emailTo, setEmailTo)}
            renderTags={(array, getTagProps) => renderCustomChips(array, getTagProps, emailTo, setEmailTo)}
            sx={{
              width: '100%',
              '& .MuiOutlinedInput-root': { p: 2 },
              '& .MuiAutocomplete-endAdornment': { display: 'none' }
            }}
            renderInput={params => (
              <CustomTextField
                {...params}
                placeholder={t('Enter email addresses')}
                autoComplete='new-password'
                sx={{
                  '& .MuiFilledInput-root.MuiInputBase-sizeSmall': { border: '0 !important', p: '0 !important' },
                  '& .MuiFilledInput-input.MuiInputBase-inputSizeSmall': {
                    px: theme => `${theme.spacing(1.5)} !important`,
                    py: theme => `${theme.spacing(2.125)} !important`
                  }
                }}
              />
            )}
          />
        </Box>
        <Typography variant='body2' sx={{ color: 'primary.main' }}>
          <Box component='span' sx={{ cursor: 'pointer' }} onClick={() => toggleVisibility('cc')}>
            {t('roles')}
          </Box>
          <Box component='span' sx={{ mx: 1 }}>
            |
          </Box>
          <Box component='span' sx={{ cursor: 'pointer' }} onClick={() => toggleVisibility('bcc')}>
            {t('courses')}
          </Box>
        </Typography>
      </Box>
      {visibility.bcc ? (
        <Box
          sx={{
            px: 5,
            display: 'flex',
            alignItems: 'center',
            borderBottom: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <div>
            <InputLabel sx={{ mr: 3, fontSize: theme => theme.typography.body2.fontSize }} htmlFor='email-bcc-select'>
              {t('Course:')}
            </InputLabel>
          </div>
          <CustomAutocomplete
            multiple
            freeSolo
            value={ccValue}
            clearIcon={false}
            id='email-to-select'
            filterSelectedOptions
            options={data}
            ListboxComponent={List}
            getOptionLabel={option => option.name}
            renderOption={(props, option) =>
              renderListItemCourses(props, option, ccValue, CoursesValue, setccValue, setCoursesValue)
            }
            renderTags={(array, getTagProps) => renderCustomChips(array, getTagProps, ccValue, setccValue)}
            sx={{
              width: '100%',
              '& .MuiOutlinedInput-root': { p: 2 },
              '& .MuiAutocomplete-endAdornment': { display: 'none' }
            }}
            renderInput={params => (
              <CustomTextField
                {...params}
                placeholder={t('Select courses')}
                autoComplete='new-password'
                sx={{
                  '& .MuiFilledInput-root.MuiInputBase-sizeSmall': { border: '0 !important', p: '0 !important' },
                  '& .MuiFilledInput-input.MuiInputBase-inputSizeSmall': {
                    px: theme => `${theme.spacing(1.5)} !important`,
                    py: theme => `${theme.spacing(2.125)} !important`
                  }
                }}
              />
            )}
          />
        </Box>
      ) : null}
      {visibility.cc ? (
        <Box
          sx={{
            px: 5,
            display: 'flex',
            alignItems: 'center',
            borderBottom: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <div>
            <InputLabel sx={{ mr: 3, fontSize: theme => theme.typography.body2.fontSize }} htmlFor='email-cc-select'>
              {t('Role:')}
            </InputLabel>
          </div>
          <CustomAutocomplete
            multiple
            freeSolo
            value={bccValue}
            clearIcon={false}
            id='email-to-select'
            filterSelectedOptions
            options={roles}
            ListboxComponent={List}
            getOptionLabel={option => option}
            renderOption={(props, option) => renderListItemRoles(props, option, bccValue, setbccValue)}
            renderTags={(array, getTagProps) => renderCustomChips(array, getTagProps, bccValue, setbccValue)}
            sx={{
              width: '100%',
              '& .MuiOutlinedInput-root': { p: 2 },
              '& .MuiAutocomplete-endAdornment': { display: 'none' }
            }}
            renderInput={params => (
              <CustomTextField
                {...params}
                placeholder={t('Select roles')}
                autoComplete='new-password'
                sx={{
                  '& .MuiFilledInput-root.MuiInputBase-sizeSmall': { border: '0 !important', p: '0 !important' },
                  '& .MuiFilledInput-input.MuiInputBase-inputSizeSmall': {
                    px: theme => `${theme.spacing(1.5)} !important`,
                    py: theme => `${theme.spacing(2.125)} !important`
                  }
                }}
              />
            )}
          />
        </Box>
      ) : null}

      <Box
        sx={{
          px: 5,
          display: 'flex',
          alignItems: 'center',
          borderBottom: theme => `1px solid ${theme.palette.divider}`
        }}
      >
        <div>
          <InputLabel
            htmlFor='email-subject-input'
            sx={{ mr: 3, fontSize: theme => theme.typography.body2.fontSize, lineHeight: 1.539 }}
          >
            {t('Subject:')}
          </InputLabel>
        </div>
        <Input
          fullWidth
          value={subjectValue}
          id='email-subject-input'
          placeholder={t('Enter subject')}
          onChange={e => setSubjectValue(e.target.value)}
          sx={{
            '&:before, &:after': { display: 'none' },
            '& .MuiInput-input': {
              px: theme => `${theme.spacing(1.5)} !important`,
              py: theme => `${theme.spacing(2.125)} !important`
            }
          }}
        />
      </Box>
      <EditorWrapper
        sx={{
          '& .rdw-editor-wrapper .rdw-editor-main': { px: 5 },
          '& .rdw-editor-wrapper, & .rdw-option-wrapper': { border: 0 }
        }}
      >
        <ReactDraftWysiwyg
          editorState={messageValue}
          onEditorStateChange={newEditorState => setMessageValue(newEditorState)}
          placeholder={t('Write your message...')}
          toolbar={{
            options: ['inline', 'list', 'link'],
            inline: { inDropdown: false, options: ['bold', 'italic', 'underline'] },
            list: { inDropdown: false, options: ['unordered', 'ordered'] },
            link: { inDropdown: false, options: ['link'] },
            image: {
              uploadCallback: uploadImageCallback, // Add the file upload function here
              alt: { present: true, mandatory: false },
              previewImage: true,
              inputAccept: 'image/*'
            }
          }}
        />
      </EditorWrapper>
      <Box
        sx={{
          py: 4,
          px: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: theme => `1px solid ${theme.palette.divider}`
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button variant='contained' onClick={handleEmailSend} sx={{ '& svg': { mr: 2 } }}>
            <Icon icon='tabler:send' fontSize='1.125rem' />
            {t('Send')}
          </Button>
          <Button variant='text' component='label' sx={{ mr: 2 }}>
            <Icon icon='tabler:paperclip' fontSize='1.125rem' />
            {t('Attach Files')}
            <input
              type='file'
              multiple // Enable multiple file selection
              hidden
              onChange={handleFileChange} // Handle file selection
            />
          </Button>

          {/* Display selected file names */}
          <Box sx={{ ml: 2 }}>
            {attachments.length > 0 &&
              attachments.map((file, index) => (
                <p key={index}>{file.name}</p> // Display each file name
              ))}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton size='small' onClick={handlePopupClose}>
            <Icon icon='tabler:trash' fontSize='1.25rem' />
          </IconButton>
        </Box>
      </Box>
    </Drawer>
  )
}

export default ComposePopup
