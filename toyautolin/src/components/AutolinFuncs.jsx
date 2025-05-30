import { useState, useEffect } from "react";
import { analyzeTree } from "../utils/treeFunctions"; // Add this import


const TreeProcessor = ({ treeData }) => {
  const [analysisResults, setAnalysisResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!treeData) return;

    const runAnalysis = async () => {
      setLoading(true);
      setError(null);

      try {
        // Simulate a complex analysis function
        const results = await analyzeTree(treeData);
        setAnalysisResults(results);
      } catch (err) {
        setError(err.message || "Analysis failed");
      } finally {
        setLoading(false);
      }
    };

    runAnalysis();
  }, [treeData]);

  return (
    <div className="tree-processor">
      <h3>Tree Data Analysis</h3>

      {loading && <p>Running analysis...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {analysisResults && (
        <pre>{JSON.stringify(analysisResults, null, 2)}</pre>
      )}
    </div>
  );
};

export default TreeProcessor;
