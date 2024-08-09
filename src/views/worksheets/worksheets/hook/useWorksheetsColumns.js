import React, { useCallback, useContext, useMemo, useState } from 'react'
import { Stack, IconButton, Typography } from '@mui/material'
import Translations from 'src/layouts/components/Translations'
import { useDispatch } from 'react-redux'
import { deleteWorksheet } from 'src/store/apps/worksheets/worksheets'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { AbilityContext } from 'src/layouts/components/acl/Can'

const useWorksheetsColumns = () => {
  const dispatch = useDispatch()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [DeleteName, setDeleteName] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [drawerData, setDrawerData] = useState(null)
  const [open, setOpen] = useState(false)
  const ability = useContext(AbilityContext)

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
    setDeleteName(params.fileName)
    console.log('🚀 ~ handleDeleteClick ~ params:', params)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
  }

  const handleDelete = () => {
    dispatch(deleteWorksheet(selectedId))
    setIsDialogOpen(false)
  }

  // <Link href={`/contracts/view/${params?.row?.user_id}`}>

  const columns = useMemo(
    () => [
      {
        flex: 0.9,
        field: 'courses',
        headerName: <Translations text={'Courses'} />,
        renderCell: params => {
          const courseNames = params.row?.courses?.map(val => val.name).join(' - ') || ''
          return <Typography>{courseNames}</Typography>
        }
      },
      {
        flex: 1,
        field: 'fileName',
        headerName: <Translations text={'File'} />,
        renderCell: params => {
          return <Typography>{params.row.fileName}</Typography>
        }
      },
      {
        flex: 1,
        field: 'typeUPload',
        headerName: <Translations text={'TypeUPload'} />,
        renderCell: params => {
          return <Typography>{params.row.typeUPload}</Typography>
        }
      },
      {
        flex: 0.5,
        field: 'action',
        headerName: <Translations text={'Action'} />,
        renderCell: params => {
          const fileName = params.row.file
          const pageNumber = params.row.pageNumber || 1

          return (
            <Stack direction={'row'} alignItems={'center'}>
              {ability.can('delete', 'File') && (
                <IconButton onClick={() => handleDeleteClick(params.row)}>
                  <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'>
                    <path
                      fill='currentColor'
                      d='M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zM8 9h8v10H8zm7.5-5l-1-1h-5l-1 1H5v2h14V4z'
                    ></path>
                  </svg>
                </IconButton>
              )}
              <IconButton>
                <Link
                  href={`/worksheets/worksheets/view/${params?.row?.id}`}
                  target='_blank'
                  style={{ color: 'inherit' }}
                >
                  <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'>
                    <g
                      fill='none'
                      stroke='currentColor'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      stroke-width='2'
                    >
                      <path d='M10 12a2 2 0 1 0 4 0a2 2 0 0 0-4 0' />
                      <path d='M21 12q-3.6 6-9 6t-9-6q3.6-6 9-6t9 6' />
                    </g>
                  </svg>
                </Link>
              </IconButton>
            </Stack>
          )
        }
      }
    ],
    [handleDeleteClick]
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

export default useWorksheetsColumns
