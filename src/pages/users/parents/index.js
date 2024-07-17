import { useState, useEffect } from 'react'
// import withRoleRestriction from 'src/@core/utils/withAuth'
import { useRouter } from 'next/router'
// import Chip from '@mui/material/Chip'
// import Pagination from '@mui/material/Pagination'
import CircularProgress from '@mui/material/CircularProgress'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'
import Translations from 'src/layouts/components/Translations'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { fetchParents } from 'src/store/apps/users'

// ** Custom Table Components Imports
import TableHeader from 'src/views/apps/users/parents/list/TableHeader'

const customScrollbarStyles = {
  '& ::-webkit-scrollbar': {
    height: 8
  },
  '& ::-webkit-scrollbar-thumb': {
    backgroundColor: '#888',
    borderRadius: 10,
    '&:hover': {
      backgroundColor: '#555'
    }
  }
}

const columns = [
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
    headerName: <Translations text={'BirthDay'} />,
    field: 'birthday'
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
    headerName: <Translations text={'Street'} />,
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

const ParentsList = () => {
  // ** State
  //   const [value, setValue] = useState('')
  const [addUserOpen, setAddUserOpen] = useState(false)
  //   const [currentPage, setCurrentPage] = useState(1)
  //   const [searchTerm, setSearchTerm] = useState('')
  //   const pageSize = 10 // Page size

  // ** Hooks
  const dispatch = useDispatch()
  const router = useRouter()
  const store = useSelector(state => state.users)

  useEffect(() => {
    dispatch(fetchParents())
  }, [dispatch])

  //   const fetchDataWithPagination = (page, searchValue = '') => {
  //     const offset = (page - 1) * pageSize // Calculate offset based on page number

  //     dispatch(
  //       fetchExpenses({
  //         userId: auth.user.id,
  //         token: auth.token,
  //         router: router,
  //         offset: offset,
  //         page: page,
  //         search: searchValue
  //       })
  //     )

  //     dispatch(fetchExpensesCategories({ userId: auth.user.id, token: auth.token, router: router }))
  //   }

  //   useEffect(() => {
  //     const timer = setTimeout(() => {
  //       fetchDataWithPagination(currentPage, searchTerm) // Fetch data on component mount or page change
  //     }, 700) // 700ms delay

  //     return () => clearTimeout(timer) // Clean up the timer on unmount or before the next effect runs
  //   }, [dispatch, currentPage, searchTerm])

  //   const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  //   const handlePageChange = (event, value) => {
  //     setCurrentPage(value) // Update current page when pagination control is clicked
  //   }

  //   const handleFilter = value => {
  //     setSearchTerm(value) // Update the search term state
  //   }

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          {/* <Divider sx={{ m: '0 !important' }} /> */}
          <TableHeader />
          <Box sx={{ height: 500 }}>
            {store.loading ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '90%',
                  zIndex: 10
                }}
              >
                <CircularProgress size={100} />
              </Box>
            ) : (
              <DataGrid
                //   autoHeight
                rowHeight={62}
                rows={store?.data || []}
                columns={columns}
                //   pageSize={5} // Set the page size to 5
                //   pageSizeOptions={[5, 10, 25]} // Add 5 as an option in the page size dropdown
                //   rowsPerPageOptions={[5]}
                hideFooter={true}
                disableRowSelectionOnClick
                pagination={true}
                sx={{
                  overflowY: 'scroll',
                  overflowX: 'scroll',
                  ...customScrollbarStyles,
                  fontSize: '1rem'
                }}
              />
            )}
          </Box>
          <Divider sx={{ m: '0 !important' }} />
          {/* <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Pagination
              count={store?.data?.total_number_page || 1} // Total pages
              page={currentPage}
              onChange={handlePageChange}
              color='primary'
            />
          </Box> */}
        </Card>
      </Grid>
    </Grid>
  )
}

export default ParentsList
// export default withRoleRestriction(ParentsList)
