```jsx
function ResultsScreen({ result, language, onRestart }) {
  const isTelugu = language === 'telugu'

  const parkinsonsDetected = result?.final_label === 1
  const taskResults = result?.task_results || []
  const confidence = result?.final_confidence != null
    ? (result.final_confidence * 100).toFixed(1)
    : null

  // Text displayed according to the selected language
  const text = isTelugu
    ? {
        assessmentComplete: 'మూల్యాంకనం పూర్తయింది',
        assessmentFinished: 'మూల్యాంకనం ముగిసింది',
        detected: 'పార్కిన్సన్స్ వ్యాధి సూచనలు గుర్తించబడ్డాయి',
        notDetected: 'పార్కిన్సన్స్ వ్యాధి సూచనలు గుర్తించబడలేదు',
        allTasksSubmitted: 'అన్ని పనులు సమర్పించబడ్డాయి',
        tasksSubmittedMessage:
          'మాటకు సంబంధించిన అన్ని పనులు పూర్తయ్యాయి మరియు విశ్లేషణ కోసం సమర్పించబడ్డాయి. పూర్తి నివేదిక కోసం దయచేసి నిర్వాహకుడిని సంప్రదించండి.',
        detectedMessage:
          'మాట విశ్లేషణ ఆధారంగా పార్కిన్సన్స్ వ్యాధికి సంబంధించిన కొన్ని సూచనలు గుర్తించబడ్డాయి. తదుపరి వైద్య పరీక్షల కోసం దయచేసి వైద్య నిపుణుడిని సంప్రదించండి.',
        notDetectedMessage:
          'మాట విశ్లేషణ ఆధారంగా ప్రస్తుతం పార్కిన్సన్స్ వ్యాధికి సంబంధించిన ముఖ్యమైన సూచనలు గుర్తించబడలేదు.',
        confidence: 'మోడల్ అంచనా విశ్వసనీయత',
        taskBreakdown: 'ప్రతి పనికి సంబంధించిన ఫలితాలు',
        votes: 'ఓట్లు',
        parkinsonsVotes: 'పార్కిన్సన్స్',
        healthyVotes: 'ఆరోగ్యంగా ఉన్నవారు',
        startNewAssessment: 'కొత్త మూల్యాంకనాన్ని ప్రారంభించండి',
        taskDetected: 'సూచనలు గుర్తించబడ్డాయి',
        taskNotDetected: 'సూచనలు గుర్తించబడలేదు',
        taskNames: {
          vowels: 'అచ్చుల ఉచ్చారణ',
          numbers: 'సంఖ్యల క్రమం',
          ddk: 'అక్షర నమూనాలు',
          words: 'పదాల పఠనం',
          sentences: 'పేరా పఠనం',
          spontaneous: 'స్వచ్ఛంద ప్రసంగం',
        },
      }
    : {
        assessmentComplete: 'Assessment Complete',
        assessmentFinished: 'Assessment Finished',
        detected: "Parkinson's Indicators Detected",
        notDetected: "No Parkinson's Indicators Detected",
        allTasksSubmitted: 'All Tasks Submitted',
        tasksSubmittedMessage:
          'All speech tasks have been completed and submitted for analysis. Please contact your administrator for the full report.',
        detectedMessage:
          "Based on the speech analysis, potential indicators of Parkinson's disease were found. Please consult a medical professional for further evaluation.",
        notDetectedMessage:
          "Based on the speech analysis, no significant indicators of Parkinson's disease were detected at this time.",
        confidence: 'Model Confidence',
        taskBreakdown: 'Task-by-Task Breakdown',
        votes: 'Votes',
        parkinsonsVotes: "Parkinson's",
        healthyVotes: 'Healthy',
        startNewAssessment: 'Start New Assessment',
        taskDetected: 'Indicators Detected',
        taskNotDetected: 'No Indicators Detected',
        taskNames: {},
      }

  return (
    <div className="results-screen">
      <div className="results-screen-card">

        {/* Hero icon */}
        <div
          className={`results-icon ${
            parkinsonsDetected ? 'warning' : 'success'
          }`}
        >
          {parkinsonsDetected ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          )}
        </div>

        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.72rem',
            marginBottom: '0.4rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontWeight: 600,
          }}
        >
          {text.assessmentComplete}
        </p>

        <h2 className="results-title">
          {!result
            ? text.assessmentFinished
            : parkinsonsDetected
              ? text.detected
              : text.notDetected}
        </h2>

        {/* Main result card */}
        <div className="detection-result">
          {!result ? (
            <div className="result-card success">
              <h3>{text.allTasksSubmitted}</h3>
              <p>{text.tasksSubmittedMessage}</p>
            </div>
          ) : parkinsonsDetected ? (
            <div className="result-card warning">
              <h3>{text.detected}</h3>
              <p>{text.detectedMessage}</p>

              {confidence !== null && (
                <div className="confidence-bar-wrap">
                  <div className="confidence-label">
                    <span>{text.confidence}</span>
                    <span>{confidence}%</span>
                  </div>
                  <div className="confidence-bar">
                    <div
                      className="confidence-fill"
                      style={{ width: `${confidence}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="result-card success">
              <h3>{text.notDetected}</h3>
              <p>{text.notDetectedMessage}</p>

              {confidence !== null && (
                <div className="confidence-bar-wrap">
                  <div className="confidence-label">
                    <span>{text.confidence}</span>
                    <span>{confidence}%</span>
                  </div>
                  <div className="confidence-bar">
                    <div
                      className="confidence-fill"
                      style={{ width: `${confidence}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Per-task breakdown */}
        {taskResults.length > 0 && (
          <div className="task-breakdown">
            <p className="breakdown-title">
              {text.taskBreakdown}
            </p>

            <div className="summary-grid">
              {taskResults.map((t) => (
                <div
                  key={t.task_id}
                  className={`summary-item ${
                    t.label === 1 ? 'item-warning' : 'item-success'
                  }`}
                >
                  <span className="summary-task-name">
                    {text.taskNames[t.task_id] || t.task_name}
                  </span>

                  <span
                    className={`summary-label ${
                      t.label === 1 ? 'label-pd' : 'label-hc'
                    }`}
                  >
                    {isTelugu
                      ? (t.label === 1
                          ? text.taskDetected
                          : text.taskNotDetected)
                      : t.label_text}
                  </span>
                </div>
              ))}
            </div>

            {result?.majority_vote && (
              <p className="majority-note">
                {text.votes} — {text.parkinsonsVotes}:{' '}
                {result.majority_vote.parkinsons_votes} /{' '}
                {text.healthyVotes}:{' '}
                {result.majority_vote.healthy_votes}
              </p>
            )}
          </div>
        )}

        {/* Original disclaimer remains commented out.
        <p className="disclaimer">
          This screening tool is for informational purposes only and does not
          constitute medical advice. Please consult a healthcare professional for
          a proper diagnosis.
        </p>
        */}

        <div className="results-actions">
          <button className="action-button" onClick={onRestart}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M8 16H3v5" />
            </svg>
            {text.startNewAssessment}
          </button>
        </div>

      </div>
    </div>
  )
}

export default ResultsScreen
```
