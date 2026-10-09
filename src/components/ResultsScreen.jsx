// function ResultsScreen({ result, onRestart }) {
//   // Safely extract fields — handle null/undefined result gracefully
//   const parkinsonsDetected = result?.final_label === 1
//   const taskResults = result?.task_results || []
//   const confidence = result?.final_confidence
//     ? (result.final_confidence * 100).toFixed(1)
//     : null

//   return (
//     <div className="results-screen">
//       <div className={`results-icon ${parkinsonsDetected ? 'warning' : 'success'}`}>
//         {parkinsonsDetected ? (
//           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <circle cx="12" cy="12" r="10" />
//             <line x1="12" x2="12" y1="8" y2="12" />
//             <line x1="12" x2="12.01" y1="16" y2="16" />
//           </svg>
//         ) : (
//           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
//             <polyline points="22 4 12 14.01 9 11.01" />
//           </svg>
//         )}
//       </div>

//       <h2 className="results-title">Assessment Complete</h2>

//       <div className="detection-result">
//         {!result ? (
//           // Fallback if result is null / not returned by backend
//           <div className="result-card success">
//             <h3>Assessment Finished</h3>
//             <p>
//               All speech tasks have been completed and submitted for analysis.
//               Please contact your administrator for the full report.
//             </p>
//           </div>
//         ) : parkinsonsDetected ? (
//           <div className="result-card warning">
//             <h3>Parkinson's Indicators Detected</h3>
//             <p>
//               Based on the speech analysis, potential indicators of Parkinson's
//               disease were detected. Please consult a medical professional for
//               further evaluation.
//             </p>
//             {confidence && (
//               <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', opacity: 0.8 }}>
//                 Model confidence: {confidence}%
//               </p>
//             )}
//           </div>
//         ) : (
//           <div className="result-card success">
//             <h3>No Parkinson's Indicators Detected</h3>
//             <p>
//               Based on the speech analysis, no significant indicators of
//               Parkinson's disease were detected at this time.
//             </p>
//             {confidence && (
//               <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', opacity: 0.8 }}>
//                 Model confidence: {confidence}%
//               </p>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Task-level breakdown */}
//       {taskResults.length > 0 && (
//         <div className="task-breakdown">
//           <h4 style={{ marginBottom: '0.75rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
//             Task Breakdown
//           </h4>
//           <div className="summary-grid">
//             {taskResults.map((t) => (
//               <div
//                 key={t.task_id}
//                 className={`summary-item ${t.label === 1 ? 'item-warning' : 'item-success'}`}
//               >
//                 <span className="summary-task-name">{t.task_name}</span>
//                 <span className={`summary-label ${t.label === 1 ? 'label-pd' : 'label-hc'}`}>
//                   {t.label_text}
//                 </span>
//               </div>
//             ))}
//           </div>
//           {result?.majority_vote && (
//             <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
//               Majority vote: {result.majority_vote.parkinsons_votes} Parkinson's / {result.majority_vote.healthy_votes} Healthy
//             </p>
//           )}
//         </div>
//       )}

//       <p className="disclaimer">
//         This screening tool is for informational purposes only and does not
//         constitute medical advice. Please consult a healthcare professional for
//         proper diagnosis.
//       </p>

//       <div className="results-actions">
//         <button className="action-button" onClick={onRestart}>
//           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
//             <path d="M21 3v5h-5" />
//             <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
//             <path d="M8 16H3v5" />
//           </svg>
//           Start New Assessment
//         </button>
//       </div>

//       <style>{`
//         .task-breakdown {
//           margin-bottom: 1.5rem;
//           text-align: center;
//         }
//         .summary-grid {
//           display: grid;
//           grid-template-columns: repeat(3, 1fr);
//           gap: 0.5rem;
//         }
//         .summary-item {
//           display: flex;
//           flex-direction: column;
//           gap: 0.25rem;
//           padding: 0.75rem;
//           border-radius: var(--radius);
//           background: var(--background-secondary);
//           border: 1px solid var(--border);
//         }
//         .summary-item.item-warning {
//           border-color: var(--warning);
//         }
//         .summary-item.item-success {
//           border-color: var(--success);
//         }
//         .summary-task-name {
//           font-size: 0.75rem;
//           text-transform: capitalize;
//           color: var(--text-muted);
//         }
//         .summary-label {
//           font-size: 0.8rem;
//           font-weight: 600;
//         }
//         .label-pd { color: var(--warning); }
//         .label-hc { color: var(--success); }
//         @media (max-width: 640px) {
//           .summary-grid { grid-template-columns: repeat(2, 1fr); }
//         }
//       `}</style>
//     </div>
//   )
// }

