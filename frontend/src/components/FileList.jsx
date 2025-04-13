import { useState } from 'react';
import { FiDownload, FiFile, FiHardDrive } from 'react-icons/fi';
import { downloadFile } from '../services/api';

const FileList = ({ files, onRefresh }) => {
  const [downloading, setDownloading] = useState({});

  const handleDownload = async (file) => {
    if (downloading[file.fileId]) return;
    
    setDownloading(prev => ({ ...prev, [file.fileId]: true }));
    
    try {
      const blob = await downloadFile(file.fileId);
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = file.originalName;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download file. Please try again.');
    } finally {
      setDownloading(prev => ({ ...prev, [file.fileId]: false }));
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Your Files</h2>
        <button 
          className="btn-secondary text-sm"
          onClick={onRefresh}
        >
          Refresh
        </button>
      </div>
      
      {files.length === 0 ? (
        <div className="text-center py-8">
          <FiFile className="text-4xl text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No files uploaded yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploaded
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chunks
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {files.map((file) => (
                <tr key={file.fileId} className="hover:bg-gray-500 transition-all ">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiFile className="text-gray-400 mr-2" />
                      <span className="font-medium">{file.originalName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {formatFileSize(file.size)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {formatDate(file.createdAt)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiHardDrive className="text-gray-400 mr-1" />
                      <span>{file.chunks.length} chunks</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <button
                      className="inline-flex cursor-pointer items-center text-sm text-primary-600 hover:text-primary-800"
                      onClick={() => handleDownload(file)}
                      disabled={downloading[file.fileId]}
                    >
                      <FiDownload className="mr-1" />
                      {downloading[file.fileId] ? 'Downloading...' : 'Download'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FileList; 