import React from 'react';
//this is currently not in use and can prpobably be removed at some point
const TreeVisualizer = ({ treeData }) => {
  // Make sure we have data to display
  if (!treeData || !treeData.records || treeData.records.length === 0) {
    return <div>No data available to display</div>;
  }

  return (
    <div className="tree-table-container">
      <h4>Tree Node Relationships</h4>
      <p>Showing {treeData.records.length} nodes in total</p>
      
      <div className="table-wrapper">
        <table className="node-table">
          <thead>
            <tr>
              <th>Node ID</th>
              <th>Name</th>
              <th>Parent ID</th>
              <th>Is Tip</th>
              <th>Mutations</th>
            </tr>
          </thead>
          <tbody>
            {treeData.records.map((node, index) => (
              <tr key={index} className={node.is_tip ? "tip-node" : "internal-node"}>
                <td>{node.node_id}</td>
                <td>{node.name || "-"}</td>
                <td>{node.parent_id !== undefined ? node.parent_id : "ROOT"}</td>
                <td>{node.is_tip ? "Yes" : "No"}</td>
                <td>{node.mutations?.length || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TreeVisualizer;