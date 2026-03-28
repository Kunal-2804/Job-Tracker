import axios from 'axios';

const API_URL = 'http://localhost:5000/api/jobs/';

// Get auth config
const getConfig = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const token = user?.token;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get all jobs
const getJobs = async (search = '', status = 'All') => {
  let queryStr = '';
  if (search || (status && status !== 'All')) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status && status !== 'All') params.append('status', status);
    queryStr = `?${params.toString()}`;
  }
  const response = await axios.get(API_URL + queryStr, getConfig());
  return response.data;
};

// Create new job
const createJob = async (jobData) => {
  const response = await axios.post(API_URL, jobData, getConfig());
  return response.data;
};

// Update job
const updateJob = async (jobId, jobData) => {
  const response = await axios.put(API_URL + jobId, jobData, getConfig());
  return response.data;
};

// Delete job
const deleteJob = async (jobId) => {
  const response = await axios.delete(API_URL + jobId, getConfig());
  return response.data;
};

const jobService = {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
};

export default jobService;
