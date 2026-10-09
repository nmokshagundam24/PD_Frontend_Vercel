// function LanguageSelect({ onSelect }) {
//   return (
//     <div className="language-select-screen">
//       <h2 className="language-title">Select Language / భాషను ఎంచుకోండి</h2>
//       <p className="language-description">
//         Choose the language for your assessment tasks
//       </p>
      
//       <div className="language-options">
//         <button 
//           className="language-option"
//           onClick={() => onSelect('english')}
//         >
//           <span className="language-name">English</span>
//           <span className="language-native">English</span>
//         </button>
        
//         <button 
//           className="language-option"
//           onClick={() => onSelect('telugu')}
//         >
//           <span className="language-name">Telugu</span>
//           <span className="language-native">తెలుగు</span>
//         </button>
//       </div>
//     </div>
//   )
// }

// export default LanguageSelect

function LanguageSelect({ onSelect }) {
  return (
    <div className="language-select-screen">
      <div className="welcome-icon" style={{ width: 80, height: 80, marginBottom: '1.5rem' }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      </div>

      <h2 className="language-title">Select Language</h2>
      <p className="language-description">
        Choose the language for your assessment tasks<br />
        <span style={{ color: 'var(--teal)', fontSize: '0.9rem' }}>భాషను ఎంచుకోండి</span>
      </p>

      <div className="language-options">
        <button className="language-option" onClick={() => onSelect('english')}>
          {/* <span style={{ fontSize: '2rem' }}>🇬🇧</span> */}
          <span className="language-name">English</span>
          <span className="language-native">English</span>
        </button>

        <button className="language-option" onClick={() => onSelect('telugu')}>
          {/* <span style={{ fontSize: '2rem' }}>🇮🇳</span> */}
          <span className="language-name">Telugu</span>
          <span className="language-native">తెలుగు</span>
        </button>
      </div>
    </div>
  )
}

export default LanguageSelect