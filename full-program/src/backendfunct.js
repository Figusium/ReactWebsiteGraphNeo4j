//import { node } from 'prop-types';

const neo4j = require('neo4j-driver');

// Neo4j configuration
const driver = neo4j.driver('neo4j+s://9cf00a7b.databases.neo4j.io', neo4j.auth.basic('neo4j', 'fbM8rK_SW0gFmJWBKAV62cyNTO-DEntWDycm31ONl2o'));

//READ ME!! -> Very important error list!
/*
ERRORS
101 - An error occured in fetchDataWithCypher(), meaning that runCypherQuery returned accetable but mis-formatted results
102 - An error occured in runCypherQuery(), after the first search's data was put into dataSort(), meaning that dataSort() returned acceptable but mis-formatted results.
103 - An error occured in runCypherQuery(), after backupSearchFunction() was called, meaning backupDataSort() returned acceptable but mis-formatted results.
104 - An error occured in runCypherQuery(), after the second search was slip into two variables, the issue is most likley what values newdata[] contains. 
105 - An error occured in runCypherQuery(), which has not been picked up yet, there most likley is something wrong with the connection to neo4j.
106 - An error occured in backupDaraSearch(), during both parts of the search search, the issue is most likley a routing error/connection issue with neo4j.
107 - An error occured in inputValidation(), the input was not a string.

NOTICES
201 - The first part of the second search has failed, this is normal and means the second part of the second search has successed.
202 - The second part of the second search has failed, this is normal and means the first part of the second search has successed.
203 - The first search has failed, we are now beggining the second search.
204 - The returned data was empty, meaning that there was no data related to the address.
*/





/*
API SPECFICATIONS (BEF == backendfunc.js)
1. BEF --REQUEST1-> NEO4J
2. BEF <-DATA1-- NEO4J
IF D1 == NULL THEN
  3. BEF --REQUEST2-> NEO4J
  4. BEF --REQUEST3-> NEO4J
  5. BEF <-DATA2-- NEO4J
  6. BEF <-DATA3-- NEO4J
  7. RETURN DATA
ELSE
8. RETURN DATA
*/

// Returns the data to the function that called it
export default async function mainBackEndFunction(wallet)
{
  let walletValidated = inputValidation(wallet)
  if (walletValidated === null) {
    return "FI"
  }
  else {
    let returndata = await databaseHandler(walletValidated) 
    //we log the data here to make sure its all working!
    if (outputValidation(returndata) === true) {
      console.log(returndata)
      return returndata
    } 
    else {
      return "NR"
    }
    
  }
  
};

function inputValidation(input) {
  //This is basic input validation, it makes sure that the input is:
  //1. A string
  //2. Only contains lowercase letters and numbers
  //It then adds quote marks to the string, as cypher needs all strings to have them
  const letterPattern = /^[a-z0-9]+$/;
  if (typeof input === 'string') {
    if (letterPattern.test(input) === true) {
      return `"${input}"`;
    }
    else {
      console.log("ERROR: 107")
      return null;
    }
  } else {
    console.log("ERROR: 107")
    return null;
  }
}

//output validation is used so we dont send undefined data to any module (it will crash!)
function outputValidation(testData) {
  try {
    //is the nodes array undefined?
    if (testData[0] === undefined) {
      return false
    } //is the relationships array undefined?
    else if (testData[1] === undefined) {
      return false
    }
    
    //Is the node array empty?
    let var1 = testData[0]
    let var2 = var1[0]
    //The below line is to stop the warning showing when I compile the program
    //eslint-disable-next-line
    let var3 = var2.properties.addressId
    


    return true
  }
  catch (e) {
    console.log("NOTICE: 204")
    return false;
  }
}


// This is just a middle man function which runs the query then returns the data to the main function.
async function databaseHandler(walletValidated) {
  try {
    // Execute the provided Cypher query with the input string
    const data = await databaseSearch(walletValidated);

    // Format and process the data as needed
    return data;
  } catch (error) {
    console.log("ERROR 101")
    throw error;
  }
}

