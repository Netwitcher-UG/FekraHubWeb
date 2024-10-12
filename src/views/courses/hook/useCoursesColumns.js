import React, { useMemo, useState, useCallback, useContext } from 'react'
import { Stack, Typography, IconButton } from '@mui/material'

import { useDispatch } from 'react-redux'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { deleteCourse } from 'src/store/apps/courses'
import Translations from 'src/layouts/components/Translations'
import moment from 'moment'
import Icon from 'src/@core/components/icon'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { fetchCourseAttendanceReport } from 'src/store/apps/attendance'
import { downloadBase64File } from 'src/@core/utils/download-base64'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'

const useCoursesColumns = () => {
  const { t } = useTranslation()
  const [selectedRowId, setSelectedRowId] = useState(null)
  const RowOptions = ({ row }) => {
    // ** Hooks
    const dispatch = useDispatch()

    // ** State
    const [anchorEl, setAnchorEl] = useState(null)
    const rowOptionsOpen = Boolean(anchorEl)

    const handleRowOptionsClick = event => {
      setAnchorEl(event.currentTarget)
    }

    const handleRowOptionsClose = () => {
      setAnchorEl(null)
    }

    const handleFullReport = async () => {
      handleRowOptionsClose()
      const response = await dispatch(fetchCourseAttendanceReport(`courseId=${row.id}`))
      if (response?.payload?.status == 400 || response?.payload === undefined)
        toast.error(response?.payload?.data || `${t('Something went wrong try again')} !`)
      else downloadBase64File(response.payload, `${row.name}-Full report.pdf`)
    }

    const handleMonthReport = () => {
      setSelectedRowId(row.id)
      setShowMonthDialog(true)
      handleRowOptionsClose()
    }

    return (
      <>
        <IconButton size='small' onClick={handleRowOptionsClick}>
          <Icon icon='carbon:report' />
        </IconButton>
        <Menu
          keepMounted
          anchorEl={anchorEl}
          open={rowOptionsOpen}
          onClose={handleRowOptionsClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          PaperProps={{ style: { minWidth: '8rem' } }}
        >
          <MenuItem onClick={handleFullReport} sx={{ '& svg': { mr: 2 } }}>
            {/* <Icon icon='tabler:edit' fontSize={20} /> */}
            {t('Full Report')}
          </MenuItem>
          <MenuItem onClick={handleMonthReport} sx={{ '& svg': { mr: 2 } }}>
            {/* <Icon icon='tabler:trash' fontSize={20} /> */}
            {t('Monthly Report')}
          </MenuItem>
        </Menu>
      </>
    )
  }

  const dispatch = useDispatch()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [DeleteName, setDeleteName] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [drawerData, setDrawerData] = useState(null)
  const [open, setOpen] = useState(false)
  const [showMonthDialog, setShowMonthDialog] = useState(false)

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
        field: 'startDate',
        headerName: <Translations text={'Start Date'} />,
        renderCell: params => {
          return <Typography>{moment(params.row.startDate).format('DD.MM.YYYY')}</Typography>
        }
      },
      {
        width: 200,
        field: 'endDate',
        headerName: <Translations text={'End Date'} />,
        renderCell: params => {
          return <Typography>{moment(params.row.endDate).format('DD.MM.YYYY')}</Typography>
        }
      },
      {
        width: 200,
        field: 'teacher',
        headerName: <Translations text={'Teachers'} />,
        renderCell: params => {
          return <Typography>{params.row.teacher?.map(val => val.firstName)}</Typography>
        }
      },
      {
        width: 200,
        field: 'lessons',
        headerName: <Translations text={'lessons'} />,
        renderCell: params => {
          params.row.lessons
        }
      },
      {
        width: 200,
        field: 'price',
        headerName: <Translations text={'Price'} />,
        renderCell: params => {
          params.row.price
        }
      },
      {
        width: 200,
        field: 'room',
        headerName: <Translations text={'Room'} />,
        renderCell: params => {
          return params.row.room.name
        }
      },
      {
        width: 200,
        field: 'action',
        headerName: <Translations text={'Action'} />,
        renderCell: params => {
          return (
            <Stack direction={'row'} alignItems={'center'}>
              {ability.can('update', 'Course') && (
                <IconButton onClick={() => handleOpenDrawer(params.row)}>
                  <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'>
                    <path
                      fill='currentColor'
                      d='M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z'
                    ></path>
                  </svg>
                </IconButton>
              )}
              {ability.can('delete', 'Course') && (
                <IconButton onClick={() => handleDeleteClick(params.row)}>
                  <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'>
                    <path
                      fill='currentColor'
                      d='M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zM8 9h8v10H8zm7.5-5l-1-1h-5l-1 1H5v2h14V4z'
                    ></path>
                  </svg>
                </IconButton>
              )}
              <RowOptions row={params.row} />
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
    DeleteName,
    showMonthDialog,
    setShowMonthDialog,
    selectedRowId
  }
}

export default useCoursesColumns
