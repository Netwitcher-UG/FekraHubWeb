import React, { useCallback, useMemo, useState } from 'react'
import { IconButton, Typography } from '@mui/material'

import Translations from 'src/layouts/components/Translations'
import { useDispatch } from 'react-redux'
import { Stack } from '@mui/system'
import { deleteLocations } from 'src/store/apps/location'

const useLocationColumns = () => {
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
    dispatch(deleteLocations(selectedId))
    setIsDialogOpen(false)
  }

  const columns = useMemo(
    () => [
      // {
      //   width: 200,
      //   field: 'id',
      //   headerName: <Translations text={'Id'} />,
      //   renderCell: params => {
      //     params.row.id
      //   }
      // },
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
        headerName: <Translations text={'Street'} />,
        renderCell: params => {
          return <Typography>{params.row.street}</Typography>
        }
      },
      {
        width: 200,
        field: 'streetNr',
        headerName: <Translations text={'Street Number'} />,
        renderCell: params => {
          return <Typography>{params.row.streetNr}</Typography>
        }
      },
      {
        width: 200,
        field: 'zipCode',
        headerName: <Translations text={'Zip Code'} />,
        renderCell: params => {
          return <Typography>{params.row?.zipCode}</Typography>
        }
      },
      {
        width: 200,
        field: 'city',
        headerName: <Translations text={'City'} />,
        renderCell: params => {
          params.row.city
        }
      },
      {
        width: 200,
        field: 'action',
        headerName: <Translations text={'Action'} />,
        renderCell: params => {
          return (
            <Stack direction={'row'} alignItems={'center'}>
              <IconButton onClick={() => handleOpenDrawer(params.row)}>
                <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'>
                  <path
                    fill='currentColor'
                    d='M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z'
                  ></path>
                </svg>
              </IconButton>
              <IconButton onClick={() => handleDeleteClick(params.row)}>
                <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'>
                  <path
                    fill='currentColor'
                    d='M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zM8 9h8v10H8zm7.5-5l-1-1h-5l-1 1H5v2h14V4z'
                  ></path>
                </svg>
              </IconButton>
            </Stack>
          )
        }
      }
    ],
    []
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

export default useLocationColumns
