import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Briefcase, Loader2, Plus, Search, LogOut } from 'lucide-react';
import JobItem from '../components/JobItem';
import JobForm from '../components/JobForm';
import JobStats from '../components/JobStats';
import ErrorBoundary from '../components/ErrorBoundary';
import jobService from '../services/jobService';
import authService from '../services/authService';

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search and Filter State with URL Query Params
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [filterStatus, setFilterStatus] = useState(searchParams.get('status') || 'All');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('user'));

  // Fetch Jobs
  const fetchJobs = async (search, status) => {
    try {
      setLoading(true);
      const data = await jobService.getJobs(search, status);
      setJobs(data);
      setError(null);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        authService.logout();
        navigate('/login');
      } else {
        setError('Failed to fetch jobs. Make sure the server is running.');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Sync URL with Search Params
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (filterStatus !== 'All') params.set('status', filterStatus);
    setSearchParams(params, { replace: true });

    // Fetch jobs debounce
    const delayDebounceFn = setTimeout(() => {
      fetchJobs(searchTerm, filterStatus);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filterStatus, setSearchParams, navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // Handlers
  const handleAddJob = async (jobData) => {
    try {
      if (editingJob) {
        const updatedJob = await jobService.updateJob(editingJob._id, jobData);
        setJobs(jobs.map((job) => (job._id === updatedJob._id ? updatedJob : job)));
      } else {
        // Create new job. Refetch matching filters to preserve list
        await jobService.createJob(jobData);
        fetchJobs(searchTerm, filterStatus);
      }
      setIsModalOpen(false);
      setEditingJob(null);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        authService.logout();
        navigate('/login');
      } else {
        alert('Error saving job application.');
      }
    }
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await jobService.deleteJob(id);
        setJobs(jobs.filter((job) => job._id !== id));
      } catch (err) {
        console.error(err);
        alert('Error deleting job application.');
      }
    }
  };

  const openAddModal = () => {
    setEditingJob(null);
    setIsModalOpen(true);
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  return (
    <>
      <header className="header">
        <div className="container header-content">
          <div className="logo">
            <Briefcase size={28} className="logo-icon" />
            <span className="text-gradient">JobTracker</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span className="text-muted" style={{ display: 'none' }}>Hi, {user?.name}</span>
            <button className="btn btn-primary" onClick={openAddModal}>
              <Plus size={18} /> Add Application
            </button>
            <button className="btn btn-secondary" onClick={handleLogout} style={{ padding: '0.5rem', backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}>
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="container" style={{ padding: '2rem 1.5rem', minHeight: 'calc(100vh - 80px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>Dashboard</h1>
            <p className="text-muted">Manage your job applications</p>
          </div>

          <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} className="text-muted" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                placeholder="Search company or role..." 
                className="form-input" 
                style={{ paddingLeft: '2.5rem', width: '250px' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select 
              className="form-input" 
              style={{ width: 'auto' }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {!loading && jobs.length > 0 && (
          <ErrorBoundary>
            <JobStats jobs={jobs} />
          </ErrorBoundary>
        )}

        {error && (
          <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--status-rejected-text)', borderRadius: 'var(--radius-md)', marginBottom: '2rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center" style={{ minHeight: '300px' }}>
            <Loader2 size={48} className="logo-icon" style={{ animation: 'spin 1s linear infinite' }} />
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          </div>
        ) : jobs.length > 0 ? (
          <div className="job-grid">
            {jobs.map((job) => (
              <JobItem 
                key={job._id} 
                job={job} 
                onEdit={openEditModal} 
                onDelete={handleDeleteJob} 
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Briefcase className="empty-icon" />
            <h3>No applications found</h3>
            <p className="text-muted" style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>
              {searchTerm || filterStatus !== 'All' 
                ? "We couldn't find any applications matching your search or filters." 
                : "It looks like you haven't added any job applications yet."}
            </p>
            {!searchTerm && filterStatus === 'All' && (
              <button className="btn btn-primary" onClick={openAddModal}>
                <Plus size={18} /> Add Your First Application
              </button>
            )}
            {(searchTerm || filterStatus !== 'All') && (
              <button className="btn btn-secondary" onClick={() => { setSearchTerm(''); setFilterStatus('All'); }}>
                Clear Filters
              </button>
            )}
          </div>
        )}
      </main>

      {isModalOpen && (
        <JobForm 
          job={editingJob} 
          onSubmit={handleAddJob} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
}

export default Dashboard;
