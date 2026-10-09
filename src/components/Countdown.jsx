import { useState, useEffect } from 'react'

function Countdown({ onComplete }) {
  const [count, setCount] = useState(3)

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => {
        setCount(count - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      onComplete()
    }
  }, [count, onComplete])

  return (
    <div className="countdown-overlay">
      <span key={count} className="countdown-number">
        {count > 0 ? count : 'Go!'}
      </span>
    </div>
  )
}

export default Countdown
