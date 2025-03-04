import React, { useState } from 'react'

function Modal({ isVisible, onClose }) {
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  if (!isVisible) return null;

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (fileName && selectedFile) {
      // Handle file upload logic here
      console.log("File name:", fileName);
      console.log("Selected file:", selectedFile);

      // Clear the form after submission
      setFileName("");
      setSelectedFile(null);
      onClose(); // Close the modal after submission
    } else {
      alert("Please provide a file name and select a file.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[400px] p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Upload File</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            ✖
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              File Name
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter file name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select File
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100 
              file:transition-all
              file:cursor-pointer"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 cursor-pointer"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Modal;
