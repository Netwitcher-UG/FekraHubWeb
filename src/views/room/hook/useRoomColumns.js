import React, { useMemo } from 'react'
import { Stack, Typography, IconButton } from '@mui/material'

import Translations from 'src/layouts/components/Translations'

const useRoomColumns = () => {
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
        field: 'locationCity',
        headerName: <Translations text={'location City'} />,
        renderCell: params => {
          params.row.locationCity
        }
      },
      {
        width: 200,
        field: 'locationName',
        headerName: <Translations text={'location Name'} />,
        renderCell: params => {
          params.row.locationName
        }
      },
      {
        width: 200,
        field: 'locationStreet',
        headerName: <Translations text={'location Street'} />,
        renderCell: params => {
          params.row.locationStreet
        }
      },
      {
        width: 200,
        field: 'locationStreetNr',
        headerName: <Translations text={'location StreetNr'} />,
        renderCell: params => {
          params.row.locationStreetNr
        }
      },
      {
        width: 200,
        field: 'locationZipCode',
        headerName: <Translations text={'location ZipCode'} />,
        renderCell: params => {
          params.row.locationZipCode
        }
      }
    ],
    []
  )

  return {
    columns
  }
}

export default useRoomColumns
