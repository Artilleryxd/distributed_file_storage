import { FiServer, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const NodeStatus = ({ nodes, onRefresh }) => {
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Storage Nodes</h2>
        <button 
          className="btn-secondary text-sm"
          onClick={onRefresh}
        >
          Refresh Status
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {nodes.map((node) => (
          <div 
            key={node.id} 
            className={`p-4 rounded-lg border ${
              node.status === 'active' 
                ? 'border-green-200 bg-green-50' 
                : 'border-red-200 bg-red-50'
            }`}
          >
            <div className="flex items-center mb-2 w-fit">
              <FiServer className="text-gray-500 mr-2" />
              <h3 className="font-medium text-black">Node {node.id}</h3>
              {node.status === 'active' ? (
                <FiCheckCircle className="ml-auto text-green-500" />
              ) : (
                <FiXCircle className="ml-auto text-red-500" />
              )}
            </div>
            
            <div className="text-sm">
              <p className="text-black">
                Name: {node.Name}
              </p>
              <p className="text-gray-600 mt-1">
                Status: <span className={node.status === 'active' ? 'text-green-600' : 'text-red-600'}>
                  {node.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </p>
              {node.health && (
                <p className="text-black mt-1">
                  Storage: {node.Storage}
                </p>
              )}
              {node.error && (
                <p className="text-red-600 mt-1">
                  Error: {node.error}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NodeStatus; 