import { Card } from '@mui/material'
import { Box, Stack } from '@mui/system'
import React, { useEffect, useContext } from 'react'
import useCoursesColumns from '../hook/useCoursesColumns'
import CustomSearch from 'src/@core/components/custom-search'
import AddCourses from '../add'
import CustomDialogDelete from 'src/@core/components/custom-delete'
import DrawerEdit from '../edit'
import { useDispatch, useSelector } from 'react-redux'
import { fetchLocation } from 'src/store/apps/location'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import CustomDataGrid from 'src/@core/components/custom-grid'
import MonthlyReportForm from '../monthly-report/monthly-report-form'
import { useTranslation } from 'react-i18next'
export default function CoursesDataGrid({ rows, dataRooms, dataTeacher, SetSearch, search, status }) {
  const {
    columns,
    isDialogOpen,
    handleCloseDialog,
    handleDelete,
    drawerData,
    open,
    handleCloseDrawer,
    DeleteName,
    showMonthDialog,
    setShowMonthDialog,
    selectedRowId
  } = useCoursesColumns()

  const { t } = useTranslation()
  const { data: locationData, error } = useSelector(state => state.location)
  const ability = useContext(AbilityContext)

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchLocation(''))
  }, [dispatch])

  return (
    <>
      <Card>
        <Stack
          padding={4}
          direction={{ xs: 'column', sm: 'row' }}
          spacing={5}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <Box>
            <CustomSearch SetSearch={SetSearch} value={search} />
          </Box>
          {ability.can('create', 'Course') && <AddCourses dataRooms={dataRooms} dataTeacher={dataTeacher} />}
        </Stack>

        <Box sx={{ height: 'calc(100vh - 255px)' }}>
          <CustomDataGrid
            columns={columns}
            rows={rows}
            loading={status === 'loading'}
            sx={{
              height: '100%'
            }}
          />
        </Box>
      </Card>
      <CustomDialogDelete
        open={isDialogOpen}
        handleClose={handleCloseDialog}
        decsription={`${t('Are you sure you want to delete the class')} ${DeleteName} ? `}
        onDelete={handleDelete}
      />
      {open && (
        <DrawerEdit
          open={open}
          handleCloseDrawer={handleCloseDrawer}
          dataDef={drawerData}
          locationData={locationData}
        />
      )}

      {showMonthDialog && (
        <MonthlyReportForm open={showMonthDialog} setOpen={setShowMonthDialog} courseId={selectedRowId} />
      )}
    </>
  )
}
