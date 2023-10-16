//Charles Funnell - 103982619 - All comments are mine
import * as React from 'react';
//import EventEmitter from 'eventemitter3';
import { DataGrid } from '@mui/x-data-grid';

//const eventBus = new EventEmitter();
const columns = [
 //This is setting ut the form of the table and what data is displayed
  { field: 'transactionID', headerName: 'ID', width: 130 },
  { field: 'senderWallet', headerName: 'Sender', width: 130 },
  { field: 'currency', headerName: 'Currency', width: 70 }, 
  { field: 'value', headerName: 'Value', type: 'number', width: 100 },
  { field: 'reciverWallet', headerName: 'Reciver', width: 130 },
];

//EVENT BUS -> Removed from the program due to:
//1. It not working
//2-99. See above...
/*

let receivedData
let dynamicRows
eventBus.on("DatabaseData", (data) => {
  console.log(data)
  receivedData = data[1]
  try {
    if (receivedData != undefined) {
      dynamicRows = receivedData.map(x => {
        let idv = x.elementId.split(':')[0]
        let transactionIdv = x.elementId.split(':')[2]
        let senderWalletv = x.properties.from_address
        let currencyv = "Unknown"
        let valuev = x.properties.value
        let reciverWalletv = x.properties.to_address
        return { id: idv, transactionId: transactionIdv, senderWallet: senderWalletv, currency: currencyv, value: valuev, reciverWallet: reciverWalletv }
      } )
    } else {
      console.log("No session data is available")
    }
  }
  catch (e) {
    console.log(e)
  }
});
*/



const rows = [
    //Fake data to fill the transaction table, in the form that will be used in the future
  { id: 1, transactionID: '100abc', senderWallet: '192.168.10.2', currency: 'ETH', value: 1200 , reciverWallet: '192.168.10.15', },
  { id: 2, transactionID: '101abc', senderWallet: '192.168.10.2', currency: 'ETH', value: 1500, reciverWallet: '192.168.10.15', },
  { id: 3, transactionID: '102abc', senderWallet: '192.168.10.2', currency: 'BTC', value: 12, reciverWallet: '192.168.10.15', },
  { id: 4, transactionID: '103abc', senderWallet: '192.168.10.15', currency: 'DGC', value: 444, reciverWallet: '192.168.10.2', },
  { id: 5, transactionID: '104abc', senderWallet: '192.168.10.15', currency: 'MMR', value: 2.678, reciverWallet: '192.168.10.2', },
];

//Q: WHY IS THE TABLE STATIC?
//A: Because loading the table tab doesnt cause an event
//A2: Tried using eventbus, but that just caused more issues

export default function DataTable() {
  return (
    <div style={{ height: 400, width: '100%' }} /*This section is just code*/>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
  );
}