import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const getFiles = async () => {
  const response = await api.get('/files');
  return response.data;
};

export const downloadFile = async (fileId) => {
  const response = await api.get(`/files/${fileId}/download`, {
    responseType: 'blob',
  });
  
  return response.data;
};

export const getNodesStatus = async () => {
  const response = await api.get('/nodes/status');
  return response.data;
};

export default api; 