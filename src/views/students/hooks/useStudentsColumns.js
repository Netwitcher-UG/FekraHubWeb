import { useMemo, useState, useCallback, useContext } from 'react'
import Translations from 'src/layouts/components/Translations'
import Chip from '@mui/material/Chip'
import Icon from 'src/@core/components/icon'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { convertDate } from 'src/@core/utils/convert-date'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
const useStudentsColumns = () => {
  const handleAddReportClick = (e, row) => {
    e.stopPropagation()
    handleOpenDrawer(row)
  }

  const [open, setOpen] = useState(false)
  const [drawerData, setDrawerData] = useState(null)
  const ability = useContext(AbilityContext)

  const handleOpenDrawer = useCallback(data => {
    setDrawerData(data)
    setOpen(true)
  }, [])

  const handleCloseDrawer = useCallback(() => {
    setOpen(false)
    setDrawerData(null)
  }, [])

  const columns = useMemo(
    () => [
      {
        field: 'addReport',
        width: 100,
        headerName: '',
        renderCell: ({ row }) => (
          <>
            {ability.can('create', 'StudentReport') && (
              <IconButton color='success' onClick={e => handleAddReportClick(e, row)} sx={{ width: '80%' }}>
                <Icon icon='tabler:file-plus' fontSize={30} />
              </IconButton>
            )}
          </>
        ),
        sortable: false
      },
      {
        width: 200,
        headerName: <Translations text={'First Name'} />,
        field: 'firstName'
      },
      {
        width: 200,
        headerName: <Translations text={'Last Name'} />,
        field: 'lastName'
      },
      {
        width: 100,
        headerName: <Translations text={'Gender'} />,
        field: 'gender'
      },
      {
        width: 200,
        headerName: <Translations text={'Nationality'} />,
        field: 'nationality'
      },
      {
        width: 200,
        headerName: <Translations text={'Course'} />,
        field: 'course.name',
        renderCell: ({ row }) =>
          row.course?.name ? (
            <Chip label={row.course?.name} color={'primary'} sx={{ textTransform: 'capitalize' }} />
          ) : (
            <Typography variant='body2' color={'error'} sx={{ textTransform: 'capitalize' }}>
              No Course
            </Typography>
          )
      },
      {
        width: 200,
        headerName: <Translations text={'BirthDate'} />,
        renderCell: ({ row }) => <div>{convertDate(row.birthday)}</div>
      },
      {
        width: 200,
        headerName: <Translations text={'City'} />,
        field: 'city'
      },
      {
        width: 200,
        headerName: <Translations text={'Street'} />,
        field: 'street'
      },
      {
        width: 200,
        headerName: <Translations text={'Street Num'} />,
        field: 'streetNr'
      },
      {
        width: 200,
        headerName: <Translations text={'Zip Code'} />,
        field: 'zipCode'
      },
      {
        width: 200,
        headerName: <Translations text={'Note'} />,
        field: 'note'
      }
    ],
    []
  )

  return { columns, open, drawerData, handleCloseDrawer, handleCloseDrawer }
}

export default useStudentsColumns