// Cypher query function 
async function databaseSearch(query) {
  const session = driver.session();

  try {
    let res = await session.executeRead(tx =>
      tx.run(
        `MATCH (n:Nodes)-[r:Transactions]->(wallet:Nodes)
        MATCH (m:Nodes)-[s:Transactions]->(n)
        WHERE n.addressId = ${query}
        RETURN DISTINCT n, m, wallet, r, s`
        //This query works for nodes that have transactions INTO and OUT OF the searched for node
        //It always needs to be run as if we can get all the nodes + transactions in one query then we do it
      )
    )
    console.log(res)
    //its required to define variables outside a try {} sections (cause it may fail!)
    let data = []
    try {
      //dataSort wants the data and the form of the data, 
      //form 1: Both IN and OUT transactions (n, m, wallet, r, s)
      //form 2: ONLY OUT transactions (n, wallet, r)
      //form 3: ONLY IN transactions (n, m, s)
      //NOTES: n, m and wallet are all NODES, r and s are RELATIONSHIPS!

      //The reason for this is that it will crash if we use a query that returns n, m, s and it hits the part...
      //...that maps out r (it *will* crash horribly)
      data = dataSort(res, 1)
    }
    catch(e) {
      console.log("ERROR 102")
      console.log(e)

    }
    

    //Data Checking -> i.e. Did the first search actually return any data?
    let data1
    let data2
    if (data[0].length === 0) {
      //data is an array with two arrays within it -> data = [ nodes[x], relationships[y] ]
      //So data[0].length is the amount of nodes that the first query returned, so if length == 0 then it has returned 0 nodes...
      //...meaning that the searched failed!
      let newdata
      //The console.log(x) are for debugging, a guide to errors and notices is at the top of the page
      try {
        newdata = await backupSearchFunction(query)
        //This calls the backupSearchFunction(x), it returns two arrays inside an array inside an array...
        //... newdata = [ search1[ nodes[x], relationships[y] ], search2[ nodes[w], relationships[z] ] ]
        //One of the search arrays is undefined and the other has the correct data in it, which is useful for sorting the data
      }
      catch (e)
      {
        console.log("ERROR: 103")
        console.log(e)
      }
      //This sections deals with the newdata
      try {
        let searchOne = newdata[0]
        let searchTwo = newdata[1]
        //This sections is ingenius, the reason they each have a sperate try {} sections because...
        //...you can use an IF statement but it will crash trying to compare 1 to undefined...
        //...so you have them both try {} and the correct one will work but the incorrect one will fail!
        try {
          //This sorts the returned data according to the requested form
          data1 = dataSort(searchOne, 2)
          data = data1
        } catch (e)
        {
          console.log("NOTICE: 201")
        }
        try {
          data2 = dataSort(searchTwo, 3)
          data = data2
        } catch {
          console.log("NOTICE: 202")
        }
        
        
        
        
        
      }
      catch (e)
      {
        console.log("ERROR: 104")
        console.log(e)
      }


      
      return data
      
    }
    else 
    {
      //This means if there is more than 0 nodes then we return the data
      console.log(data)
      return data;
    }

  } catch (error) {
    console.log("ERROR: 105")
    throw error;
  } finally {
    session.close();
  }
}



async function backupSearchFunction(input) {
  //basic variable creation
  let res
  let res2
  //creates a new session as the last one was ended.
  const session = driver.session();
  console.log("NOTICE: 203")

  //This attempts to run both the backup queries, if successful it returns the results of both in an array.
  try {
      res = await session.executeRead(tx =>
      tx.run(
        `MATCH (n:Nodes)-[r:Transactions]->(wallet:Nodes)
        WHERE n.addressId = ${input}
        RETURN DISTINCT n, r, wallet`
        
      )
      //searches for nodes that are sent coins from the input wallet
    )
      
    
    res2 = await session.executeRead(tx =>
      tx.run(
        `MATCH (m:Nodes)-[s:Transactions]->(n:Nodes)
        WHERE n.addressId = ${input}
        RETURN DISTINCT n, m, s`
      )
      //searches for nodes that send coins to the input wallet
    )

    let secondChance = [res, res2]
   return secondChance
   

  } 
  catch (err) {
    console.log("ERROR: 106")
    //This should never run, as its hard for a query to cause an error on the second/third run.
    //Most errors are fail to route errors which run on the first search!
  }
}

function dataSort(res, form) {
  //This is the main data sorting function
  let nodesM
  let nodesW
  let transactionsR
  let transactionsS
  let data = []

    
    const nodesN = res.records.map(row => {
      return row.get('n')
    })
    
    //From HERE ->
    if (form === 1 || form === 3) {
       nodesM = res.records.map(row => {
        return row.get('m')
      })
    }
    
    if (form === 1 || form === 2) {
       nodesW = res.records.map(row => {
        return row.get('wallet')
      })
    }
    
    if (form === 1 || form === 2) {
       transactionsR = res.records.map(row => {
        return row.get('r')
      })
    }
    
    
    if (form === 1 || form === 3) {
       transactionsS = res.records.map(row => {
        return row.get('s')
      })
    }
    //-> TO HERE, these are getting all the nodes/relationships and putting them into useable arrays
    
    let transactions
    let nodes
    //Condenses all the data into two arrays, one for nodes and one from relationships
    //the form is the same as beofre, just determining what needs to be added or not
    if (form === 1) {
      nodes = nodesN.concat(nodesM, nodesW)
      transactions = transactionsR.concat(transactionsS)
    }
    else if (form === 2) {
      nodes = nodesN.concat(nodesW)
      transactions = transactionsR
    } else if (form === 3) {
      nodes = nodesN.concat(nodesM)
      transactions = transactionsS
    }

    //This is more interesting, it takes the data, turns all the repeated data entries in the string "ignore"
    //Basically this just removes repeated entries which occur as the query takes the nodes from N, M and Wallet so that...
    //...we end up with 3 times the nodes
      
    let nodeNames = []
    let purgedNodes = []

    let sortedNodes = nodes.map(nodes => {
      if (nodeNames.includes(nodes.properties.addressId) === false) {
        //Push the name of the node to an array, so we can check for duplicates
        nodeNames.push(nodes.properties.addressId)
        return nodes
      }
      else {
        return "ignore"
      }
    })

    //After we replace all the duplicate nodes with "ignore", we then removed all the "ignores"!
    purgedNodes = sortedNodes.filter(item => item !== "ignore")
    
    let transactionNames = []
    let purgedTransactions = []
    let sortedTransactions = transactions.map(transactions => {
      if (transactionNames.includes(transactions.elementId.split(':')[2]) === false) {
        //Transacrions.elementId = 621727:27689273:3627863287, 
        //The first two sections are created by NEO4J, while the last section is the transaction Id from the dataset
        transactionNames.push(transactions.elementId.split(':')[2])
        return transactions
      }
      else {
        return "ignore"
      }
    })
    
    purgedTransactions = sortedTransactions.filter(item => item !== "ignore")
   

   data = [purgedNodes, purgedTransactions]
    //AND WE ARE DONE!
  return data
}