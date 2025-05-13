import { useState } from 'react'
import './App.css'
import FileDropzone from './components/FileDropzone.jsx'
import { processJsonlGz } from './components/jsonlProcess.jsx'

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

    fileReader.onload = (event) => {
      setProcessingStatus({ 
        message: "File loaded successfully, ready to process" 
      });
      console.log("File loaded as ArrayBuffer");
    };

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
      <h1>Hello World</h1>
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



      {/*<div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>*/}
    </>
  )
}

export default App