// export default ResultsScreen

function ResultsScreen({ result, onRestart }) {
  const parkinsonsDetected = result?.final_label === 1
  const taskResults        = result?.task_results || []
  const confidence         = result?.final_confidence
    ? (result.final_confidence * 100).toFixed(1)
    : null

  return (
    <div className="results-screen">
      <div className="results-screen-card">

        {/* Hero icon */}
        <div className={`results-icon ${parkinsonsDetected ? 'warning' : 'success'}`}>
          {parkinsonsDetected ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" x2="12" y1="8" y2="12"/>
              <line x1="12" x2="12.01" y1="16" y2="16"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          )}
        </div>

        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.72rem',
          marginBottom: '0.4rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontWeight: 600,
        }}>
          Assessment Complete
        </p>

        <h2 className="results-title">
          {!result
            ? 'Assessment Finished'
            : parkinsonsDetected
              ? "Parkinson's Indicators Detected"
              : "No Parkinson's Indicators Detected"
          }
        </h2>

        {/* Main result card */}
        <div className="detection-result">
          {!result ? (
            <div className="result-card success">
              <h3>All Tasks Submitted</h3>
              <p>
                All speech tasks have been completed and submitted for analysis.
                Please contact your administrator for the full report.
              </p>
            </div>
          ) : parkinsonsDetected ? (
            <div className="result-card warning">
              <h3>Parkinson's Indicators Detected</h3>
              <p>
                Based on the speech analysis, potential indicators of Parkinson's
                disease were found. Please consult a medical professional for
                further evaluation.
              </p>
              {confidence && (
                <div className="confidence-bar-wrap">
                  <div className="confidence-label">
                    <span>Model Confidence</span>
                    <span>{confidence}%</span>
                  </div>
                  <div className="confidence-bar">
                    <div className="confidence-fill" style={{ width: `${confidence}%` }}/>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="result-card success">
              <h3>No Parkinson's Indicators Detected</h3>
              <p>
                Based on the speech analysis, no significant indicators of
                Parkinson's disease were detected at this time.
              </p>
              {confidence && (
                <div className="confidence-bar-wrap">
                  <div className="confidence-label">
                    <span>Model Confidence</span>
                    <span>{confidence}%</span>
                  </div>
                  <div className="confidence-bar">
                    <div className="confidence-fill" style={{ width: `${confidence}%` }}/>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Per-task breakdown */}
        {taskResults.length > 0 && (
          <div className="task-breakdown">
            <p className="breakdown-title">Task-by-Task Breakdown</p>
            <div className="summary-grid">
              {taskResults.map((t) => (
                <div
                  key={t.task_id}
                  className={`summary-item ${t.label === 1 ? 'item-warning' : 'item-success'}`}
                >
                  <span className="summary-task-name">{t.task_name}</span>
                  <span className={`summary-label ${t.label === 1 ? 'label-pd' : 'label-hc'}`}>
                    {t.label_text}
                  </span>
                </div>
              ))}
            </div>
            {result?.majority_vote && (
              <p className="majority-note">
                Votes — Parkinson's: {result.majority_vote.parkinsons_votes} / Healthy: {result.majority_vote.healthy_votes}
              </p>
            )}
          </div>
        )}

        {/* <p className="disclaimer">
          This screening tool is for informational purposes only and does not
          constitute medical advice. Please consult a healthcare professional for
          a proper diagnosis.
        </p> */}

        <div className="results-actions">
          <button className="action-button" onClick={onRestart}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
              <path d="M8 16H3v5"/>
            </svg>
            Start New Assessment
          </button>
        </div>

      </div>
    </div>
  )
}

export default ResultsScreen