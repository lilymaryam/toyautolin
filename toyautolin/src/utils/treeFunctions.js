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
        for (let c in node.children) {
            console.log('c', typeof(c), node.children[c], ';en', node.children[c].mutations.length)
            //tihs may need to be upgraded later if sample or mutation weights are used 
            const dist = currentDist + node.children[c].mutations.length
            distances[node.children[c].node_id] = dist
            recursiveHelper(node.children[c]);
        }
    }
    recursiveHelper(nodeMap[lineageRoot]);
    return distances;
}

//this currently will only assign lineages from scratch, will need updates to handle pre-annotated lineages
//need to check this , checked briefly , further checks useful
//i need to add skipset to this function
const getSumAndCount = (rbfs, skipSet) => {
    const sumAndCounts = {}
    //can this be a const?
    let leafCount = 0
    for (let n in rbfs) {
        //console.log('sum and count', rbfs[n].name, rbfs[n].node_id, rbfs[n].mutations.length)
        if (rbfs[n].is_tip) {
            leafCount += 1
            //console.log('rbfs', rbfs[n].name, rbfs[n].node_id, leafCount)
            //only count as 1 if unweighted
            //const?
            const count = 1
            //sum of node is branch length unless weighting is added 
            // count is number of descs? 
            sumAndCounts[rbfs[n].node_id] = [rbfs[n].mutations.length, count]
        }
        //for internal nodes
        else {
            let totalCount = 0
            let totalSum = 0
            for (let c in rbfs[n].children) {
                //maybe turn this into a function later?
                console.log('yes',c, rbfs[n].children[c], rbfs[n].children[c].node_id, sumAndCounts[rbfs[n].children[c].node_id])
                totalCount += sumAndCounts[rbfs[n].children[c].node_id][1]
                totalSum += sumAndCounts[rbfs[n].children[c].node_id][0]
            }
            //do i need a contingency for totalCount being 0?
            if (totalCount > 0) {
                /*total path length is computed as the total path lengths to each child plus the length of the current node TIMES the number of samples.
                #this is because total path length is not the same as tree parsimony- some mutations are part of many sample paths
                #for a given sample to its parent, the total path length is just the number of mutations (as computed above)
                #but for an internal node with two leaf children's path length with respect to its parent, 
                #its equal to the sum of the two child's path lengths plus 2 times its mutations, since those mutations are shared among 2 samples
                #this logic applies as we move further up the tree.*/
                sumAndCounts[rbfs[n].node_id] = [totalSum + rbfs[n].mutations.length * totalCount, totalCount]
            }

            //console.log('internal node', rbfs[n].name, rbfs[n].node_id, rbfs[n].mutations.length)

        }

    }
    return sumAndCounts;
}

const evaluateCandidates= (candidate, sumAndCounts, distsToRoot) => {
    //if there is a sum that does not have sumAndCounts this will break
    const nodeSum = sumAndCounts[candidate.node_id][0]
    const nodeCount = sumAndCounts[candidate.node_id][1]
    console.log('nodeSum', nodeSum, 'nodeCount', nodeCount)
    //add evaluation for sum being less than minimum (not right now)
    //this needs to be refined later
    
    if (nodeSum == 0) {
        return 0
    }
    if (nodeCount == 0) {
        return 0
    }
    console.log('made it here')


    const candidateToParent = distsToRoot[candidate.node_id] - distsToRoot[candidate.parent_id]
    const meanDistance = nodeSum / nodeCount
    let candidateVal
    if (meanDistance + candidateToParent == 0) {
        candidateVal = 0
    } else {
        //candidate_value = node_count * candidate_to_parent / (mean_distances + candidate_to_parent)

        candidateVal = nodeCount * candidateToParent / (meanDistance + candidateToParent)
    }
    //console.log('candidateVal', candidate.node_id, candidateVal)
    return  candidateVal

    
}

const evaluateLineages = (rbfs, sumAndCounts, distsToRoot, skipSet) => {
    const goodCandidates = {}
    for (let node in rbfs) {
        //console.log('evaluating node', node,  rbfs[node].name, rbfs[node].node_id, rbfs[node].mutations.length)
        //this will need to ignore certain nodes at some point
        if  (!rbfs[node].is_tip && !skipSet.has(rbfs[node].node_id)) {

            const candidateVal = evaluateCandidates(rbfs[node], sumAndCounts, distsToRoot)
            if (candidateVal > 0) {
                goodCandidates[rbfs[node].node_id] = candidateVal
                //goodCandidates.push(candidateVal)
            }

        }
    }
    console.log('good candidates', goodCandidates)
    let bestNodeId = null;
    let bestValue = 0;
    for (let nodeId in goodCandidates) {
        if (goodCandidates[nodeId] > bestValue) {
        bestValue = goodCandidates[nodeId];
        bestNodeId = nodeId;
        }
    }
    console.log('bestNodeId', bestNodeId, 'bestValue', bestValue)
    //no candidates
    //if (bestNodeId == null) {
    return {bestNodeId, bestValue}
}

