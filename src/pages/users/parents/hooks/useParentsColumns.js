import { useMemo, useContext } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Translations from 'src/layouts/components/Translations'
import { convertDate } from 'src/@core/utils/convert-date'
import Chip from '@mui/material/Chip'
import { Stack } from '@mui/system'
import { IconButton } from '@mui/material'
import { useTranslation } from 'react-i18next'

const useParentsColumns = ({ handleEditClick }) => {
  const { t } = useTranslation()
  const ability = useContext(AbilityContext)

  const columns = useMemo(() => {
    const baseColumns = []

    // Only add actions column if user has update permission
    if (ability.can('update', 'User')) {
      baseColumns.push({
        width: 100,
        field: 'action',
        headerName: <Translations text={'Actions'} />,
        renderCell: params => {
          return (
            <Stack direction={'row'} alignItems={'center'}>
              <IconButton onClick={e => handleEditClick(e, params.row)}>
                <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'>
                  <path
                    fill='currentColor'
                    d='M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z'
                  ></path>
                </svg>
              </IconButton>
            </Stack>
          )
        }
      })
    }

    return [
      ...baseColumns,
      {
        width: 200,
        headerName: <Translations text={'User Name'} />,
        field: 'userName'
      },
      {
        width: 200,
        headerName: <Translations text={'Email'} />,
        field: 'email'
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
        width: 200,
        headerName: <Translations text={'Parent Status'} />,
        field: 'activeUser',
        renderCell: ({ row }) => (
          <>
            {row.activeUser ? (
              <Chip label={t('Active')} color={'success'} sx={{ textTransform: 'capitalize' }} />
            ) : (
              <Chip label={t('Inactive')} color={'secondary'} sx={{ textTransform: 'capitalize' }} />
            )}
          </>
        )
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
        headerName: <Translations text={'Phone Number'} />,
        field: 'phoneNumber'
      },
      {
        width: 200,
        headerName: <Translations text={'Job'} />,
        field: 'job'
      },
      {
        width: 200,
        field: 'birthday',
        headerName: <Translations text={'BirthDay'} />,
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
        headerName: <Translations text={'Emergency Phone Number'} />,
        field: 'emergencyPhoneNumber'
      },
      {
        width: 200,
        headerName: <Translations text={'Birth Place'} />,
        field: 'birthplace'
      },
      {
        width: 200,
        headerName: <Translations text={'Street Num'} />,
        field: 'streetNr'
      }
    ]
  }, [ability, handleEditClick, t])

  return { columns }
}

export default useParentsColumns
