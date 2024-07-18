import React, { useMemo, useState, useCallback } from 'react'
import { Stack, Typography, IconButton } from '@mui/material'

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
          return <Typography>{params.row.startDate?.slice(0, 10)}</Typography>
        }
      },
      {
        flex: 0.3,
        field: 'endDate',
        headerName: <Typography className='custom-style-columns'>end Date</Typography>,
        renderCell: params => {
          return <Typography>{params.row.endDate?.slice(0, 10)}</Typography>
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

export default useCoursesColumns
