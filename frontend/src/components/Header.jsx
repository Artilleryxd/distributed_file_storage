import { FiDatabase, FiHardDrive, FiGithub } from 'react-icons/fi';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <FiDatabase className="text-primary-600 text-2xl mr-2" />
            <h1 className="text-xl font-bold text-gray-900">Distributed Storage System</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-600">
              <FiHardDrive className="mr-1" />
              <span>3 Storage Nodes</span>
            </div>
            
            <a 
              href="https://github.com/yourusername/distributed-storage"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700"
            >
              <FiGithub className="text-xl" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 