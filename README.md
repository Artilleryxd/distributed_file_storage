# Distributed File Storage System

A distributed file storage system that demonstrates key concepts in distributed computing, including file chunking, load balancing, and fault tolerance.

## Features

- **File Chunking**: Files are split into smaller chunks for distributed storage
- **Load Balancing**: Chunks are distributed across nodes using a round-robin algorithm
- **Fault Tolerance**: The system monitors node health and can handle node failures
- **Parallel Processing**: File reconstruction happens by fetching chunks in parallel
- **Visual Dashboard**: See how files are distributed across storage nodes

## Architecture

The system consists of:

1. **Main Server**: Handles client requests, file management, and load balancing
2. **Storage Nodes**: Store and serve file chunks
3. **MongoDB**: Stores file metadata and chunk locations
4. **React Frontend**: Provides the user interface

## Technologies Used

- **Backend**: Node.js, Express
- **Frontend**: React, Tailwind CSS, Chart.js
- **Database**: MongoDB
- **File Handling**: Multer, node-fetch

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/distributed-storage.git
   cd distributed-storage
   ```

2. Install dependencies:
   ```
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Start MongoDB:
   ```
   # Make sure MongoDB is running on your system
   ```

4. Start the storage nodes (in separate terminals):
   ```
   # Terminal 1
   cd backend
   NODE_ID=1 PORT=3001 node storageNode.js

   # Terminal 2
   cd backend
   NODE_ID=2 PORT=3002 node storageNode.js

   # Terminal 3
   cd backend
   NODE_ID=3 PORT=3003 node storageNode.js
   ```

5. Start the main server:
   ```
   # In a new terminal
   cd backend
   npm start
   ```

6. Start the frontend:
   ```
   # In a new terminal
   cd frontend
   npm run dev
   ```

7. Open your browser and navigate to `http://localhost:5173`

## How It Works

1. When a file is uploaded, it's split into chunks (default 1MB each)
2. Chunks are distributed across storage nodes using round-robin
3. Metadata about the file and chunk locations is stored in MongoDB
4. When downloading, chunks are fetched in parallel and reassembled

## Project Structure

```
distributed-storage/
├── backend/
│   ├── app.js                 # Main server
│   ├── storageNode.js         # Storage node implementation
│   └── services/
│       └── fileService.js     # File handling logic
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── services/          # API services
│   │   ├── App.jsx            # Main application
│   │   └── main.jsx           # Entry point
│   └── public/                # Static assets
└── README.md                  # This file
```

## Future Enhancements

- Implement data replication for better fault tolerance
- Add encryption for secure storage
- Implement compression before chunking
- Add user authentication and file permissions
- Implement more sophisticated load balancing based on node capacity

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- This project was created as a demonstration for a distributed computing class
- Inspired by distributed systems like HDFS and GFS 