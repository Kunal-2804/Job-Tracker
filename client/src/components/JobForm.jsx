import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const JobForm = ({ job, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    jobRole: '',
    status: 'Applied',
    applicationDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    if (job) {
      setFormData({
        companyName: job.companyName,
        jobRole: job.jobRole,
        status: job.status,
        applicationDate: new Date(job.applicationDate).toISOString().split('T')[0],
        notes: job.notes || '',
      });
    }
  }, [job]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="btn-icon modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
          {job ? 'Edit Application' : 'Add Application'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="companyName">Company Name *</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              className="form-input"
              value={formData.companyName}
              onChange={handleChange}
              required
              placeholder="e.g. Google, Microsoft"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="jobRole">Job Role *</label>
            <input
              type="text"
              id="jobRole"
              name="jobRole"
              className="form-input"
              value={formData.jobRole}
              onChange={handleChange}
              required
              placeholder="e.g. Frontend Developer"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="status">Status *</label>
            <select
              id="status"
              name="status"
              className="form-input"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="applicationDate">Application Date</label>
            <input
              type="date"
              id="applicationDate"
              name="applicationDate"
              className="form-input"
              value={formData.applicationDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              className="form-input"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Any additional details..."
            ></textarea>
          </div>

          <div className="flex justify-between" style={{ marginTop: '2rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {job ? 'Save Changes' : 'Add Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;
