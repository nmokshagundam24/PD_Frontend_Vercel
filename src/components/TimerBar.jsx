function TimerBar({ elapsed, total }) {
  const percentage = Math.min((elapsed / total) * 100, 100)
  const remainingSeconds = Math.max(Math.ceil((total - elapsed) / 1000), 0)

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="timer-bar-container">
      <div className="timer-label">
        <span>Recording</span>
        <span>{formatTime(remainingSeconds)} remaining</span>
      </div>
      <div className="timer-bar">
        <div 
          className="timer-fill" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default TimerBar
