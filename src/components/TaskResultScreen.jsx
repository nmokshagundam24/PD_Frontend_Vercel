const TELUGU_TASK_TITLES = {
  vowels: 'అచ్చుల ఉచ్చారణ',
  numbers: 'సంఖ్యల క్రమం',
  ddk: 'అక్షర నమూనాలు',
  words: 'పదాల పఠనం',
  sentences: 'పేరా పఠనం',
  spontaneous: 'స్వచ్ఛంద ప్రసంగం',
}

function TaskResultScreen({ taskResult, taskNumber, totalTasks, onContinue, onRetryTask, onRetakeAssessment, language }) {
  const isLastTask = taskNumber === totalTasks
  const detected   = taskResult?.label === 1
  const confidence = taskResult?.confidence ? (taskResult.confidence * 100).toFixed(1) : null

  return (
    <div className="results-screen">
      <div className="results-screen-card" style={{ textAlign: 'center' }}>

        {/* Status icon */}
        <div className={`results-icon ${detected ? 'warning' : 'success'}`}>
          {detected ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12"/>
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
          textAlign: 'center',
        }}>
          {language === 'telugu'
            ? `టాస్క్ ${taskNumber} / ${totalTasks} — ${TELUGU_TASK_TITLES[taskResult?.task_name?.toLowerCase()] || taskResult?.task_name || 'ఫలితం'}`
            : `Task ${taskNumber} of ${totalTasks} — ${taskResult?.task_name || 'Result'}`}
        </p>

        <h2 className="results-title" style={{ textAlign: 'center' }}>
          {language === 'telugu'
            ? (detected ? 'పార్కిన్సన్ సంకేతాలు గుర్తించబడ్డాయి' : 'పార్కిన్సన్ సంకేతాలు లేవు')
            : (detected ? "Parkinson's Indicators Detected" : "No Parkinson's Indicators Detected")
          }
        </h2>

        {/* Result card */}
        <div className="detection-result">
          <div className={`result-card ${detected ? 'warning' : 'success'}`} style={{ textAlign: 'center' }}>
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

        {/* Action buttons */}
        <div className="results-actions" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
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

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {onRetryTask && (
              <button className="action-button secondary" onClick={onRetryTask} title={language === 'telugu' ? 'ఈ టాస్క్ మళ్లీ చేయండి' : 'Retry only this task'}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 4v6h6" />
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
                {language === 'telugu' ? 'టాస్క్ మళ్లీ చేయండి' : 'Retry Task'}
              </button>
            )}

            {onRetakeAssessment && (
              <button className="action-button secondary" onClick={onRetakeAssessment} style={{ opacity: 0.85 }} title={language === 'telugu' ? 'మొదటి నుండి కొత్త మూల్యాంకనాన్ని ప్రారంభించండి' : 'Start a brand new assessment'}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M8 16H3v5" />
                </svg>
                {language === 'telugu' ? 'కొత్త మూల్యాంకనం' : 'Retake Assessment'}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default TaskResultScreen