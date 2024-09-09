// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import Translations from 'src/layouts/components/Translations'
import CustomSearch from 'src/@core/components/custom-search'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { t } from 'i18next'

const TableHeader = props => {
  // ** Props
  const { handleFilter, toggle, value, setValue } = props

  const handleChange = e => {
    setValue(e.target.value)
    handleFilter(e.target.value)
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

        <Button onClick={toggle} variant='contained' sx={{ '& svg': { mr: 2 } }}>
          <Icon fontSize='1.125rem' icon='tabler:plus' />
          <Translations text={'Add New Invoice'} />
        </Button>
      </Box>
    </Box>
  )
}

export default TableHeader
