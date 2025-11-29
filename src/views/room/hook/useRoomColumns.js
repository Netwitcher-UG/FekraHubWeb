import React, { useCallback, useMemo, useState } from 'react'
import { Stack, IconButton, Tooltip } from '@mui/material'

import Translations from 'src/layouts/components/Translations'
import { useDispatch } from 'react-redux'
import { deleteRoom } from 'src/store/apps/courses'
import Icon from 'src/@core/components/icon'

const useRoomColumns = () => {
  const dispatch = useDispatch()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [DeleteName, setDeleteName] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [drawerData, setDrawerData] = useState(null)
  const [open, setOpen] = useState(false)

  const handleOpenDrawer = useCallback(data => {
    setDrawerData(data)
    setOpen(true)
  }, [])

  const handleCloseDrawer = useCallback(() => {
    setOpen(false)
    setDrawerData(null)
  }, [])

  const handleDeleteClick = params => {
    setIsDialogOpen(true)
    setSelectedId(params.id)
    setDeleteName(params.name)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
  }

  const handleDelete = () => {
    dispatch(deleteRoom(selectedId))
    setIsDialogOpen(false)
  }
  const columns = useMemo(
    () => [
      {
        width: 200,
        field: 'action',
        headerName: <Translations text={'Actions'} />,
        renderCell: params => {
          return (
            <Stack direction={'row'} alignItems={'center'}>
              <Tooltip title={<Translations text={'Edit Room'} />}>
                <IconButton onClick={() => handleOpenDrawer(params.row)}>
                  <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'>
                    <path
                      fill='currentColor'
                      d='M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z'
                    ></path>
                  </svg>
                </IconButton>
              </Tooltip>
              <Tooltip title={<Translations text={'Delete Room'} />}>
                <IconButton color='error' onClick={() => handleDeleteClick(params.row)}>
                  <Icon icon='mdi:delete-outline' fontSize={25} />
                </IconButton>
              </Tooltip>
            </Stack>
          )
        }
      },
      {
        width: 200,
        field: 'name',
        headerName: <Translations text={'Name'} />,
        renderCell: params => {
          return params.row.name
        }
      },
      {
        width: 200,
        field: 'locationCity',
        headerName: <Translations text={'location City'} />,
        renderCell: params => {
          return params.row.locationCity
        }
      },
      {
        width: 200,
        field: 'locationName',
        headerName: <Translations text={'location Name'} />,
        renderCell: params => {
          return params.row.locationName
        }
      },
      {
        width: 200,
        field: 'locationStreet',
        headerName: <Translations text={'location Street'} />,
        renderCell: params => {
          return params.row.locationStreet
        }
      },
      {
        width: 200,
        field: 'locationStreetNr',
        headerName: <Translations text={'location StreetNr'} />,
        renderCell: params => {
          return params.row.locationStreetNr
        }
      },
      {
        width: 200,
        field: 'locationZipCode',
        headerName: <Translations text={'location ZipCode'} />,
        renderCell: params => {
          return params.row.locationZipCode
        }
      }
    ],
    [handleOpenDrawer, handleDeleteClick]
  )

  return {
    columns,
    isDialogOpen,
    handleCloseDialog,
    handleDelete,
    drawerData,
    open,
    handleOpenDrawer,
    handleCloseDrawer,
    DeleteName
  }
}

export default useRoomColumns
