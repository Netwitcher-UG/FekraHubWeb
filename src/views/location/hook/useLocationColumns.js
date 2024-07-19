import React, { useMemo } from 'react'
import { Typography } from '@mui/material'

import Translations from 'src/layouts/components/Translations'

const useLocationColumns = () => {
  const columns = useMemo(
    () => [
      {
        width: 200,
        field: 'id',
        headerName: <Translations text={'Id'} />,
        renderCell: params => {
          params.row.id
        }
      },
      {
        width: 200,
        field: 'name',
        headerName: <Translations text={'Name'} />,
        renderCell: params => {
          params.row.name
        }
      },
      {
        width: 200,
        field: 'street',
        headerName: <Translations text={'street'} />,
        renderCell: params => {
          return <Typography>{params.row.street}</Typography>
        }
      },
      {
        width: 200,
        field: 'streetNr',
        headerName: <Translations text={'streetNr'} />,
        renderCell: params => {
          return <Typography>{params.row.streetNr}</Typography>
        }
      },
      {
        width: 200,
        field: 'zipCode',
        headerName: <Translations text={'zipCode'} />,
        renderCell: params => {
          return <Typography>{params.row.teacher?.zipCode}</Typography>
        }
      },
      {
        width: 200,
        field: 'city',
        headerName: <Translations text={'city'} />,
        renderCell: params => {
          params.row.city
        }
      }
    ],
    []
  )

  return {
    columns
  }
}

export default useLocationColumns
