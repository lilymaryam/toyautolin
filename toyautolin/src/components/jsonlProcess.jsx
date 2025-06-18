import pako from 'pako'; // You'll need to: npm install pako

//is this named wrong? is this a js file or a jsx file?

/**
 * Process a JSONL.gz file and parse its contents,
 * then build a tree from the nodes based on `node_id` and `parent_id`.
 */
export const processJsonlGz = async (options) => {
  const { 
    data, 
    source, 
    filename, 
    onProgress = () => {}, 
    onComplete = () => {},
    onError = () => {} 
  } = options;
  
  // Object to store parsed data
  let parsedData = {
    header: null,
    records: []
  };
  
  try {
    const isGzipped = filename.toLowerCase().endsWith('.gz');
    let fileData = new Uint8Array(data);
    let textContent;
    
    // Decompress if gzipped
    if (isGzipped) {
      try {
        onProgress({ message: "Decompressing gzip file..." });
        fileData = pako.inflate(fileData);
      } catch (err) {
        throw new Error(`Failed to decompress gzip file: ${err.message}`);
      }
    }
    
    // Convert to text
    onProgress({ message: "Converting to text..." });
    textContent = new TextDecoder().decode(fileData);
    
    // Split into lines
    onProgress({ message: "Processing JSONL data..." });
    const lines = textContent.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length === 0) {
      throw new Error('File contains no data');
    }
    
    // Process header (first line)
    try {
      parsedData.header = JSON.parse(lines[0]);
    } catch (err) {
      throw new Error(`Failed to parse header: ${err.message}`);
    }
    
    // Process records
    const totalLines = lines.length - 1; // Exclude header
    let successfulLines = 0;
    
    for (let i = 1; i < lines.length; i++) {
      try {
        if (lines[i].trim()) {
          parsedData.records.push(JSON.parse(lines[i]));
          successfulLines++;
        }
      } catch (err) {
        onError({
          message: `Error parsing line ${i+1}: ${err.message}`,
          line: lines[i]
        });
      }
      
      // Report progress every 1000 lines or at the end
      if (i % 1000 === 0 || i === lines.length - 1) {
        onProgress({
          message: `Processed ${i} of ${lines.length} lines`,
          count: i,
          totalLines: lines.length,
          percentComplete: Math.round((i / lines.length) * 100)
        });
      }
    }

    // Build a tree from the flat list of nodes
    const buildTree = (records) => {
      const nodes = {};
      let root = null;

      // Create node objects keyed by node_id
      records.forEach((record) => {
        nodes[record.node_id] = { 
          name: record.name,
          node_id: record.node_id, 
          is_tip: record.is_tip,
          mutations_count: record.mutations ? record.mutations.length : 0,
          children: [] 
        };
      });

      // Link children to parents
      records.forEach((record) => {
        if (record.parent_id === undefined || record.parent_id === null) {
          root = nodes[record.node_id];
        } else if (nodes[record.parent_id]) {
          nodes[record.parent_id].children.push(nodes[record.node_id]);
        }
      });

      // If no root was found, try to identify most likely root
      /*
      if (!root && records.length > 0) {
        console.warn("No explicit root node found, searching for node with most descendants");
        
        // Find node that's parent to the most nodes
        const childCounts = {};
        records.forEach(record => {
          if (record.parent_id !== undefined && record.parent_id !== null) {
            childCounts[record.parent_id] = (childCounts[record.parent_id] || 0) + 1;
          }
        });
        
        let maxCount = 0;
        let likelyRootId = null;
        
        Object.entries(childCounts).forEach(([id, count]) => {
          if (count > maxCount) {
            maxCount = count;
            likelyRootId = parseInt(id);
          }
        });
        
        if (likelyRootId !== null && nodes[likelyRootId]) {
          root = nodes[likelyRootId];
        }
      }

      // If still no root, use first node as root
      if (!root && records.length > 0) {
        console.warn("No root node identified, using first node as root");
        root = nodes[records[0].node_id];
      }
      */
      return root;
    };

    parsedData.tree = buildTree(parsedData.records);

    // Complete processing
    onComplete({
      recordCount: parsedData.records.length,
      data: parsedData,
      successRate: `${successfulLines} of ${totalLines} lines successfully parsed`
    });
    
    return parsedData;
    
  } catch (error) {
    onError({
      message: `Processing error: ${error.message}`,
      error
    });
    throw error;
  }
};
