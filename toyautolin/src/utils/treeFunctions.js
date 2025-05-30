/**
 * Analyzes a tree structure and returns various metrics
 * @param {Object} treeData - The tree data structure to analyze
 * @returns {Object} Analysis results
 */

const makeNodeMap = (treeData) => {
    const nodeMap = {}
    treeData.records.forEach(node => {
    nodeMap[node.node_id] = node;
    // Initialize children array for each node
        node.children = [];
        //console.log(node.node_id, node.children)
    });
    let root = null
    treeData.records.forEach (node => {
        if (node.parent_id == node.node_id) {
            root = node
        } else if (nodeMap[node.parent_id]) {
            nodeMap[node.parent_id].children.push(node)
        }

        
    })
    /*
    //check node map
    for (let n in nodeMap) {
        console.log('bet', n, nodeMap[n].name)  
        for (let c in nodeMap[n].children) {
            console.log('n', n, 'c', c, nodeMap[n].children[c].node_id)
        }
    }
    */  
   return {
        nodeMap,
        root
    }
   

}

//     
const reverseBFS = (treeData) => {
    //dk if this will do anything yet
    //should put an error funciton here later 
    for ( let n in treeData.records) {
        console.log((`Index ${n}: ${(treeData.records[n].parent_id)}`))
    }
    const {nodeMap, root} = makeNodeMap(treeData)
    //console.log(Object.keys(nodeMap).length)
    

       
}

//this is your main analysis function it gets exported so it should call everything 
export const analyzeTree = async (treeData) => {
    console.log("is this working", treeData)
    const result =  reverseBFS(treeData)
    return {
        analyzed: true,
        timestamp: new Date().toISOString(),
        ...result
    }
}

