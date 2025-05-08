import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FileDropzone from './components/FileDropzone.jsx'

function App() {
  {/*const [count, setCount] = useState(0)*/}
  const [selectedFile, setSelectedFile] = useState(null)
  const handleFileSelect = (file) => {
    setSelectedFile(file)
    console.log('File selected:', file)
    // Add your file processing logic here
  }


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
        acceptedFileTypes={['application/pdf', 'text/plain', 'application/json']}
        maxSize={5 * 1024 * 1024} // 5MB max file size
      />
      
      {/* Display selected file info if a file is selected */}
      {selectedFile && (
        <div className="selected-file-info">
          <h3>Selected File:</h3>
          <p>Name: {selectedFile.name}</p>
          <p>Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
          <p>Type: {selectedFile.type}</p>
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
