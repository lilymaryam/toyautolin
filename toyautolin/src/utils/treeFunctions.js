/**
 * Analyzes a tree structure and returns various metrics
 * @param {Object} treeData - The tree data structure to analyze
 * @returns {Object} Analysis results
 */

//this is currently all of the javascript needed for the autoin alg. all of the react is poorly functioning and will need help later

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

/* 
const reverseBFS = (treeData) => {
    //dk if this will do anything yet
    //should put an error funciton here later 
    for ( let n in treeData.records) {
        console.log((`Index ${n}: ${(treeData.records[n].parent_id)}`))
    }
    const {nodeMap, root} = makeNodeMap(treeData)
    //console.log(Object.keys(nodeMap).length)
    for (let n in nodeMap) {
        //console.log( n, nodeMap[n].node_id, nodeMap[n].is_leaf)
        if (nodeMap[n].is_tip){
            console.log('leaf node', n, nodeMap[n].name)
        }
        for (let c in nodeMap[n].children) {
            console.log('n', n, 'c', c, nodeMap[n].children[c].node_id)
        }
    }       
}
*/


//this is made with AI, i would like to confirm that it works 
//this also doesnt really need nodeMap, it just needs the root, fix later?
const reverseBFS = (nodeMap, root) => {
    // First, build the node map and get the root
    //const {nodeMap, root} = makeNodeMap(treeData);
    console.log("Starting reverse BFS with root:", root ? root.node_id : "None")
    
    // this might need to have better error handling later
    if (!root) {
        console.error("No root node found");
        return [];
    }

    // Step 1: Perform a regular BFS to identify levels
    const levels = [];
    const queue = [root];
    
    // Standard BFS to organize nodes by level
    while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevel = [];
        
        for (let i = 0; i < levelSize; i++) {
            const currentNode = queue.shift();
            currentLevel.push(currentNode);
            
            // Add children to the queue for next level
            if (currentNode.children && currentNode.children.length > 0) {
                currentNode.children.forEach(child => queue.push(child));
            }
        }
        
        levels.push(currentLevel);
    }

    /*
    for (let l in levels) {
        console.log(`Level ${l}:`, levels[l].map(node => node.node_id).join(", "));
    }
    */

    // Step 2: Reverse the order of levels
    levels.reverse();
    for (let l in levels) {
        console.log(`Level ${l}:`, levels[l].map(node => node.node_id).join(", "));
    }

    // Step 3: Process nodes in the reversed order
    const result = [];
    levels.forEach(level => {
        level.forEach(node => {
            
            // Process the node here
            //console.log(`Processing node: ${node.name} (ID: ${node.node_id})`);
            result.push(node);
        });
    });
    /*
    for (let n in result) {
        console.log('result', result[n].name, result[n].node_id)
    }
    */
    return result;
};


//old maybe delete 
/*
const reverseBFS = (nodeMap, root) => {
    if (!root) {
        console.error("No root node found");
        return [];
    }

    const queue = [root];
    const result = [];

    while (queue.length > 0) {
        const currentNode = queue.shift();
        result.push(currentNode);

        // Add children to the queue
        if (currentNode.children && currentNode.children.length > 0) {
            queue.push(...currentNode.children);
        }
    }

    // Reverse the result to process from leaves to root
    return result.reverse();
};
*/

// Function to search for the most recent annotations (Lins) in the tree
// i will need to build this out later
const searchForLins = (root) => {
    //implement the double nested loop here with helper functions above
    const mostRecentAnnotations = {'L': root.node_id}
    return mostRecentAnnotations
}

const getDistsToRoot = (nodeMap, lineageRoot) => {
    console.log("Getting distances to root for lineage:", lineageRoot, nodeMap[lineageRoot]);
    const distances = {[lineageRoot]: 0};
    const recursiveHelper = (node) => {
        console.log('node', node, node.node_id, distances)
        const currentDist = distances[node.node_id]
        console.log('current dist', node, node.node_id, currentDist)
    }
    recursiveHelper(nodeMap[lineageRoot]);
}

//this is your main analysis function it gets exported so it should call everything 
export const analyzeTree = async (treeData) => {
    console.log("is this working", treeData)
    // do i need a node map? perhaps not
    const {nodeMap, root} =  makeNodeMap(treeData)
    //console.log("Starting reverse BFS with root:", root ? root.node_id : "None")

    //should this take root? maybe not the best option, just temporary
    const mostRecentAnnotations = searchForLins(root)
    console.log("Most recent annotations:", mostRecentAnnotations)
    //const result = reverseBFS(nodeMap,root);
    let loop = true
    while (loop) {
        for (let a in mostRecentAnnotations) {
            console.log('a', a, 'mostRecentAnnotations[a]', mostRecentAnnotations[a])
            const rbfs = reverseBFS(nodeMap, nodeMap[mostRecentAnnotations[a]])
            // will likely need to take into account sample weights eventually

            //what is leaf count doing? 
            let leafCount = 0
            for (let n in rbfs) {
                if (rbfs[n].is_tip) {
                    leafCount += 1
                    console.log('rbfs', rbfs[n].name, rbfs[n].node_id, leafCount)
                }
            }
            //for each outer annotation, get distance of samples to root (root of current annotation i beleive)
            const distsToRoot = getDistsToRoot(nodeMap, mostRecentAnnotations[a])
        }

        
        //need to prevent infinite loop
        //will use this for recursive calls later
        loop = false

    }
    console.log("result", result)

    //will likely need to improve return object later
    return {
        analyzed: true,
        timestamp: new Date().toISOString(),
        ...result
    }
}

