//Charles Funnell - 103982619 - All comments are mine
//import * as React from 'react';

/*This produces fake data for the graph, as it wont work otherwise, also from: https://github.com/vasturiano/react-force-graph/blob/master/example/directional-links-arrows/index.html*/
export default function genRandomTree(data, reverse = false) {
  

  
  let counti  = 1
  let dataListNodes = data[0].map(count => {
    let id = counti
    counti += 1
    let name = count.properties.addressId
    let val = count.properties.type
    let c = {id, name, val}
    return c
  })

  let dataListTransactions = data[1].map(count2 => {
    let source = count2[0].properties.from_address
    let target = count2[0].properties.to_address
    let d = {source, target}
    return d
  })



    return {
      nodes: [dataListNodes].map(i => ({ id: i })),
        links: [dataListTransactions]
      .filter(id => id)
      .map(id => ({
        [reverse ? 'target' : 'source']: id,
        [reverse ? 'source' : 'target']: Math.round(Math.random() * (id-1))
      }))
    };
  }