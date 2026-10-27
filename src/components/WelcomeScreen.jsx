// // function WelcomeScreen({ onStart }) {
// //   return (
// //     <div className="welcome-screen">
// //       <div className="welcome-icon">
// //         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
// //           <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
// //           <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
// //           <line x1="12" x2="12" y1="19" y2="22" />
// //         </svg>
// //       </div>

// //       <h1 className="welcome-title">Speech Screening Assessment</h1>

// //       <p className="welcome-description">
// //         Complete a series of speech tasks to help screen for potential voice and speech patterns. 
// //         This assessment takes approximately 5-7 minutes and requires microphone access.
// //       </p>

// //       <div className="welcome-features">
// //         <div className="feature-item">
// //           <div className="feature-number">6</div>
// //           <div className="feature-label">Speech Tasks</div>
// //         </div>
// //         <div className="feature-item">
// //           <div className="feature-number">5-7</div>
// //           <div className="feature-label">Minutes Total</div>
// //         </div>
// //         <div className="feature-item">
// //           <div className="feature-number">100%</div>
// //           <div className="feature-label">Private & Secure</div>
// //         </div>
// //       </div>

// //       <button className="start-button" onClick={onStart}>
// //         Begin Assessment
// //       </button>
// //     </div>
// //   )
// // }

// // export default WelcomeScreen
// function WelcomeScreen({ onStart }) {
//   return (
//     <div className="welcome-screen">

//       {/* Brain / neural wave icon */}
//       <div className="welcome-icon">
//         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//           <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.98-3 2.5 2.5 0 0 1-1.32-4.24A2.5 2.5 0 0 1 5.5 7a2.5 2.5 0 0 1 4-2Z" />
//           <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.98-3 2.5 2.5 0 0 0 1.32-4.24A2.5 2.5 0 0 0 18.5 7a2.5 2.5 0 0 0-4-2Z" />
//         </svg>
//       </div>

//       <div className="welcome-badge">AI-Powered Screening</div>

//       <h1 className="welcome-title">Parkinson's Speech<br />Screening Tool</h1>

//       <p className="welcome-description">
//         Early detection matters. This assessment analyses your voice and speech patterns 
//         to help screen for early indicators associated with Parkinson's disease. 
//         It takes just 5–7 minutes and requires microphone access.
//       </p>

//       <div className="welcome-features">
//         <div className="feature-item">
//           <div className="feature-icon">🎙️</div>
//           <div className="feature-number">6</div>
//           <div className="feature-label">Speech Tasks</div>
//         </div>
//         <div className="feature-item">
//           <div className="feature-icon">⏱️</div>
//           <div className="feature-number">5–7</div>
//           <div className="feature-label">Minutes Total</div>
//         </div>
//         <div className="feature-item">
//           <div className="feature-icon">🔒</div>
//           <div className="feature-number">100%</div>
//           <div className="feature-label">Private & Secure</div>
//         </div>
//       </div>


//       <button className="start-button" onClick={onStart}>
//         Begin Assessment →
//       </button>
//     </div>
//   )
// }

// export default WelcomeScreen

function WelcomeScreen({ onStart, error }) {
  return (
    <div className="welcome-screen">
      <div className="welcome-badge">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
          <circle cx="5" cy="5" r="5" />
        </svg>
        AI-Powered Screening
      </div>

      <div className="welcome-icon">
        {/* Brain SVG */}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.98-3 2.5 2.5 0 0 1-1.32-4.24A2.5 2.5 0 0 1 5.5 7a2.5 2.5 0 0 1 4-2Z" />
          <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.98-3 2.5 2.5 0 0 0 1.32-4.24A2.5 2.5 0 0 0 18.5 7a2.5 2.5 0 0 0-4-2Z" />
        </svg>
      </div>

      <h1 className="welcome-title">
        Parkinson's Speech<br />Screening Tool
      </h1>

      <p className="welcome-description">
        Early detection matters. This assessment uses AI to analyse your voice
        and speech patterns for indicators associated with Parkinson's disease.
        Takes just 5–7 minutes and requires microphone access.
      </p>

      <div className="welcome-features">
        <div className="feature-item">
          <div className="feature-icon">🎙️</div>
          <div className="feature-number">6</div>
          <div className="feature-label">Speech Tasks</div>
        </div>
        <div className="feature-item">
          <div className="feature-icon">⏱️</div>
          <div className="feature-number">5–7</div>
          <div className="feature-label">Minutes Total</div>
        </div>
        <div className="feature-item">
          <div className="feature-icon">🔒</div>
          <div className="feature-number">100%</div>
          <div className="feature-label">Private & Secure</div>
        </div>
      </div>

      {error && (
        <div style={{
          marginBottom: '1.5rem',
          padding: '0.75rem 1.25rem',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 'var(--radius, 12px)',
          fontSize: '0.82rem',
          color: '#ef4444',
          lineHeight: '1.4',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      <button className="start-button" onClick={onStart}>
        Begin Assessment →
      </button>

      {/* Session & Tab Disclaimer */}
      <div className="welcome-disclaimer" style={{
        marginTop: '2rem',
        padding: '0.85rem 1.25rem',
        background: 'rgba(0, 212, 255, 0.04)',
        border: '1px solid rgba(0, 212, 255, 0.15)',
        borderRadius: 'var(--radius, 12px)',
        fontSize: '0.78rem',
        lineHeight: '1.5',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.4rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <strong style={{ color: '#0f172a', fontWeight: '700', fontSize: '0.82rem' }}>
            Note on Tab & Session Refresh
          </strong>
        </div>
        <p style={{ color: '#334155', textAlign: 'center', margin: 0 }}>
          If you accidentally refresh this tab during the assessment, your progress will safely resume without data loss. However, completely closing the tab or browser window will clear your session to protect your privacy and start fresh.
        </p>
      </div>
    </div>
  )
}

export default WelcomeScreen