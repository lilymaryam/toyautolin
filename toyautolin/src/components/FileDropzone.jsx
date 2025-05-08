import { useState, useRef } from 'react';
import './FileDropzone.css';

const FileDropzone = ({ onFileSelect, acceptedFileTypes, maxSize, multiple = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const validateFile = (file) => {
    // Check file type if specified
    if (acceptedFileTypes && !acceptedFileTypes.includes(file.type)) {
      setError(`File type not accepted. Please upload: ${acceptedFileTypes.join(', ')}`);
      return false;
    }
    
    // Check file size if specified (maxSize in bytes)
    if (maxSize && file.size > maxSize) {
      setError(`File too large. Maximum size: ${maxSize / (1024 * 1024)}MB`);
      return false;
    }
    
    return true;
  };

  const processFiles = (fileList) => {
    setError(null);
    const validFiles = [];
    
    Array.from(fileList).forEach(file => {
      if (validateFile(file)) {
        validFiles.push(file);
      }
    });
    
    if (validFiles.length > 0) {
      setFiles(multiple ? [...files, ...validFiles] : [validFiles[0]]);
      onFileSelect(multiple ? [...files, ...validFiles] : validFiles[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    onFileSelect(multiple ? newFiles : null);
  };

  return (
    <div className="file-dropzone-container">
      <div 
        className={`file-dropzone ${isDragging ? 'dragging' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          accept={acceptedFileTypes?.join(',')}
          multiple={multiple}
          style={{ display: 'none' }}
        />
        <div className="dropzone-content">
          <p>Drag and drop your file here</p>
          <p>or</p>
          <button type="button">Select File</button>
          {acceptedFileTypes && (
            <p className="file-types">
              Accepted file types: {acceptedFileTypes.join(', ')}
            </p>
          )}
        </div>
      </div>
      
      {error && <p className="error-message">{error}</p>}
      
      {files.length > 0 && (
        <div className="file-list">
          <h3>Selected Files:</h3>
          <ul>
            {files.map((file, index) => (
              <li key={index}>
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
                <button onClick={() => removeFile(index)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileDropzone;