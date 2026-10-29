import { useState, useEffect, useRef, useCallback } from 'react'
import Microphone from './Microphone'
import Countdown from './Countdown'
import TimerBar from './TimerBar'

function TaskScreen({
  task,
  onComplete,
  taskNumber,
  totalTasks,
  language,
  initialPromptIndex = 0,
  onPromptChange,
  onRetryTask,
  onRetakeAssessment,
  isRetry = false,
}) {
  const [phase, setPhase] = useState('idle') // idle, countdown, recording, complete
  const [currentItemIndex, setCurrentItemIndex] = useState(() => initialPromptIndex || 0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [showGap, setShowGap] = useState(false)
  const [uploadedFileName, setUploadedFileName] = useState(null)

  const mediaRecorderRef = useRef(null)
  const mediaStreamRef = useRef(null)
  const audioChunksRef = useRef([])
  const timerRef = useRef(null)
  const itemTimerRef = useRef(null)
  const gapTimerRef = useRef(null)
  const fileInputRef = useRef(null)
  const isAbortedRef = useRef(false)
  const isSubmittingRef = useRef(false)

  const isManualTask = task.type === 'manual'

  const totalDuration = isManualTask
    ? null
    : task.type === 'timed'
      ? task.duration
      : task.type === 'sequential-repeat'
        ? task.duration
        : task.items
          ? task.items.length * (task.itemDuration + (task.transitionGap || 0))
          : 0

  const clearAllTimers = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    if (itemTimerRef.current) {
      clearTimeout(itemTimerRef.current)
      itemTimerRef.current = null
    }
    if (gapTimerRef.current) {
      clearTimeout(gapTimerRef.current)
      gapTimerRef.current = null
    }
  }, [])

  const cleanupAudioStream = useCallback(() => {
    isAbortedRef.current = true
    clearAllTimers()

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop()
      } catch (err) {
        console.warn('[TaskScreen] Error stopping recorder on cleanup:', err)
      }
    }

    if (mediaStreamRef.current) {
      try {
        mediaStreamRef.current.getTracks().forEach(track => track.stop())
      } catch (err) {
        console.warn('[TaskScreen] Error stopping stream tracks:', err)
      }
      mediaStreamRef.current = null
    }

    audioChunksRef.current = []
  }, [clearAllTimers])

  // Normal completion of recording
  const stopRecording = useCallback(() => {
    isAbortedRef.current = false
    clearAllTimers()

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    setPhase('complete')
  }, [clearAllTimers])

  // Retake current recording: discards in-progress audio, resets timer, returns to idle on this task
  const handleRetakeRecording = useCallback(() => {
    cleanupAudioStream()
    setElapsedTime(0)
    setShowGap(false)
    setUploadedFileName(null)
    setPhase('idle')
    if (onRetryTask) onRetryTask()
  }, [cleanupAudioStream, onRetryTask])

  // Retry entire current task from beginning
  const handleRetryTaskClick = useCallback(() => {
    cleanupAudioStream()
    setCurrentItemIndex(0)
    setElapsedTime(0)
    setShowGap(false)
    setUploadedFileName(null)
    setPhase('idle')
    if (onPromptChange) onPromptChange(0)
    if (onRetryTask) onRetryTask()
  }, [cleanupAudioStream, onPromptChange, onRetryTask])

  // Retake assessment: clear and return to homepage/start
  const handleRetakeAssessmentClick = useCallback(() => {
    cleanupAudioStream()
    if (onRetakeAssessment) onRetakeAssessment()
  }, [cleanupAudioStream, onRetakeAssessment])

  const runSequentialItems = useCallback(() => {
    let itemIndex = 0
    setCurrentItemIndex(0)
    setShowGap(false)
    if (onPromptChange) onPromptChange(0)

    // sequential-repeat: DDK / Syllable task
    if (task.type === 'sequential-repeat') {
      const advanceWord = () => {
        if (itemIndex >= task.items.length) {
          stopRecording()
          return
        }

        setCurrentItemIndex(itemIndex)
        if (onPromptChange) onPromptChange(itemIndex)
        let repeatsDone = 0

        const showRepeat = () => {
          if (repeatsDone >= task.repeatCount) {
            setShowGap(true)
            gapTimerRef.current = setTimeout(() => {
              setShowGap(false)
              itemIndex++
              advanceWord()
            }, task.transitionGap || 2000)
            return
          }

          setShowGap(false)
          repeatsDone++

          itemTimerRef.current = setTimeout(() => {
            setCurrentItemIndex(-1)
            gapTimerRef.current = setTimeout(() => {
              setCurrentItemIndex(itemIndex)
              showRepeat()
            }, 300)
          }, task.itemDuration || 1000)
        }

        showRepeat()
      }

      advanceWord()
      return
    }

    // sequential-single / sequential-single-with-gap
    const advanceItem = () => {
      if (itemIndex < task.items.length) {
        setCurrentItemIndex(itemIndex)
        if (onPromptChange) onPromptChange(itemIndex)
        setShowGap(false)

        itemTimerRef.current = setTimeout(() => {
          itemIndex++
          if (itemIndex < task.items.length) {
            if (task.type === 'sequential-single-with-gap' && task.transitionGap > 0) {
              setShowGap(true)
              gapTimerRef.current = setTimeout(() => {
                setShowGap(false)
                advanceItem()
              }, task.transitionGap)
            } else if (task.transitionGap > 0) {
              gapTimerRef.current = setTimeout(() => advanceItem(), task.transitionGap)
            } else {
              advanceItem()
            }
          }
        }, task.itemDuration)
      }
    }

    advanceItem()
  }, [task, stopRecording, onPromptChange])

  const startRecording = useCallback(async () => {
    try {
      isAbortedRef.current = false
      isSubmittingRef.current = false
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStreamRef.current = stream

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach(track => track.stop())
          mediaStreamRef.current = null
        }

        // If stopped because of abort/refresh/retake, discard audio and NEVER submit
        if (isAbortedRef.current) {
          audioChunksRef.current = []
          return
        }

        // Prevent duplicate submissions
        if (isSubmittingRef.current) return
        isSubmittingRef.current = true

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        audioChunksRef.current = []
        onComplete(task.id, audioBlob, isRetry)
      }

      mediaRecorder.start()
      setPhase('recording')
      setElapsedTime(0)

      if (!isManualTask) {
        const startTime = Date.now()
        timerRef.current = setInterval(() => {
          const elapsed = Date.now() - startTime
          setElapsedTime(elapsed)
          if (totalDuration && elapsed >= totalDuration) {
            stopRecording()
          }
        }, 100)

        if (
          task.type === 'sequential' ||
          task.type === 'sequential-single' ||
          task.type === 'sequential-single-with-gap' ||
          task.type === 'sequential-repeat'
        ) {
          runSequentialItems()
        }
      }
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Unable to access microphone. Please ensure microphone permissions are granted.')
      setPhase('idle')
    }
  }, [task, totalDuration, onComplete, isManualTask, stopRecording, runSequentialItems, isRetry])

  const handleStart = () => setPhase('countdown')
  const handleCountdownComplete = () => startRecording()
  const handleManualStop = () => stopRecording()

  const handleAudioFileUpload = useCallback((event) => {
    const file = event.target.files?.[0]
    if (file) {
      if (isSubmittingRef.current) return
      isSubmittingRef.current = true

      const reader = new FileReader()
      reader.onload = () => {
        const blob = new Blob([reader.result], { type: file.type })
        setUploadedFileName(file.name)
        setPhase('complete')
        onComplete(task.id, blob, isRetry)
      }
      reader.readAsArrayBuffer(file)
    }
  }, [task.id, onComplete, isRetry])

  const triggerFileUpload = () => fileInputRef.current?.click()

  // Lifecycle cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupAudioStream()
    }
  }, [cleanupAudioStream])

  return (
    <div className="task-screen">
      {phase === 'countdown' && (
        <Countdown onComplete={handleCountdownComplete} />
      )}

      <div className="task-header" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span className="task-badge">
          {language === 'telugu' ? `టాస్క్ ${taskNumber} / ${totalTasks}` : `Task ${taskNumber} of ${totalTasks}`}
        </span>
        <h2 className="task-title" style={{ textAlign: 'center' }}>{task.title}</h2>
        <p className="task-instructions" style={{ textAlign: 'center', margin: '0 auto', maxWidth: '520px' }}>{task.instructions}</p>
      </div>

      {phase === 'recording' && !isManualTask && totalDuration && (
        <TimerBar elapsed={elapsedTime} total={totalDuration} />
      )}

      {phase === 'recording' && task.type === 'sequential-repeat' && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          marginBottom: '1rem',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: 'var(--teal)',
        }}>
          <span style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: 'var(--teal)',
            display: 'inline-block',
            animation: 'blinkText 1s ease-in-out infinite',
          }}/>
          {language === 'telugu' ? 'రికార్డింగ్ జరుగుతోంది...' : 'Recording in progress...'}
        </div>
      )}

      <div className="display-area">
        {(
          task.type === 'sequential-single' ||
          task.type === 'sequential-single-with-gap' ||
          task.type === 'sequential-repeat'
        ) ? (
          <div className="single-word-display">
            {phase === 'recording' && !showGap && task.items[currentItemIndex] && (
              <span className={`current-word ${
                task.items[currentItemIndex].length > 12
                  ? 'word-long'
                  : task.items[currentItemIndex].length > 7
                  ? 'word-medium'
                  : ''
              }`}>
                {task.items[currentItemIndex]}
              </span>
            )}
            {phase === 'recording' && showGap && (
              <div className="gap-indicator">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stop-icon">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="8" x2="16" y1="12" y2="12" />
                </svg>
                <span className="gap-text">{language === 'telugu' ? 'ఆపండి' : 'Stop'}</span>
              </div>
            )}
            {phase === 'idle' && (
              <span className="word-preview">
                {language === 'telugu'
                  ? 'పదాలు ఇక్కడ ఒక్కొక్కటిగా కనిపిస్తాయి'
                  : 'Words will appear here one at a time'}
              </span>
            )}
          </div>
        ) : task.type === 'sequential' ? (
          <div className="display-items">
            {task.items.map((item, index) => (
              <span
                key={index}
                className={`display-item ${
                  phase === 'recording' && index === currentItemIndex ? 'active' : ''
                } ${index < currentItemIndex ? 'completed' : ''}`}
              >
                {item}
              </span>
            ))}
          </div>
        ) : (task.type === 'manual' || task.type === 'timed') ? (
          <div className="single-display" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {task.prompt ? (
              <p className="prompt-text" style={{ textAlign: 'center', whiteSpace: 'pre-line', margin: '0 auto' }}>{task.prompt}</p>
            ) : task.displayText ? (
              <p style={{ textAlign: 'center', margin: '0 auto' }}>{task.displayText}</p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="mic-upload-container">
        <Microphone
          isRecording={phase === 'recording'}
          isDisabled={phase === 'countdown' || phase === 'complete' || phase === 'idle'}
          onClick={isManualTask && phase === 'recording' ? handleManualStop : undefined}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleAudioFileUpload}
          style={{ display: 'none' }}
        />

        <button
          className="upload-button"
          onClick={triggerFileUpload}
          disabled={phase === 'recording' || phase === 'countdown' || phase === 'complete'}
          title={language === 'telugu' ? 'ఆడియో ఫైలు అప్లోడ్ చేయండి' : 'Upload audio file'}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
          </svg>
        </button>
      </div>

      {uploadedFileName && (
        <p className="uploaded-file-name">
          {language === 'telugu' ? '✓ ఫైలు అప్లోడ్ చేయబడింది:' : '✓ File uploaded:'} {uploadedFileName}
        </p>
      )}

      {/* Primary Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginTop: '1rem' }}>
        {phase === 'idle' && (
          <button className="action-button" onClick={handleStart}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            {language === 'telugu' ? 'టాస్క్ ప్రారంభించండి' : 'Start Task'}
          </button>
        )}

        {phase === 'recording' && isManualTask && (
          <button className="action-button stop-button" onClick={handleManualStop}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
            {language === 'telugu' ? 'రికార్డింగ్ ఆపండి' : 'Stop Recording'}
          </button>
        )}

        {/* Secondary Actions: Retake Recording, Retry Task, Retake Assessment */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {phase === 'recording' && (
            <button
              className="action-button secondary"
              onClick={handleRetakeRecording}
              title={language === 'telugu' ? 'ప్రస్తుత రికార్డింగ్ రద్దు చేసి మళ్లీ ప్రయత్నించండి' : 'Discard current recording and try again'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 4v6h6" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
              {language === 'telugu' ? 'మళ్లీ రికార్డ్ చేయండి' : 'Retake Recording'}
            </button>
          )}

          <button
            className="action-button secondary"
            onClick={handleRetryTaskClick}
            disabled={phase === 'countdown'}
            title={language === 'telugu' ? 'ఈ టాస్క్ మొదటి నుండి చేయండి' : 'Restart this task from the beginning'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 4v6h6" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
            {language === 'telugu' ? 'టాస్క్ మళ్లీ చేయండి' : 'Retry Task'}
          </button>

          <button
            className="action-button secondary"
            onClick={handleRetakeAssessmentClick}
            disabled={phase === 'countdown'}
            style={{ opacity: 0.85 }}
            title={language === 'telugu' ? 'మొదటి నుండి కొత్త మూల్యాంకనాన్ని ప్రారంభించండి' : 'Start a brand new assessment'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M8 16H3v5" />
            </svg>
            {language === 'telugu' ? 'కొత్త మూల్యాంకనం' : 'Retake Assessment'}
          </button>
        </div>
      </div>

      <p className={`status-text ${phase === 'recording' ? 'recording' : ''}`}>
        {phase === 'idle'      && (language === 'telugu' ? 'మీరు సిద్ధంగా ఉన్నప్పుడు ప్రారంభించండి క్లిక్ చేయండి' : 'Click Start when you are ready')}
        {phase === 'countdown' && (language === 'telugu' ? 'సిద్ధంగా ఉండండి...' : 'Get ready...')}
        {phase === 'recording' && (language === 'telugu' ? 'రికార్డింగ్ జరుగుతోంది...' : 'Recording in progress...')}
        {phase === 'complete'  && (language === 'telugu' ? 'టాస్క్ పూర్తయింది! విశ్లేషణ జరుగుతోంది...' : 'Task complete! Processing...')}
      </p>
    </div>
  )
}

export default TaskScreen
