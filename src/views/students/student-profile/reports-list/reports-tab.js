import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import useStudentReportsColumns from '../../hooks/useStudentReportsColumns'
import StudentReportsDataGrid from './dataGrid'
import { useRouter } from 'next/router'

const StudentReportsTab = ({ store, byParent }) => {
  const router = useRouter()
  const columns = useStudentReportsColumns()

  const handleRowClick = params => {
    const currentPath = window.location.pathname
    const newPath = `${currentPath}report/${params.row.id}`
    router.push(newPath)
  }

  return (
    <Grid container spacing={4} sx={{ height: 'calc(100vh - 245px)', overflow: 'hidden' }}>
      <Grid item xs={12} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <StudentReportsDataGrid columns={columns} handleRowClick={handleRowClick} store={store} byParent={byParent} />
        </Card>
      </Grid>
    </Grid>
  )
}

export default StudentReportsTab
