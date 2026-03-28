import React from 'react';
import { format } from 'date-fns';

const COLORS = {
  Applied: '#60a5fa', // Blue
  Interview: '#c084fc', // Purple
  Offer: '#4ade80', // Green
  Rejected: '#f87171' // Red
};

const JobStats = ({ jobs }) => {
  if (!jobs || jobs.length === 0) return null;

  // 1. Calculate Status Counts
  const statusCounts = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, { Applied: 0, Interview: 0, Offer: 0, Rejected: 0 });

  const totalJobs = jobs.length;

  // 2. Calculate Monthly Applications for Bar Chart
  const monthlyDataMap = jobs.reduce((acc, job) => {
    if (job.applicationDate) {
      const date = new Date(job.applicationDate);
      if (!isNaN(date.getTime())) {
        const monthYear = format(date, 'MMM yyyy');
        acc[monthYear] = (acc[monthYear] || 0) + 1;
      }
    }
    return acc;
  }, {});

  const barData = Object.keys(monthlyDataMap)
    .map(key => ({
      name: key,
      Applications: monthlyDataMap[key]
    }))
    .sort((a, b) => new Date(a.name) - new Date(b.name));

  const maxApplications = Math.max(...barData.map(d => d.Applications), 1);

  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* Summary Cards */}
      <div style={{ 
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem'
      }}>
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem', borderTop: `4px solid ${COLORS[status]}` }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>{status}</h3>
            <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: COLORS[status], marginTop: '0.5rem' }}>{count}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* CSS Status Bar (Replacing Pie Chart) */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
           <h3 style={{ marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text-primary)' }}>Application Status Breakdown</h3>
           
           <div style={{ display: 'flex', height: '24px', borderRadius: '12px', overflow: 'hidden', marginBottom: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
             {Object.entries(statusCounts).map(([status, count]) => count > 0 && (
               <div key={status} style={{ width: `${(count / totalJobs) * 100}%`, backgroundColor: COLORS[status] }} title={`${status}: ${count}`} />
             ))}
           </div>
           
           <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
             {Object.entries(statusCounts).map(([status, count]) => count > 0 && (
               <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                 <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: COLORS[status] }} />
                 {status} <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>({((count / totalJobs) * 100).toFixed(0)}%)</span>
               </div>
             ))}
           </div>
        </div>

        {/* CSS Bar Chart */}
        <div className="card">
           <h3 style={{ marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text-primary)' }}>Applications Over Time</h3>
           
           <div style={{ display: 'flex', alignItems: 'flex-end', height: '200px', gap: '12px', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)', overflowX: 'auto' }}>
             {barData.map((data, index) => {
               const heightPercent = (data.Applications / maxApplications) * 100;
               return (
                 <div key={index} style={{ flex: 1, minWidth: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', height: '100%', justifyContent: 'flex-end' }}>
                   <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{data.Applications}</span>
                   <div style={{ 
                     width: '100%', 
                     maxWidth: '50px',
                     height: `${heightPercent}%`, 
                     backgroundColor: 'var(--accent-primary)', 
                     borderRadius: '6px 6px 0 0', 
                     minHeight: '4px',
                     transition: 'height 0.4s ease-out'
                   }} title={`${data.name}: ${data.Applications}`} />
                   <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', marginTop: '0.25rem' }}>
                     {data.name}
                   </span>
                 </div>
               );
             })}
           </div>
        </div>
      </div>
    </div>
  );
};

export default JobStats;
