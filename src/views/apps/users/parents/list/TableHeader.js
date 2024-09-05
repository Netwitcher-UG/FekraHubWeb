// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useContext } from 'react'

// ** Custom Component Import
// import CustomTextField from 'src/@core/components/mui/text-field'
import Translations from 'src/layouts/components/Translations'
import { useRouter } from 'next/router'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { AbilityContext } from 'src/layouts/components/acl/Can'

const TableHeader = props => {
  // ** Props
  const { handleFilter, toggle, value, setValue } = props
  const router = useRouter()
  const ability = useContext(AbilityContext)

  //   const handleChange = e => {
  //     setValue(e.target.value)
  //     handleFilter(e.target.value)
  //   }

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
        {/* <CustomTextField value={value} sx={{ mr: 4 }} placeholder={t('Search Time Off')} onChange={handleChange} /> */}

        {ability.can('create', 'User') && (
          <Button
            onClick={() => router.push('/users/parents/add-parent')}
            variant='contained'
            sx={{ '& svg': { mr: 2 } }}
          >
            <Icon fontSize='1.125rem' icon='tabler:plus' />
            <Translations text={'Add New Parent'} />
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default TableHeader
