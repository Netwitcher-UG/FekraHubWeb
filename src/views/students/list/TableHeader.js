// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import React from 'react'
// ** Custom Component Import
import Translations from 'src/layouts/components/Translations'
import CustomSearch from 'src/@core/components/custom-search'
import CustomErrorDialog from 'src/@core/components/custom-error-dialog'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useDispatch, useSelector } from 'react-redux'
import { downloadStudentsExcelTemplate, importStudentsFromExcel } from 'src/store/apps/students'
import CircularProgress from '@mui/material/CircularProgress'
import { useTranslation } from 'react-i18next'
import { ShowSuccessToast } from 'src/@core/utils/ShowSuccesToast'
import { useContext } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'

const TableHeader = props => {
  // ** Props
  const { handleFilter, toggle, value, setValue } = props
  const ability = useContext(AbilityContext)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { downloadTemplateLoading, importFromExcelLoading } = useSelector(state => state.students)

  const [anchorEl, setAnchorEl] = React.useState(null)
  const menuOpen = Boolean(anchorEl)
  const handleMenuOpen = event => setAnchorEl(event.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)

  const [errorDialogOpen, setErrorDialogOpen] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState('')
  const handleErrorDialogOpen = () => setErrorDialogOpen(true)
  const handleErrorDialogClose = () => setErrorDialogOpen(false)

  const handleChange = e => {
    setValue(e.target.value)
    handleFilter(e.target.value)
  }

  const handleDownloadTemplate = async () => {
    handleMenuClose()
    const res = await dispatch(downloadStudentsExcelTemplate()).unwrap()
    if (res?.data) {
      const blob = res.data
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'StudentsTemplate.xlsx'
      a.click()
      window.URL.revokeObjectURL(url)
    }
  }

  const fileInputRef = React.useRef(null)
  const handleImportClick = () => {
    handleMenuClose()
    fileInputRef.current?.click()
  }
  const onFileSelected = async event => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        await dispatch(importStudentsFromExcel(file)).unwrap()
        ShowSuccessToast(t('File imported successfully'))
      } catch (error) {
        // Extract error message from the error response
        let errorMsg = t('An error occurred while importing the file')

        // Handle rejectWithValue from Redux thunk
        const errorResponse = error?.payload || error

        if (errorResponse?.data) {
          const data = errorResponse.data
          // Handle plain text response (string)
          if (typeof data === 'string') {
            errorMsg = data
          }
          // Handle JSON response
          else if (typeof data === 'object') {
            if (data?.message) {
              errorMsg = Array.isArray(data.message) ? data.message.join(', ') : data.message
            } else if (data?.error) {
              errorMsg = Array.isArray(data.error) ? data.error.join(', ') : data.error
            } else if (data?.errors) {
              errorMsg = Array.isArray(data.errors) ? data.errors.join(', ') : JSON.stringify(data.errors)
            }
          }
        } else if (errorResponse?.message) {
          errorMsg = errorResponse.message
        } else if (typeof error === 'string') {
          errorMsg = error
        }

        setErrorMessage(errorMsg)
        handleErrorDialogOpen()
      }
    }
    // reset input so same file can be selected again later
    event.target.value = ''
  }

  return (
    <Box
      sx={{
        py: 4,
        px: 6,
        rowGap: 2,
        columnGap: 4,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'flex-end'
      }}
    >
      <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <CustomSearch value={value} handleSearch={handleChange} inTable={true} />
        <input ref={fileInputRef} type='file' accept='.xlsx,.xls' hidden onChange={onFileSelected} />
        {ability.can('manage', 'ExcelMigration') && (
          <Button
            onClick={handleMenuOpen}
            variant='contained'
            sx={{ '& svg': { ml: 2 } }}
            endIcon={<Icon fontSize='1.125rem' icon='tabler:chevron-down' />}
          >
            <Translations text={'Import from Excel'} />
          </Button>
        )}
        <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
          <MenuItem onClick={handleDownloadTemplate} disabled={downloadTemplateLoading}>
            {downloadTemplateLoading ? (
              <CircularProgress size={18} sx={{ mr: 2 }} />
            ) : (
              <Icon fontSize='1.125rem' icon='tabler:download' />
            )}
            <Box sx={{ ml: 2 }}>
              <Translations text={'Download template'} />
            </Box>
          </MenuItem>
          <MenuItem onClick={handleImportClick} disabled={importFromExcelLoading}>
            {importFromExcelLoading ? (
              <CircularProgress size={18} sx={{ mr: 2 }} />
            ) : (
              <Icon fontSize='1.125rem' icon='tabler:upload' />
            )}
            <Box sx={{ ml: 2 }}>
              <Translations text={'Import file'} />
            </Box>
          </MenuItem>
        </Menu>
      </Box>
      <CustomErrorDialog
        open={errorDialogOpen}
        onClose={handleErrorDialogClose}
        title={t('Import failed!')}
        message={errorMessage}
      />
    </Box>
  )
}

export default TableHeader
