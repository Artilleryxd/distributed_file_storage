import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadFile } from '../services/api';
import { FiUpload, FiFile, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const FileUpload = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    setUploading(true);
    setUploadStatus('uploading');
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 300);
      
      const result = await uploadFile(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStatus('success');
      
      if (onUploadSuccess) {
        onUploadSuccess(result);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadStatus('error');
    } finally {
      setUploading(false);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  return (
    <div className="card mb-6">
      <h2 className="text-xl font-bold mb-4">Upload File</h2>
      
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'}`}
      >
        <input {...getInputProps()} />
        
        {uploadStatus === 'uploading' ? (
          <div className="flex flex-col items-center">
            <FiUpload className="text-4xl text-primary-500 mb-2" />
            <p className="text-lg font-medium">Uploading...</p>
            <div className="w-full max-w-md h-2 bg-gray-200 rounded-full mt-4">
              <div 
                className="h-full bg-primary-500 rounded-full transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : uploadStatus === 'success' ? (
          <div className="flex flex-col items-center">
            <FiCheckCircle className="text-4xl text-green-500 mb-2" />
            <p className="text-lg font-medium">Upload Successful!</p>
            <button 
              className="btn-primary mt-4"
              onClick={(e) => {
                e.stopPropagation();
                setUploadStatus(null);
                setUploadProgress(0);
              }}
            >
              Upload Another File
            </button>
          </div>
        ) : uploadStatus === 'error' ? (
          <div className="flex flex-col items-center">
            <FiAlertCircle className="text-4xl text-red-500 mb-2" />
            <p className="text-lg font-medium">Upload Failed</p>
            <p className="text-sm text-gray-500 mt-1">Please try again</p>
            <button 
              className="btn-primary mt-4"
              onClick={(e) => {
                e.stopPropagation();
                setUploadStatus(null);
                setUploadProgress(0);
              }}
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <FiFile className="text-4xl text-gray-400 mb-2" />
            <p className="text-lg font-medium">
              {isDragActive ? 'Drop the file here' : 'Drag & drop a file here, or click to select'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              The file will be split and distributed across multiple storage nodes
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload; 