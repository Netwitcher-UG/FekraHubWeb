import { Box, Paper, Tab, Tabs, Typography } from '@mui/material';
import BlankLayout from 'src/@core/layouts/BlankLayout';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import BasicsInfo from 'src/views/config/BasicsInfo';
import EmailSender from 'src/views/config/EmailSender';
import ContractPolicy from 'src/views/config/Contract&policy';
import SchoolReports from 'src/views/config/Reports';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Config() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Paper elevation={3}>
      <Box sx={{ width: '100%', height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography sx={{ fontSize: '26px', fontWeight: 500 }}>The config of School</Typography>
      </Box>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'start', flexDirection: 'row' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Basics" {...a11yProps(0)} />
            <Tab label="Email Sender" {...a11yProps(1)} />
            <Tab label="Contract and policy" {...a11yProps(2)} />
            <Tab label="Reports" {...a11yProps(3)} />
          </Tabs>
        </Box>
      </Box>
      <Box>
        <CustomTabPanel value={value} index={0}>
          <BasicsInfo />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <EmailSender />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <ContractPolicy />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <SchoolReports />
        </CustomTabPanel>
      </Box>
    </Paper>
  );
}

Config.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;  // Also update the usage here
