import React, { useCallback, useContext, useMemo, useState } from 'react'
import { Stack, IconButton, Typography, Tooltip } from '@mui/material'
import Translations from 'src/layouts/components/Translations'
import { useDispatch, useSelector } from 'react-redux'
import { deleteWorksheet, DownloadUploadFile } from 'src/store/apps/worksheets'
import { CircularProgress } from '@mui/material'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Icon from 'src/@core/components/icon'

const useWorksheetsColumns = () => {
  const dispatch = useDispatch()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [DeleteName, setDeleteName] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [drawerData, setDrawerData] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [open, setOpen] = useState(false)
  const ability = useContext(AbilityContext)
  const [worksheetLoading, setWorsheetLoading] = useState(null)

  const handleOpenDrawer = useCallback(data => {
    setDrawerData(data)
    setOpen(true)
  }, [])

  const handleViewWorksheet = async file => {
    setWorsheetLoading(file?.id)
    const response = await dispatch(DownloadUploadFile(file?.id))
    setSelectedFile({ file: response?.payload, name: file?.fileName })
    setWorsheetLoading(null)
  }

  const handleCloseDrawer = useCallback(() => {
    setOpen(false)
    setDrawerData(null)
  }, [])

  const handleDeleteClick = params => {
    setIsDialogOpen(true)
    setSelectedId(params.id)
    setDeleteName(params.fileName)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
  }

  const handleDelete = () => {
    dispatch(deleteWorksheet(selectedId))
    setIsDialogOpen(false)
  }

  const columns = useMemo(
    () => [
      {
        flex: 0.5,
        field: 'action',
        headerName: <Translations text={'Actions'} />,
        renderCell: params => {
          return (
            <Stack direction={'row'} alignItems={'center'}>
              {ability.can('delete', 'File') && (
                <Tooltip title={<Translations text={'Delete Worksheet'} />}>
                  <IconButton color='error' onClick={() => handleDeleteClick(params.row)}>
                    <Icon icon='mdi:delete-outline' fontSize={25} />
                  </IconButton>
                </Tooltip>
              )}
              {worksheetLoading == params?.row?.id ? (
                <CircularProgress sx={{ ml: 2 }} size={22} />
              ) : (
                <Tooltip title={<Translations text={'View Worksheet'} />}>
                  <IconButton onClick={() => handleViewWorksheet(params?.row)}>
                    <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'>
                      <g fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'>
                        <path d='M10 12a2 2 0 1 0 4 0a2 2 0 0 0-4 0' />
                        <path d='M21 12q-3.6 6-9 6t-9-6q3.6-6 9-6t9 6' />
                      </g>
                    </svg>
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          )
        }
      },
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
        headerName: <Translations text={'Upload Type'} />,
        renderCell: params => {
          return <Typography>{params.row.typeUPload}</Typography>
        }
      }
    ],
    [ability, handleDeleteClick, handleViewWorksheet, worksheetLoading]
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
    DeleteName,
    selectedFile,
    setSelectedFile
  }
}

export default useWorksheetsColumns
