function ProgressIndicator({ currentStage, totalStages, percentage }) {
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="progress-indicator">
      <svg width="90" height="90" className="progress-ring">
        <circle
          className="progress-ring-bg"
          cx="45"
          cy="45"
          r={radius}
        />
        <circle
          className="progress-ring-fill"
          cx="45"
          cy="45"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <div className="progress-text">
        <div className="progress-stage">{currentStage}/{totalStages}</div>
        <div className="progress-label">Tasks</div>
      </div>
    </div>
  )
}

export default ProgressIndicator
