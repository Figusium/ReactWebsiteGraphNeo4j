//Charles Funnell - 103982619 - All comments are mine
import * as React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
//import { CurrencyBitcoin } from '@mui/icons-material';

export default function NestedList() {
  //We have 3 handlers so each section is openned independently from each other
  const [open1, setOpen1] = React.useState(true);
  const [open2, setOpen2] = React.useState(true);
  const [open3, setOpen3] = React.useState(true);

  const handleClick1 = () => {
    setOpen1(!open1);
  };
  const handleClick2 = () => {
    setOpen2(!open2);
  };
  const handleClick3 = () => {
    setOpen3(!open3);
  };

  return (
    <List id="DataList"
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Current Currencies Balance
        </ListSubheader>
      }
    >
      
      <ListItemButton onClick={handleClick1}>
        <ListItemIcon>
          <CurrencyBitcoinIcon />
      
        </ListItemIcon>
        <ListItemText primary="Bitcoin" /*I tried to use custome icons but they just didnt want to work properly*/ />
        {open1 ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open1} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemText primary="Current Bitcon Balance: 4BTC" /*Basic texts in place of the real values as its currently static*/ />
          </ListItemButton>
        </List>
      </Collapse>

      <ListItemButton onClick={handleClick2}>
        <ListItemIcon>
          <DensityMediumIcon />
        </ListItemIcon>
        <ListItemText primary="Etherium" />
        {open2 ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open2} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemText primary="Current Etherium Balance: 4ETH" />
          </ListItemButton>
        </List>
      </Collapse>

      <ListItemButton onClick={handleClick3}>
        <ListItemIcon>
          <MiscellaneousServicesIcon />
        </ListItemIcon>
        <ListItemText primary="Misc Currencies" />
        {open3 ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open3} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemText primary="Current Misc Balance(s): 4DGE, 4XLM, 4PPC" />
          </ListItemButton>
        </List>
      </Collapse>
    </List>
  );
}