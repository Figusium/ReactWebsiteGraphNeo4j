//Charles Funnell - 103982619 - All comments are mine
import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TransTable from './table.js';
import WalletInput from './walletinput.js';
//import formatdata from './randomdata.js';
import BasicDataList from './basicdata.js';
import ForceGraph3D from 'react-force-graph-3d';
import { Home, AutoGraph, ReceiptLong } from '@mui/icons-material';

/*This whole item is taken from https://mui.com/material-ui/react-tabs/*/
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
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
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

export default function BasicTabs() {

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }} id="menu">
        <Tabs value={value} onChange={handleChange} aria-label="transfertabs" variant="fullWidth">
          <Tab icon = {<Home/>} label="Home" {...a11yProps(0)} id="label1" /*This uses a tab system for organisation of data*/ />
            
          <Tab icon = {<AutoGraph/>} label="Directed Graph" {...a11yProps(1)} id="label2"/>
            
          <Tab  label="Full Transaction Data" icon = {<ReceiptLong/>} {...a11yProps(2)} id="label3"/>
            
        </Tabs>
      </Box>
      
      <CustomTabPanel value={value} index={0}>
        <WalletInput id="tab1" /*This is the components being put in their tabs (sections)*//>
        <BasicDataList id="tab1"/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ForceGraph3D/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <TransTable id="tab3"/>
      </CustomTabPanel>
    </Box>
  );
}