import { useState } from 'react'
import './App.css'
import FileDropzone from './components/FileDropzone.jsx'
import { processJsonlGz } from './components/jsonlProcess.jsx'
import TreeVisualizer from './components/TreeVisualizer.jsx'
import AutolinFuncs from './components/AutolinFuncs.jsx'


function App() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [processingStatus, setProcessingStatus] = useState(null)
  const [processedData, setProcessedData] = useState(null)
  const [error, setError] = useState(null)

  const handleFileSelect = (file) => {
    setSelectedFile(file)
    setProcessingStatus(null)
    setProcessedData(null)
    setError(null)


    console.log('File selected:', file)
    // Add your file processing logic here
  }

  const handleProcessFile = () => {
    if (!selectedFile) return;
    
    console.log('Starting to process file:', selectedFile.name);
    setProcessingStatus({ message: "Starting file processing..." });

    // Read the file as ArrayBuffer
    const fileReader = new FileReader();

    // WITH THIS FUNCTION
    fileReader.onload = async (event) => {
      try {
        setProcessingStatus({ 
          message: "File loaded successfully, starting to process..." 
        });
        console.log("File loaded as ArrayBuffer");
        
        // Get the file data from the event
        const fileData = event.target.result;
        
        // Process the file with processJsonlGz
        await processJsonlGz({
          data: fileData,
          source: 'file',
          filename: selectedFile.name,
          onProgress: (progress) => {
            // Update status with progress information
            setProcessingStatus(progress);
          },
          onComplete: (result) => {
            // Handle successful completion
            setProcessingStatus({ message: "Read File complete!" });
            setProcessedData(result.data);
            console.log("File read complete:");
          },
          onError: (err) => {
            // Handle errors during processing
            setError(err);
            setProcessingStatus({ message: "Error processing file" });
            console.error("Processing error:", err);
          }
        });
      } catch (err) {
        // Handle any errors in this function
        setError({ message: err.message });
        setProcessingStatus({ message: "Error processing file" });
        console.error("Error:", err);
      }
    };

    fileReader.readAsArrayBuffer(selectedFile);
  }
  
  // Update the button to use this function
  


  return (
    <>
      {/*
      <div>
        <a href="https://vite.dev" target="_blank">
        <img src={viteLogo} className="logo" alt="Vite logo" /> 
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      */}
      <h1>Autolin Prototype</h1>
      {/* Add the FileDropzone component here */}
      <FileDropzone 
        onFileSelect={handleFileSelect}
        acceptedFileTypes={['application/gzip', 'application/x-gzip']}
        acceptedExtensions={['.jsonl.gz']}
        maxSize={5 * 1024 * 1024} // 5MB max file size
      />
      
      {/* Display selected file info if a file is selected */}
      {selectedFile && (
        <div className="selected-file-info">
          <h3>Selected File:</h3>
          <p>Name: {selectedFile.name}</p>
          <p>Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
          <p>Type: {selectedFile.type}</p>
          <button onClick={handleProcessFile} 
            className="process-button"
            >
            Process File
          </button>
        </div>
      )}

      {processingStatus && (
        <div className="processing-status">
          <h3>Processing Status:</h3>
          <p>{processingStatus.message}</p>
        </div>
      )}
      {processedData && (
        <div className="processed-data">
          <h3>Tree Data:</h3>
          
          {processedData.records && processedData.records.length > 0 && (
            <div className="data-section">
              {/*}
              <h4>Node Overview:</h4>
              <p>Successfully processed {processedData.records.length.toLocaleString()} tree nodes</p>
              
              <h5>Node Properties:</h5>
              <ul>
                {Object.keys(processedData.records[0]).map(key => (
                  <li key={key}>{key}</li>
                ))}
              </ul>
              */}
              {/*}
              <h5>Tree Structure:</h5>
              <ul className="tree-info">
                {processedData.records[0].id && (
                  <li>Node ID field: <code>id</code></li>
                )}
                {processedData.records[0].parent_id && (
                  <li>Parent reference: <code>parent_id</code></li>
                )}
                {processedData.records[0].children && (
                  <li>Children field: <code>children</code> (nested structure)</li>
                )}
                {processedData.records[0].name && (
                  <li>Node name field: <code>name</code></li>
                )}
                {processedData.records[0].type && (
                  <li>Node type field: <code>type</code></li>
                )}
                {processedData.records[0].level !== undefined && (
                  <li>Depth/level field: <code>level</code></li>
                )}
              </ul>
              */}
              
              
            </div>
          )}
          
        </div>
      )}
      
      {processedData && processedData.records && processedData.records.length > 0 && (
        <div className="tree-visualization-container">
          <TreeVisualizer treeData={processedData} />
        </div>
      )}
       
      {processedData && processedData.records && processedData.records.length > 0 && (
        <>
          console.log("Tree data:", processedData)
          <AutolinFuncs treeData={processedData} /> 
        </>
      )}
    </>
  )
}

export default App
