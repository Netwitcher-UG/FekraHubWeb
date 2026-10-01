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
import { downloadStudentsExcelTemplate, exportStudents, importStudentsFromExcel } from 'src/store/apps/students'
import CircularProgress from '@mui/material/CircularProgress'
import { useTranslation } from 'react-i18next'
import { ShowSuccessToast } from 'src/@core/utils/ShowSuccesToast'
import { useContext } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'

const TableHeader = props => {
  // ** Props
  const { handleFilter, value, setValue, selectedCourse } = props
  const ability = useContext(AbilityContext)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { downloadTemplateLoading, importFromExcelLoading, exportStudentsLoading } = useSelector(state => state.students)

  const [anchorEl, setAnchorEl] = React.useState(null)
  const menuOpen = Boolean(anchorEl)
  const handleMenuOpen = event => setAnchorEl(event.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)

  const [exportAnchorEl, setExportAnchorEl] = React.useState(null)
  const exportMenuOpen = Boolean(exportAnchorEl)
  const handleExportMenuOpen = event => setExportAnchorEl(event.currentTarget)
  const handleExportMenuClose = () => setExportAnchorEl(null)

  const [errorDialogOpen, setErrorDialogOpen] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState('')
  const [errorDialogTitle, setErrorDialogTitle] = React.useState('')
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

        setErrorDialogTitle(t('Import failed!'))
        setErrorMessage(errorMsg)
        setErrorDialogOpen(true)
      }
    }
    // reset input so same file can be selected again later
    event.target.value = ''
  }

  const readErrorMessage = async errorResponse => {
    let errorMsg = t('An error occurred while exporting')
    const data = errorResponse?.data

    if (data instanceof Blob) {
      try {
        const text = await data.text()
        try {
          const parsed = JSON.parse(text)
          if (parsed?.message) {
            errorMsg = Array.isArray(parsed.message) ? parsed.message.join(', ') : parsed.message
          } else if (parsed?.error) {
            errorMsg = Array.isArray(parsed.error) ? parsed.error.join(', ') : parsed.error
          } else if (text) {
            errorMsg = text
          }
        } catch {
          if (text) errorMsg = text
        }
      } catch {
        errorMsg = t('An error occurred while exporting')
      }
    } else if (typeof data === 'string' && data) {
      errorMsg = data
    } else if (data && typeof data === 'object') {
      if (data?.message) {
        errorMsg = Array.isArray(data.message) ? data.message.join(', ') : data.message
      } else if (data?.error) {
        errorMsg = Array.isArray(data.error) ? data.error.join(', ') : data.error
      }
    } else if (errorResponse?.message) {
      errorMsg = errorResponse.message
    }

    return errorMsg
  }

  const handleExport = async format => {
    handleExportMenuClose()
    try {
      const res = await dispatch(
        exportStudents({
          search: value || '',
          course: selectedCourse,
          format
        })
      ).unwrap()

      if (res?.data) {
        const blob = res.data
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = format === 'pdf' ? 'Students.pdf' : 'Students.xlsx'
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      const errorResponse = error?.payload || error
      const errorMsg = await readErrorMessage(errorResponse)
      setErrorDialogTitle(t('Export failed!'))
      setErrorMessage(errorMsg)
      setErrorDialogOpen(true)
    }
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
        justifyContent: 'space-between'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <CustomSearch value={value} handleSearch={handleChange} inTable={true} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <input ref={fileInputRef} type='file' accept='.xlsx,.xls' hidden onChange={onFileSelected} />
        <Button
          onClick={handleExportMenuOpen}
          variant='contained'
          disabled={exportStudentsLoading}
          sx={{ '& svg': { ml: 2 } }}
          endIcon={
            exportStudentsLoading ? (
              <CircularProgress size={18} color='inherit' />
            ) : (
              <Icon fontSize='1.125rem' icon='tabler:chevron-down' />
            )
          }
        >
          <Translations text={'Export'} />
        </Button>
        <Menu anchorEl={exportAnchorEl} open={exportMenuOpen} onClose={handleExportMenuClose}>
          <MenuItem onClick={() => handleExport('excel')} disabled={exportStudentsLoading}>
            <Icon fontSize='1.125rem' icon='tabler:file-spreadsheet' />
            <Box sx={{ ml: 2 }}>
              <Translations text={'Excel'} />
            </Box>
          </MenuItem>
          <MenuItem onClick={() => handleExport('pdf')} disabled={exportStudentsLoading}>
            <Icon fontSize='1.125rem' icon='tabler:file-text' />
            <Box sx={{ ml: 2 }}>
              <Translations text={'PDF'} />
            </Box>
          </MenuItem>
        </Menu>
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
        title={errorDialogTitle}
        message={errorMessage}
      />
    </Box>
  )
}

export default TableHeader
