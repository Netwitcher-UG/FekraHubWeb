import React, { useMemo, useState, useCallback } from 'react'
import { Stack, Typography, IconButton } from '@mui/material'
import moment from 'moment'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useDispatch } from 'react-redux'
import { deleteCourse } from 'src/store/apps/courses'

const useCoursesColumns = () => {
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
    dispatch(deleteCourse(selectedId))
    setIsDialogOpen(false)
  }

  const columns = useMemo(
    () => [
      {
        flex: 0.3,
        field: 'id',
        headerName: <Typography className='custom-style-columns'>Id</Typography>,
        renderCell: params => {
          params.row.id
        }
      },
      {
        flex: 0.3,
        field: 'name',
        headerName: <Typography className='custom-style-columns'>Name</Typography>,
        renderCell: params => {
          params.row.name
        }
      },
      {
        flex: 0.3,
        field: 'startDate',
        headerName: <Typography className='custom-style-columns'>start Date</Typography>,
        renderCell: params => {
          return <Typography>{moment(params.row.startDate).format('YYYY-MM-DD')}</Typography>
        }
      },
      {
        flex: 0.3,
        field: 'endDate',
        headerName: <Typography className='custom-style-columns'>end Date</Typography>,
        renderCell: params => {
          return <Typography>{moment(params.row.endDate).format('YYYY-MM-DD')}</Typography>
        }
      },
      {
        flex: 0.3,
        field: 'teacher',
        headerName: <Typography className='custom-style-columns'>Teachers</Typography>,
        renderCell: params => {
          return <Typography>{params.row.teacher?.map(val => val.firstName)}</Typography>
        }
      },
      {
        flex: 0.3,
        field: 'lessons',
        headerName: <Typography className='custom-style-columns'> Lessons</Typography>,
        renderCell: params => {
          params.row.lessons
        }
      },
      {
        flex: 0.3,
        field: 'price',
        headerName: <Typography className='custom-style-columns'>price</Typography>,
        renderCell: params => {
          params.row.price
        }
      },
      {
        flex: 0.3,
        field: 'room',
        headerName: <Typography className='custom-style-columns'>room</Typography>,
        renderCell: params => {
          return params.row.room.name
        }
      },
      {
        flex: 0.3,
        field: 'action',
        headerName: <Typography className='custom-style-columns'>Action</Typography>,
        renderCell: params => {
          return (
            <Stack direction={'row'} alignItems={'center'}>
              <IconButton onClick={() => handleOpenDrawer(params.row)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDeleteClick(params.row)}>
                <DeleteIcon />
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

export default useCoursesColumns
