import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Briefcase, Building2, Calendar, Edit2, Trash2, Clock } from 'lucide-react';

const JobItem = ({ job, onEdit, onDelete }) => {
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Applied': return 'badge-applied';
      case 'Interview': return 'badge-interview';
      case 'Offer': return 'badge-offer';
      case 'Rejected': return 'badge-rejected';
      default: return 'badge-applied';
    }
  };

  return (
    <div className="card">
      <div className="flex justify-between items-start" style={{ marginBottom: '1rem' }}>
        <div>
          <h3 className="flex items-center gap-2" style={{ color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            <Briefcase size={18} className="text-muted" />
            {job.jobRole}
          </h3>
          <p className="flex items-center gap-2 text-muted" style={{ fontSize: '0.875rem' }}>
            <Building2 size={16} />
            {job.companyName}
          </p>
        </div>
        <span className={`badge ${getStatusBadgeClass(job.status)}`}>
          {job.status}
        </span>
      </div>

      {job.notes && (
        <div style={{ 
          margin: '1rem 0', 
          padding: '0.75rem', 
          backgroundColor: 'rgba(15, 23, 42, 0.4)', 
          borderRadius: 'var(--radius-md)',
          fontSize: '0.875rem',
          color: 'var(--text-secondary)'
        }}>
          {job.notes}
        </div>
      )}

      <div className="flex justify-between items-center" style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
        <div className="flex flex-col gap-2" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span className="flex items-center gap-2">
            <Calendar size={14} /> Applied: {job.applicationDate ? new Date(job.applicationDate).toLocaleDateString() : 'N/A'}
          </span>
          <span className="flex items-center gap-2">
            <Clock size={14} /> Added {job.createdAt && !isNaN(new Date(job.createdAt).getTime()) ? formatDistanceToNow(new Date(job.createdAt)) : 'just now'} ago
          </span>
        </div>
        
        <div className="flex gap-2">
          <button onClick={() => onEdit(job)} className="btn-icon" title="Edit Application">
            <Edit2 size={18} />
          </button>
          <button onClick={() => onDelete(job._id)} className="btn-icon" style={{ color: 'var(--status-rejected-text)' }} title="Delete Application">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobItem;
