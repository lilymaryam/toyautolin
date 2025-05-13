import zlib from 'zlib';
import stream from 'stream';
import buffer from 'buffer';

/**
 * Process a JSONL.gz file and parse its contents
 * @param {Object} options - Configuration options
 * @param {ArrayBuffer|string} options.data - File data as ArrayBuffer or URL string
 * @param {string} options.source - Source type: 'file', 'url', or 'stream'
 * @param {string} options.filename - Filename (used to check if it's gzipped)
 * @param {function} options.onProgress - Callback for progress updates
 * @param {function} options.onComplete - Callback when processing is complete
 * @param {function} options.onError - Callback for error handling
 * @returns {Promise<Object>} Parsed data
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
  
  // Create appropriate stream based on file extension
  let inputStream;
  if (filename.toLowerCase().endsWith('.gz')) {
    inputStream = zlib.createGunzip();
  } else {
    inputStream = new stream.PassThrough();
  }
  
  // Object to store parsed data
  let parsedData = {
    header: null,
    records: []
  };
  
  // Set up processing pipeline
  let lineBuffer = '';
  let lineCount = 0;
  let isFirstLine = true;
  
  // Create a writable stream to process the data
  const dataProcessor = new stream.Writable({
    write(chunk, encoding, callback) {
      const chunkStr = chunk.toString();
      let start = 0;
      let end = chunkStr.indexOf('\n');
      
      while (end !== -1) {
        lineBuffer += chunkStr.slice(start, end);
        
        // Process the complete line
        if (lineBuffer.trim()) {
          try {
            const parsedLine = JSON.parse(lineBuffer);
            
            // First line is treated as header
            if (isFirstLine) {
              parsedData.header = parsedLine;
              isFirstLine = false;
            } else {
              parsedData.records.push(parsedLine);
              lineCount++;
              
              // Report progress every 1000 lines
              if (lineCount % 1000 === 0) {
                onProgress({
                  message: `Processed ${lineCount.toLocaleString()} records`,
                  count: lineCount
                });
              }
            }
          } catch (err) {
            onError({
              message: `Error parsing line: ${err.message}`,
              line: lineBuffer
            });
          }
        }
        
        lineBuffer = '';
        start = end + 1;
        end = chunkStr.indexOf('\n', start);
      }
      
      lineBuffer += chunkStr.slice(start);
      callback();
    },
    
    final(callback) {
      // Process any remaining data in the buffer
      if (lineBuffer.trim()) {
        try {
          const parsedLine = JSON.parse(lineBuffer);
          if (isFirstLine) {
            parsedData.header = parsedLine;
          } else {
            parsedData.records.push(parsedLine);
          }
        } catch (err) {
          onError({
            message: `Error parsing final line: ${err.message}`,
            line: lineBuffer
          });
        }
      }
      callback();
    }
  });
  
  // Set up the pipeline
  inputStream.pipe(dataProcessor);
  
  try {
    // Handle different input sources
    if (source === 'file') {
      const dataAsArrayBuffer = data;
      // Process the file in chunks to avoid memory issues
      const chunkSize = 5 * 1024 * 1024; // 5MB chunks
      for (let i = 0; i < dataAsArrayBuffer.byteLength; i += chunkSize) {
        const chunk = dataAsArrayBuffer.slice(i, i + chunkSize);
        const chunkAsBuffer = buffer.Buffer.from(chunk);
        inputStream.write(chunkAsBuffer);
        
        // Report chunking progress for large files
        if (i > 0 && i % (chunkSize * 5) === 0) {
          onProgress({
            message: `Reading file: ${Math.round(i/dataAsArrayBuffer.byteLength * 100)}%`,
            bytesProcessed: i,
            totalBytes: dataAsArrayBuffer.byteLength
          });
        }
      }
      inputStream.end();
      
    } else if (source === 'url') {
      const url = filename;
      onProgress({ message: "Fetching data from URL..." });
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const readableStream = response.body;
      // Convert web stream to Node.js stream - you'll need a library for this in the browser
      // Here using a simplified approach
      const reader = readableStream.getReader();
      const processChunk = async () => {
        const { done, value } = await reader.read();
        if (done) {
          inputStream.end();
          return;
        }
        inputStream.write(buffer.Buffer.from(value));
        processChunk();
      };
      
      processChunk();
      
    } else if (source === 'stream') {
      // If a stream is directly provided
      data.pipe(inputStream);
    } else {
      throw new Error(`Unknown source type: ${source}`);
    }
    
    // Wait for the pipeline to finish
    await new Promise((resolve, reject) => {
      dataProcessor.on('finish', resolve);
      dataProcessor.on('error', reject);
      inputStream.on('error', reject);
    });
    
    // Process and analyze the completed data
    onComplete({
      recordCount: parsedData.records.length,
      data: parsedData
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