// function UploadingScreen({ message }) {
//   return (
//     <div className="uploading-screen">
//       <div className="uploading-spinner">
//         <svg width="60" height="60" viewBox="0 0 60 60">
//           <circle
//             cx="30" cy="30" r="26"
//             fill="none"
//             stroke="var(--border)"
//             strokeWidth="4"
//           />
//           <circle
//             cx="30" cy="30" r="26"
//             fill="none"
//             stroke="var(--primary)"
//             strokeWidth="4"
//             strokeLinecap="round"
//             strokeDasharray="120"
//             strokeDashoffset="80"
//             style={{ animation: 'spin 1s linear infinite', transformOrigin: 'center' }}
//           />
//         </svg>
//       </div>
//       <h2 className="results-title">Analyzing Audio</h2>
//       <p className="disclaimer">{message}</p>
//       <p className="status-text">This may take a few seconds...</p>

//       <style>{`
//         @keyframes spin {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }
//         .uploading-screen {
//           text-align: center;
//           animation: fadeIn 0.4s ease;
//         }
//         .uploading-spinner {
//           margin: 0 auto 2rem;
//           width: 60px;
//           height: 60px;
//         }
//       `}</style>
//     </div>
//   )
// }

// export default UploadingScreen

function UploadingScreen({ message }) {
  return (
    <div className="uploading-screen">
      <div className="uploading-spinner-wrap">
        {/* Outer spinning ring */}
        <svg width="100" height="100" viewBox="0 0 100 100" style={{ animation: 'spin 1.4s linear infinite', transformOrigin: 'center' }}>
          <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(0,212,255,0.1)" strokeWidth="4"/>
          <circle cx="50" cy="50" r="44" fill="none" stroke="var(--teal)" strokeWidth="4"
            strokeLinecap="round" strokeDasharray="200" strokeDashoffset="150"/>
        </svg>

        {/* Inner counter-spin ring */}
        <svg width="100" height="100" viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, animation: 'spin 2.2s linear infinite reverse', transformOrigin: 'center' }}>
          <circle cx="50" cy="50" r="32" fill="none" stroke="rgba(124,58,237,0.15)" strokeWidth="3"/>
          <circle cx="50" cy="50" r="32" fill="none" stroke="rgba(124,58,237,0.6)" strokeWidth="3"
            strokeLinecap="round" strokeDasharray="100" strokeDashoffset="75"/>
        </svg>

        {/* Brain icon centre */}
        <div className="brain-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.98-3 2.5 2.5 0 0 1-1.32-4.24A2.5 2.5 0 0 1 5.5 7a2.5 2.5 0 0 1 4-2Z"/>
            <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.98-3 2.5 2.5 0 0 0 1.32-4.24A2.5 2.5 0 0 0 18.5 7a2.5 2.5 0 0 0-4-2Z"/>
          </svg>
        </div>
      </div>

      <h2 className="uploading-title">Analysing Audio</h2>
      <p className="uploading-message">{message || 'Processing your speech recording with AI...'}</p>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>This may take a few seconds</p>

      <div className="uploading-dots">
        <span/><span/><span/>
      </div>
    </div>
  )
}

export default UploadingScreen