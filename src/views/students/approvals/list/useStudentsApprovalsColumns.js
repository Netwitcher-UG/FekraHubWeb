import { useMemo, useContext } from 'react'
import Translations from 'src/layouts/components/Translations'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { convertDate } from 'src/@core/utils/convert-date'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import PersonOffIcon from '@mui/icons-material/PersonOff'

const useStudentsApprovalsColumns = (handleApproveClick, handleRejectClick) => {
  const ability = useContext(AbilityContext)

  const columns = useMemo(
    () => [
      {
        width: 120,
        headerName: <Translations text={'Actions'} />,
        field: 'actions',
        sortable: false,
        renderCell: ({ row }) => (
          <>
            {row.canAccept && (
              <Tooltip title={<Translations text={'Approve Student'} />}>
                <IconButton
                  color='success'
                  onClick={e => {
                    e.stopPropagation()
                    handleApproveClick(row)
                  }}
                  size='medium'
                  sx={{ mr: 1 }}
                >
                  <HowToRegIcon fontSize='medium' />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title={<Translations text={'Reject Student'} />}>
              <IconButton
                color='error'
                onClick={e => {
                  e.stopPropagation()
                  handleRejectClick(row)
                }}
                size='medium'
              >
                <PersonOffIcon fontSize='medium' />
              </IconButton>
            </Tooltip>
          </>
        )
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
        field: 'birthday',
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
    [ability, handleApproveClick, handleRejectClick]
  )

  return { columns }
}

export default useStudentsApprovalsColumns
