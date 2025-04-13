import { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { FiHardDrive } from 'react-icons/fi';

ChartJS.register(ArcElement, Tooltip, Legend);

const DistributionVisualization = ({ files }) => {
  const [distributionData, setDistributionData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    if (!files || files.length === 0) {
      setDistributionData({
        labels: ['No Data'],
        datasets: [{
          data: [1],
          backgroundColor: ['#e5e7eb'],
          borderWidth: 0
        }]
      });
      return;
    }

    // Count chunks per node
    const nodeChunks = {};
    
    files.forEach(file => {
      file.chunks.forEach(chunk => {
        const nodeId = `Node ${chunk.nodeId}`;
        nodeChunks[nodeId] = (nodeChunks[nodeId] || 0) + 1;
      });
    });

    // Prepare chart data
    const labels = Object.keys(nodeChunks);
    const data = Object.values(nodeChunks);
    
    // Colors for each node
    const backgroundColors = [
      'rgba(54, 162, 235, 0.6)',
      'rgba(255, 99, 132, 0.6)',
      'rgba(75, 192, 192, 0.6)',
      'rgba(255, 206, 86, 0.6)',
      'rgba(153, 102, 255, 0.6)',
    ];

    setDistributionData({
      labels,
      datasets: [{
        data,
        backgroundColor: backgroundColors.slice(0, labels.length),
        borderWidth: 1,
        borderColor: backgroundColors.slice(0, labels.length).map(color => color.replace('0.6', '1')),
      }]
    });
  }, [files]);

  // Calculate total chunks
  const totalChunks = files.reduce((total, file) => total + file.chunks.length, 0);

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Chunk Distribution</h2>
      
      <div className="flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/2 mb-4 md:mb-0">
          <div style={{ height: '250px' }}>
            <Pie 
              data={distributionData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const percentage = Math.round((value / totalChunks) * 100);
                        return `${label}: ${value} chunks (${percentage}%)`;
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
        
        <div className="w-full md:w-1/2 md:pl-6">
          <h3 className="font-medium mb-2">Distribution Statistics</h3>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <FiHardDrive className="text-gray-500 mr-2" />
              <span className="text-sm">Total Files: {files.length}</span>
            </div>
            
            <div className="flex items-center">
              <FiHardDrive className="text-gray-500 mr-2" />
              <span className="text-sm">Total Chunks: {totalChunks}</span>
            </div>
            
            {Object.entries(distributionData.labels).map(([index, label]) => {
              if (label === 'No Data') return null;
              
              const value = distributionData.datasets[0].data[index];
              const percentage = Math.round((value / totalChunks) * 100);
              const bgColor = distributionData.datasets[0].backgroundColor[index];
              
              return (
                <div key={label} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: bgColor }}
                  />
                  <span className="text-sm">
                    {label}: {value} chunks ({percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Files are split into chunks and distributed across nodes using a round-robin algorithm for load balancing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributionVisualization; 