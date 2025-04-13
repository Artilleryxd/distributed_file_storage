import { useState, useEffect } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import NodeStatus from './components/NodeStatus';
import DistributionVisualization from './components/DistributionVisualization';
import { getFiles, getNodesStatus } from './services/api';
import { FiInfo } from 'react-icons/fi';

function App() {
  const [files, setFiles] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [filesData, nodesData] = await Promise.all([
        getFiles(),
        getNodesStatus()
      ]);
      
      setFiles(filesData);
      setNodes(nodesData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUploadSuccess = (newFile) => {
    setFiles(prevFiles => [newFile, ...prevFiles]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 flex items-start">
            <FiInfo className="mt-0.5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <FileUpload onUploadSuccess={handleUploadSuccess} />
            
            {loading ? (
              <div className="card p-8 text-center">
                <p className="text-gray-500">Loading data...</p>
              </div>
            ) : (
              <FileList files={files} onRefresh={fetchData} />
            )}
          </div>
          
          <div className="space-y-6">
            <NodeStatus nodes={nodes} onRefresh={fetchData} />
          </div>
        </div>
        
        <div className="mt-6">
          <DistributionVisualization files={files} />
        </div>
        
      </main>
    </div>
  );
}

export default App;
