// function TaskResultScreen({ taskResult, taskNumber, totalTasks, onContinue, language }) {
//   const isLastTask = taskNumber === totalTasks
//   const detected = taskResult?.label === 1
//   const confidence = taskResult?.confidence
//     ? (taskResult.confidence * 100).toFixed(1)
//     : null

//   return (
//     <div className="results-screen">
//       <div className={`results-icon ${detected ? 'warning' : 'success'}`}>
//         {detected ? (
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

//       <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
//         Task {taskNumber} of {totalTasks} — {taskResult?.task_name || 'Result'}
//       </p>

//       <h2 className="results-title">
//         {language === 'telugu'
//           ? (detected ? 'పార్కిన్సన్ సంకేతాలు గుర్తించబడ్డాయి' : 'పార్కిన్సన్ సంకేతాలు లేవు')
//           : (detected ? "Parkinson's Indicators Detected" : "No Parkinson's Indicators Detected")
//         }
//       </h2>

//       <div className="detection-result">
//         {detected ? (
//           <div className="result-card warning">
//             <h3>{taskResult?.label_text || "Parkinson's Detected"}</h3>
//             <p>
//               {language === 'telugu'
//                 ? 'ఈ టాస్క్ ఆడియోలో పార్కిన్సన్ వ్యాధి యొక్క సంభావ్య సంకేతాలు గుర్తించబడ్డాయి.'
//                 : 'Potential Parkinson\'s indicators were detected in this task\'s speech audio.'
//               }
//             </p>
//             {confidence && (
//               <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', opacity: 0.8 }}>
//                 {language === 'telugu' ? 'నమ్మకం:' : 'Confidence:'} {confidence}%
//               </p>
//             )}
//           </div>
//         ) : (
//           <div className="result-card success">
//             <h3>{taskResult?.label_text || 'Healthy / No Indicators'}</h3>
//             <p>
//               {language === 'telugu'
//                 ? 'ఈ టాస్క్ ఆడియోలో పార్కిన్సన్ వ్యాధి యొక్క ముఖ్యమైన సంకేతాలు ఏవీ గుర్తించబడలేదు.'
//                 : 'No significant Parkinson\'s indicators were detected in this task\'s speech audio.'
//               }
//             </p>
//             {confidence && (
//               <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', opacity: 0.8 }}>
//                 {language === 'telugu' ? 'నమ్మకం:' : 'Confidence:'} {confidence}%
//               </p>
//             )}
//           </div>
//         )}
//       </div>

//       <div className="results-actions">
//         <button className="action-button" onClick={onContinue}>
//           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <path d="M5 12h14" />
//             <path d="m12 5 7 7-7 7" />
//           </svg>
//           {isLastTask
//             ? (language === 'telugu' ? 'తుది ఫలితాలు చూడండి' : 'View Final Results')
//             : (language === 'telugu' ? 'తదుపరి టాస్క్‌కు వెళ్ళండి' : 'Continue to Next Task')
//           }
//         </button>
//       </div>
//     </div>
//   )
// }

// export default TaskResultScreen

function TaskResultScreen({ taskResult, taskNumber, totalTasks, onContinue, language }) {
  const isLastTask = taskNumber === totalTasks
  const detected   = taskResult?.label === 1
  const confidence = taskResult?.confidence ? (taskResult.confidence * 100).toFixed(1) : null

  return (
    <div className="results-screen">
      <div className="results-screen-card">

        {/* Status icon */}
        <div className={`results-icon ${detected ? 'warning' : 'success'}`}>
          {detected ? (
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

        {/* Task label */}
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.72rem',
          marginBottom: '0.4rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontWeight: 600,
        }}>
          Task {taskNumber} of {totalTasks} — {taskResult?.task_name || 'Result'}
        </p>

        <h2 className="results-title">
          {language === 'telugu'
            ? (detected ? 'పార్కిన్సన్ సంకేతాలు గుర్తించబడ్డాయి' : 'పార్కిన్సన్ సంకేతాలు లేవు')
            : (detected ? "Parkinson's Indicators Detected" : "No Parkinson's Indicators Detected")
          }
        </h2>

        {/* Result card */}
        <div className="detection-result">
          <div className={`result-card ${detected ? 'warning' : 'success'}`}>
            <h3>{taskResult?.label_text || (detected ? "Parkinson's Detected" : 'Healthy / No Indicators')}</h3>
            <p>
              {detected
                ? (language === 'telugu'
                    ? 'ఈ టాస్క్ ఆడియోలో పార్కిన్సన్ వ్యాధి యొక్క సంభావ్య సంకేతాలు గుర్తించబడ్డాయి.'
                    : "Potential Parkinson's indicators were detected in this task's speech audio.")
                : (language === 'telugu'
                    ? 'ఈ టాస్క్ ఆడియోలో పార్కిన్సన్ వ్యాధి యొక్క ముఖ్యమైన సంకేతాలు ఏవీ గుర్తించబడలేదు.'
                    : "No significant Parkinson's indicators were detected in this task's speech audio.")
              }
            </p>

          </div>
        </div>

        {/* Continue button */}
        <div className="results-actions">
          <button className="action-button" onClick={onContinue}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/>
              <path d="m12 5 7 7-7 7"/>
            </svg>
            {isLastTask
              ? (language === 'telugu' ? 'తుది ఫలితాలు చూడండి' : 'View Final Results')
              : (language === 'telugu' ? 'తదుపరి టాస్క్‌కు వెళ్ళండి' : 'Continue to Next Task')
            }
          </button>
        </div>

      </div>
    </div>
  )
}

export default TaskResultScreen