//this will need to be tested more extensively later
const getLeaves = (nodeMap, nodeId) => {
    const leaves = []
    const recursiveHelper = (node) => {
        if (node.is_tip) {
            leaves.push(node.node_id);
        } else {
            for (let child of node.children) {
                recursiveHelper(nodeMap[child.node_id]);
            }
        }
    }
    recursiveHelper(nodeMap[nodeId]);
    return leaves
}

const getAncestors = (nodeMap, nodeId) => {
    console.log(nodeMap)
    const ancestors = []
    let current = nodeMap[nodeId]
    console.log('current', current.node_id)
    console.log('current parent', current.parent_id)
    console.log(current)
    ancestors.push(current.node_id)
    //currently the root parent is itself, this may be different later keep that in mind for debugging 
    //will test this more extensively when i have a larger tree
    while (current.parent_id !== current.node_id) {
        current = nodeMap[current.parent_id]
        ancestors.push(current.node_id)        
    }
    for (let a in ancestors) {
        console.log('ancestor', a, ancestors[a])
    }
    return ancestors
}

const getSkipSet = (nodeMap, mostRecentAnnotations) => {
    const skipSet = new Set()
    for (let a in mostRecentAnnotations) {
        console.log('a', a, 'mostRecentAnnotations[a]', mostRecentAnnotations[a])
        const ancestors = getAncestors(nodeMap, mostRecentAnnotations[a])
        for (let anc of ancestors) {
            console.log('anc', anc)
            skipSet.add(anc)
        }
    }
    return skipSet
}

//this is your main analysis function it gets exported so it should call everything 
export const analyzeTree = async (treeData) => {
    console.log("is this working", treeData)
    // do i need a node map? perhaps not
    const {nodeMap, root} =  makeNodeMap(treeData)
    //console.log("Starting reverse BFS with root:", root ? root.node_id : "None")

    //should this take root? maybe not the best option, just temporary
    const mostRecentAnnotations = searchForLins(root)
    const originalAnnotations = new Set(Object.keys(mostRecentAnnotations));
    //this will need to be tested more extensively later
    const skipSet = getSkipSet(nodeMap, mostRecentAnnotations)
    console.log("Skip set:", skipSet)
    console.log("Most recent annotations:", mostRecentAnnotations)
    //const result = reverseBFS(nodeMap,root);
    let loop = true
    while (loop) {
        //iterate throught most recent annotations, or just the root if there are no annotations
        //method currently assusmes no annotations FIX LATER
        const newAnnotations = {}
        for (let a in mostRecentAnnotations) {
            const serial = 1
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
            console.log('distsToRoot', distsToRoot)
            //can this be a const? 
            //at some point this needs to have the option to recursively assign lineages
            const inner_loop = true 
            while (inner_loop) {
                // this will need to be more complicated once labels are preannoated and weighting is added
                const sumAndCounts = getSumAndCount(rbfs, skipSet)
                const {bestNodeId, bestValue} = evaluateLineages(rbfs, sumAndCounts, distsToRoot, skipSet)
                console.log('bestNode', bestNodeId, 'bestScore', bestValue)
                console.log('a', a, 'mostRecentAnnotations[a]', mostRecentAnnotations[a])
                let prefix = ''
                if (a.slice(0, 5) === 'auto.') {
                    //will likely need to break this out into a function later
                    //console.log('inner loop')
                    prefix = a
                }
                else {
                    prefix = 'auto.' + a
                }
                //new
                let newName = prefix + "." + String(serial)
                console.log('prefix', prefix)
                console.log('newName', newName)
                console.log('originalAnnotations', originalAnnotations)
                console.log('inner loop done')
                //make sure this works, need a new test tree
                while (originalAnnotations.has(newName) || originalAnnotations.has(newName.replace(/^auto\./, ''))) {
                    serial += 1
                    newName = prefix + "." + String(serial)
                    console.log('newName', newName, 'serial', serial)
                }

                const ancestors = getAncestors(nodeMap, bestNodeId)
                for (let anc in ancestors) {
                    console.log('anc', ancestors[anc])
                    skipSet.add(ancestors[anc])
                }
                newAnnotations[newName] = bestNodeId
                const leaves = getLeaves(nodeMap, bestNodeId)
                console.log('leaves', leaves)
                console.log('skipSet', skipSet)
                //START HERE LILY
                for (l of leaves)
                    labeled.add(l)
                //if len(labeled) >= leaf_count * args.cutoff:
                    break
                serial += 1

                //this shouldn't break we need conditions 
                break
                }
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

