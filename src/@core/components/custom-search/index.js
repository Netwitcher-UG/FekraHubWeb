import React from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import InputAdornment from '@mui/material/InputAdornment'
import { useTranslation } from 'react-i18next'

export default function CustomSearch({ SetSearch, value, handleSearch, inTable = false, sx, ...props }) {
  const { t } = useTranslation()

  const handleChange = event => {
    if (inTable && handleSearch) {
      handleSearch(event)
    } else if (SetSearch) {
      SetSearch(event.target.value)
    }
  }

  return (
    <CustomTextField
      fullWidth
      placeholder={t('Search')}
      value={value || ''}
      onChange={handleChange}
      size='small'
      InputProps={{
        startAdornment: (
          <InputAdornment position='start'>
            <Icon icon='mdi:magnify' fontSize={20} />
          </InputAdornment>
        )
      }}
      sx={{
        maxWidth: { xs: '100%', sm: '432px' },
        ...sx
      }}
      {...props}
    />
  )
}
