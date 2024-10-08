// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useContext } from 'react'
// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import Translations from 'src/layouts/components/Translations'
import { AbilityContext } from 'src/layouts/components/acl/Can'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { t } from 'i18next'

const TableHeader = props => {
  const ability = useContext(AbilityContext)
  // ** Props
  const { handleFilter, toggle, value, setValue, handleApproveAllReports } = props

  // const handleChange = e => {
  //   setValue(e.target.value)
  //   handleFilter(e.target.value)
  // }

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
        {/* <CustomTextField value={value} sx={{ mr: 4 }} placeholder={t('Search Students')} onChange={handleChange} /> */}

        {ability.can('approve', 'Report') && (
          <Button
            color='success'
            onClick={() => handleApproveAllReports()}
            variant='contained'
            sx={{ '& svg': { mr: 2 } }}
          >
            <Icon fontSize='1.125rem' icon='oui:pages-select' />
            <Translations text={'Approve all page'} />
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default TableHeader
