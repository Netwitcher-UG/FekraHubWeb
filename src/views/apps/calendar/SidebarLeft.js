import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import DatePicker from 'react-datepicker';
import Icon from 'src/@core/components/icon';
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchCourses } from 'src/store/apps/courses';
import { TextField } from '@mui/material';
import CustomTextField from 'src/@core/components/mui/text-field';

const SidebarLeft = (props) => {
  const {
    store,
    mdAbove,
    dispatch,
    calendarApi,
    calendarsColor,
    leftSidebarOpen,
    leftSidebarWidth,
    handleSelectEvent,
    handleAllCalendars,
    handleCalendarsUpdate,
    handleLeftSidebarToggle,
    handleAddEventSidebarToggle,
  } = props;

  const { data } = useSelector((state) => state.courses);
  const [search, SetSearch] = useState('');
  const [selectedAllCourses, setSelectedAllCourses] = useState([]);
  console.log(store.selectedCalendars);


  useEffect(() => {
    dispatch(fetchCourses(search));
    if(data.length> 0 && store.selectedCalendars.length == 0){
      setSelectedAllCourses(data.map((course) => course.id))

    }
    else
    {
      setSelectedAllCourses([])

    }
  }, [dispatch, search,store.selectedCalendars.length]);

  const renderFilters = data.length
    ? data.map((course, index) => (
        <FormControlLabel
          key={index}
          label={course.name}
          sx={{ '& .MuiFormControlLabel-label': { color: 'text.secondary' } }}
          control={
            <Checkbox
              checked={store.selectedCalendars.includes(course.id)}
              onChange={() => dispatch(handleCalendarsUpdate(course.id))}
            />
          }
        />
      ))
    : null;

  const handleViewAllChange = (checked) => {
    if (checked) {
      const allCourseIds = data.map((course) => course.id);
      setSelectedAllCourses(allCourseIds);
      dispatch(handleAllCalendars(allCourseIds)); // Select all courses
    } else {
      setSelectedAllCourses([]);
      dispatch(handleAllCalendars([])); // Deselect all courses
    }
  };

  const handleSidebarToggleSidebar = () => {
    handleAddEventSidebarToggle();
    dispatch(handleSelectEvent(null));
  };

  return (
    <Drawer
      open={true}
      onClose={handleLeftSidebarToggle}
      variant={mdAbove ? 'permanent' : 'temporary'}
      ModalProps={{
        disablePortal: true,
        disableAutoFocus: true,
        disableScrollLock: true,
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        zIndex: 3,
        display: 'block',
        position: mdAbove ? 'static' : 'absolute',
        '& .MuiDrawer-paper': {
          borderRadius: 1,
          boxShadow: 'none',
          width: leftSidebarWidth,
          borderTopRightRadius: 0,
          alignItems: 'flex-start',
          borderBottomRightRadius: 0,
          zIndex: mdAbove ? 2 : 'drawer',
          position: mdAbove ? 'static' : 'absolute',
        },
        '& .MuiBackdrop-root': {
          borderRadius: 1,
          position: 'absolute',
        },
      }}
    >
      <Box sx={{ p: 6, width: '100%' }}>
        <Button
          fullWidth
          variant="contained"
          sx={{ '& svg': { mr: 2 } }}
          onClick={handleSidebarToggleSidebar}
        >
          <Icon icon="tabler:plus" fontSize="1.125rem" />
          Add Event
        </Button>
      </Box>

      <Divider sx={{ width: '100%', m: '0 !important' }} />
      <DatePickerWrapper
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          '& .react-datepicker': { boxShadow: 'none !important', border: 'none !important' },
        }}
      >
        <DatePicker inline onChange={(date) => calendarApi.gotoDate(date)} />
      </DatePickerWrapper>
      <Divider sx={{ width: '100%', m: '0 !important' }} />
      <Box sx={{ p: 6, width: '100%',height:'400px', display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
        <Typography variant="body2" sx={{ mb: 2, color: 'text.disabled', textTransform: 'uppercase' }}>
          Filters
        </Typography>
        <CustomTextField
          fullWidth
          variant="outlined"
          placeholder="Search Courses"
          value={search}
          onChange={(e) => SetSearch(e.target.value)}
          sx={{ mb: 3 }}
        />
        <FormControlLabel
          label="View All"
          sx={{ '& .MuiFormControlLabel-label': { color: 'text.secondary' } }}
          control={
            <Checkbox
              checked={selectedAllCourses.length == data.length}
              onChange={(e) => handleViewAllChange(e.target.checked)}
            />
          }
        />
        {renderFilters}
      </Box>
    </Drawer>
  );
};

export default SidebarLeft;
