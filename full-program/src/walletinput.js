//Charles Funnell - 103982619 - All comments are mine
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import data from './backendfunct';
//import formatdata from './randomdata.js';
//import EventEmitter from 'eventemitter3';
import { useState } from "react";
//import { func } from 'prop-types';

export default function BasicTextFields() {
  const [wallet, setWallet] = useState("");
  //const eventBus = new EventEmitter();

  async function isDataValid(wallet) {
    let dataResult = await data(wallet)

    if (dataResult === "NR") {
      alert(`Query unsuccessful: No data relating to wallet "${wallet}" was found`)
    }
    else if (dataResult === "FI") {
      alert(`Query discarded: "${wallet}" contains disallowed characters such as special characters like "&" and uppercase letters like "A"`)
    }
    else {
      alert(`Query successful: Transaction data relating to wallet "${wallet}" was found`)
    }
    
    
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`The name you entered was: ${wallet}`)
    isDataValid(wallet)

    
    //eventBus.emit("DatabaseData", ebdata)
  
    
    /*This is a basic webhook, taken from https://www.w3schools.com/react/react_forms.asp, is used to collect inputted wallet address
     AND This section is an MUI component, taken from https://mui.com/material-ui/react-text-field/ */
  }
  return (
    <Box
        
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit} /*This is going to be used for data retreval later but not yet*/
    >
      
      
      <TextField id="outlined-basic" label="Wallet address" variant="outlined" value={wallet} onChange={(e) => setWallet(e.target.value)} />
      
    </Box>
  );
}