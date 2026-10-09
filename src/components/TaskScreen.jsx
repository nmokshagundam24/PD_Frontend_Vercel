// import { useState, useEffect, useRef, useCallback } from 'react'
// import Microphone from './Microphone'
// import Countdown from './Countdown'
// import TimerBar from './TimerBar'

// function TaskScreen({ task, onComplete, taskNumber, totalTasks, language }) {
//   const [phase, setPhase] = useState('idle') // idle, countdown, recording, gap, complete
//   const [currentItemIndex, setCurrentItemIndex] = useState(0)
//   const [elapsedTime, setElapsedTime] = useState(0)
//   const [showGap, setShowGap] = useState(false)
//   const [uploadedFileName, setUploadedFileName] = useState(null)

//   const mediaRecorderRef = useRef(null)
//   const audioChunksRef = useRef([])
//   const timerRef = useRef(null)
//   const itemTimerRef = useRef(null)
//   const fileInputRef = useRef(null)

//   const isManualTask = task.type === 'manual'

//   const totalDuration = isManualTask
//     ? null
//     : task.type === 'timed'
//       ? task.duration
//       : task.type === 'sequential-repeat'
//         ? null
//         : task.items
//           ? task.items.length * (task.itemDuration + (task.transitionGap || 0))
//           : 0

//   const startRecording = useCallback(async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
//       const mediaRecorder = new MediaRecorder(stream)
//       mediaRecorderRef.current = mediaRecorder
//       audioChunksRef.current = []

//       mediaRecorder.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           audioChunksRef.current.push(event.data)
//         }
//       }

//       mediaRecorder.onstop = () => {
//         const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
//         stream.getTracks().forEach(track => track.stop())
//         onComplete(task.id, audioBlob)
//       }

//       mediaRecorder.start()
//       setPhase('recording')
//       setElapsedTime(0)

//       if (!isManualTask) {
//         const startTime = Date.now()
//         timerRef.current = setInterval(() => {
//           const elapsed = Date.now() - startTime
//           setElapsedTime(elapsed)
//           if (elapsed >= totalDuration) {
//             stopRecording()
//           }
//         }, 100)

//         if (task.type === 'sequential' || task.type === 'sequential-single' || task.type === 'sequential-single-with-gap' || task.type === 'sequential-repeat') {
//           runSequentialItems()
//         }
//       }
      
//     } catch (error) {
//       console.error('Error accessing microphone:', error)
//       alert('Unable to access microphone. Please ensure microphone permissions are granted.')
//     }
//   }, [task, totalDuration, onComplete, isManualTask])

//   // const runSequentialItems = useCallback(() => {
//   //   let itemIndex = 0
//   //   setCurrentItemIndex(0)
//   //   setShowGap(false)

//   //   const advanceItem = () => {
//   //     if (itemIndex < task.items.length) {
//   //       setCurrentItemIndex(itemIndex)
//   //       setShowGap(false)

//   //       itemTimerRef.current = setTimeout(() => {
//   //         itemIndex++

//   //         if (itemIndex < task.items.length) {
//   //           if (task.type === 'sequential-single-with-gap' && task.transitionGap > 0) {
//   //             setShowGap(true)
//   //             setTimeout(() => {
//   //               setShowGap(false)
//   //               advanceItem()
//   //             }, task.transitionGap)
//   //           } else if (task.transitionGap > 0) {
//   //             setTimeout(() => {
//   //               advanceItem()
//   //             }, task.transitionGap)
//   //           } else {
//   //             advanceItem()
//   //           }
//   //         }
//   //       }, task.itemDuration)
//   //     }
//   //   }

//   //   advanceItem()
//   // }, [task])

//   const runSequentialItems = useCallback(() => {
//     let itemIndex = 0
//     setCurrentItemIndex(0)
//     setShowGap(false)

//     // ── sequential-repeat (DDK task) ──────────────────
//     if (task.type === 'sequential-repeat') {
//       const advanceWord = () => {
//         if (itemIndex >= task.items.length) {
//           // All words done — stop recording automatically
//           stopRecording()
//           return
//         }
//         setCurrentItemIndex(itemIndex)
//         let repeatsDone = 0

//         const showRepeat = () => {
//           if (repeatsDone >= task.repeatCount) {
//             setShowGap(true)
//             setTimeout(() => {
//               setShowGap(false)
//               itemIndex++
//               advanceWord()
//             }, task.transitionGap || 2000)
//             return
//           }
//           setShowGap(false)
//           repeatsDone++
//           itemTimerRef.current = setTimeout(() => {
//             setCurrentItemIndex(-1)
//             setTimeout(() => {
//               setCurrentItemIndex(itemIndex)
//               showRepeat()
//             }, 300)
//           }, task.itemDuration || 1000)
//         }
       
//         showRepeat()
//       }
//       advanceWord()
//       return
//     }
//     // ── sequential-single / sequential-single-with-gap (vowels, numbers etc) ──
//     const advanceItem = () => {
//       if (itemIndex < task.items.length) {
//         setCurrentItemIndex(itemIndex)
//         setShowGap(false)

//         itemTimerRef.current = setTimeout(() => {
//           itemIndex++
//           if (itemIndex < task.items.length) {
//             if (task.type === 'sequential-single-with-gap' && task.transitionGap > 0) {
//               setShowGap(true)
//               setTimeout(() => {
//                 setShowGap(false)
//                 advanceItem()
//               }, task.transitionGap)
//             } else if (task.transitionGap > 0) {
//               setTimeout(() => advanceItem(), task.transitionGap)
//             } else {
//               advanceItem()
//             }
//           }
//         }, task.itemDuration)
//       }
//     }

//     advanceItem()
//   }, [task])

//   const stopRecording = useCallback(() => {
//     if (timerRef.current) {
//       clearInterval(timerRef.current)
//       timerRef.current = null
//     }
//     if (itemTimerRef.current) {
//       clearTimeout(itemTimerRef.current)
//       itemTimerRef.current = null
//     }
//     if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
//       mediaRecorderRef.current.stop()
//     }
//     setPhase('complete')
//   }, [])

//   const handleStart = () => {
//     setPhase('countdown')
//   }

//   const handleCountdownComplete = () => {
//     startRecording()
//   }

//   const handleManualStop = () => {
//     stopRecording()
//   }

//   const handleAudioFileUpload = useCallback((event) => {
//     const file = event.target.files?.[0]
//     if (file) {
//       const reader = new FileReader()
//       reader.onload = () => {
//         const blob = new Blob([reader.result], { type: file.type })
//         setUploadedFileName(file.name)
//         setPhase('complete')
//         onComplete(task.id, blob)
//       }
//       reader.readAsArrayBuffer(file)
//     }
//   }, [task.id, onComplete])

//   const triggerFileUpload = () => {
//     fileInputRef.current?.click()
//   }

//   useEffect(() => {
//     return () => {
//       if (timerRef.current) clearInterval(timerRef.current)
//       if (itemTimerRef.current) clearTimeout(itemTimerRef.current)
//       if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
//         mediaRecorderRef.current.stop()
//       }
//     }
//   }, [])

//   return (
//     <div className="task-screen">
//       {phase === 'countdown' && (
//         <Countdown onComplete={handleCountdownComplete} />
//       )}

//       <div className="task-header">
//         <span className="task-badge">Task {taskNumber} of {totalTasks}</span>
//         <h2 className="task-title">{task.title}</h2>
//         <p className="task-instructions">{task.instructions}</p>
//       </div>

//       {phase === 'recording' && !isManualTask && totalDuration && (
//         <TimerBar
//           elapsed={elapsedTime}
//           total={totalDuration}
//         />
//       )}

//       <div className="display-area">
//         {(task.type === 'sequential-single' || task.type === 'sequential-single-with-gap' || task.type === 'sequential-repeat') ? (
//           <div className="single-word-display">
//             {phase === 'recording' && !showGap && task.items[currentItemIndex] && (
//               <span className="current-word">{task.items[currentItemIndex]}</span>
//             )}
//             {phase === 'recording' && showGap && (
//               <div className="gap-indicator">
//                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stop-icon">
//                   <circle cx="12" cy="12" r="10" />
//                   <line x1="8" x2="16" y1="12" y2="12" />
//                 </svg>
//                 <span className="gap-text">{language === 'telugu' ? 'ఆపండి' : 'Stop'}</span>
//               </div>
//             )}
//             {phase === 'idle' && (
//               <span className="word-preview">
//                 {language === 'telugu' ? 'పదాలు ఇక్కడ ఒక్కొక్కటిగా కనిపిస్తాయి' : 'Words will appear here one at a time'}
//               </span>
//             )}
//           </div>
//         ) : task.type === 'sequential' ? (
//           <div className="display-items">
//             {task.items.map((item, index) => (
//               <span
//                 key={index}
//                 className={`display-item ${
//                   phase === 'recording' && index === currentItemIndex ? 'active' : ''
//                 } ${index < currentItemIndex ? 'completed' : ''}`}
//               >
//                 {item}
//               </span>
//             ))}
//           </div>
//         ) : (task.type === 'manual' || task.type === 'timed') ? (
//           <div className="single-display">
//             {task.prompt ? (
//               <p className="prompt-text">{task.prompt}</p>
//             ) : task.displayText ? (
//               <p>{task.displayText}</p>
//             ) : null}
//           </div>
//         ) : null}
//       </div>

//       <div className="mic-upload-container">
//         {/* <Microphone
//           isRecording={phase === 'recording'}
//           isDisabled={phase === 'countdown' || phase === 'complete'}
//           onClick={phase === 'idle' ? handleStart : (isManualTask && phase === 'recording' ? handleManualStop : undefined)}
//         /> */}
//         <Microphone
//           isRecording={phase === 'recording'}
//           isDisabled={phase === 'countdown' || phase === 'complete' || phase === 'idle'}
//           onClick={isManualTask && phase === 'recording' ? handleManualStop : undefined}
//         />

//         <input
//           ref={fileInputRef}
//           type="file"
//           accept="audio/*"
//           onChange={handleAudioFileUpload}
//           style={{ display: 'none' }}
//         />

//         <button
//           className="upload-button"
//           onClick={triggerFileUpload}
//           disabled={phase === 'recording' || phase === 'countdown' || phase === 'complete'}
//           title={language === 'telugu' ? 'ఆడియో ఫైలు అప్లోడ్ చేయండి' : 'Upload audio file'}
//         >
//           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
//             <polyline points="17 8 12 3 7 8" />
//             <line x1="12" x2="12" y1="3" y2="15" />
//           </svg>
//         </button>
//       </div>

//       {uploadedFileName && (
//         <p className="uploaded-file-name">
//           {language === 'telugu' ? '✓ ఫైలు అప్లోడ్ చేయబడింది:' : '✓ File uploaded:'} {uploadedFileName}
//         </p>
//       )}

//       {phase === 'idle' && (
//         <button className="action-button" onClick={handleStart}>
//           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <polygon points="5 3 19 12 5 21 5 3" />
//           </svg>
//           {language === 'telugu' ? 'టాస్క్ ప్రారంభించండి' : 'Start Task'}
//         </button>
//       )}

//       {phase === 'recording' && isManualTask && (
//         <button className="action-button stop-button" onClick={handleManualStop}>
//           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <rect x="6" y="6" width="12" height="12" rx="2" />
//           </svg>
//           {language === 'telugu' ? 'రికార్డింగ్ ఆపండి' : 'Stop Recording'}
//         </button>
//       )}

//       <p className={`status-text ${phase === 'recording' ? 'recording' : ''}`}>
//         {phase === 'idle' && (language === 'telugu' ? 'మీరు సిద్ధంగా ఉన్నప్పుడు ప్రారంభించండి క్లిక్ చేయండి' : 'Click Start when you are ready')}
//         {phase === 'countdown' && (language === 'telugu' ? 'సిద్ధంగా ఉండండి...' : 'Get ready...')}
//         {phase === 'recording' && (language === 'telugu' ? 'రికార్డింగ్ జరుగుతోంది...' : 'Recording in progress...')}
//         {phase === 'complete' && (language === 'telugu' ? 'టాస్క్ పూర్తయింది! తదుపరి దానికి వెళ్తోంది...' : 'Task complete! Moving to next...')}
//       </p>
//     </div>
//   )
// }

// export default TaskScreen

import { useState, useEffect, useRef, useCallback } from 'react'
import Microphone from './Microphone'
import Countdown from './Countdown'
import TimerBar from './TimerBar'

function TaskScreen({ task, onComplete, taskNumber, totalTasks, language }) {
  const [phase, setPhase] = useState('idle')
  const [currentItemIndex, setCurrentItemIndex] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [showGap, setShowGap] = useState(false)
  const [uploadedFileName, setUploadedFileName] = useState(null)

  const mediaRecorderRef = useRef(null)
  const audioChunksRef  = useRef([])
  const timerRef        = useRef(null)
  const itemTimerRef    = useRef(null)
  const fileInputRef    = useRef(null)

  const isManualTask = task.type === 'manual'

  const totalDuration = isManualTask
    ? null
    : task.type === 'timed'
      ? task.duration
    : task.type === 'sequential-repeat'
      ? task.duration   // ← uses the 57000 value
    : task.items
      ? task.items.length * (task.itemDuration + (task.transitionGap || 0))
      : 0

  // ── stopRecording must be defined BEFORE runSequentialItems ──
  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    if (itemTimerRef.current) {
      clearTimeout(itemTimerRef.current)
      itemTimerRef.current = null
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    setPhase('complete')
  }, [])

  // ── runSequentialItems depends on stopRecording ───────────────
  const runSequentialItems = useCallback(() => {
    let itemIndex = 0
    setCurrentItemIndex(0)
    setShowGap(false)

    // ── sequential-repeat: DDK / Syllable task ────────────────
    if (task.type === 'sequential-repeat') {
      const advanceWord = () => {
        // All words finished — stop recording
        if (itemIndex >= task.items.length) {
          stopRecording()
          return
        }

        setCurrentItemIndex(itemIndex)
        let repeatsDone = 0

        const showRepeat = () => {
          // All 6 repeats done — show STOP then move to next word
          if (repeatsDone >= task.repeatCount) {
            setShowGap(true)
            setTimeout(() => {
              setShowGap(false)
              itemIndex++
              advanceWord()
            }, task.transitionGap || 2000)
            return
          }

          // Show word
          setShowGap(false)
          repeatsDone++

          itemTimerRef.current = setTimeout(() => {
            // Brief blank between same-word repetitions (no stop symbol)
            setCurrentItemIndex(-1)
            setTimeout(() => {
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

    // ── sequential-single / sequential-single-with-gap ────────
    const advanceItem = () => {
      if (itemIndex < task.items.length) {
        setCurrentItemIndex(itemIndex)
        setShowGap(false)

        itemTimerRef.current = setTimeout(() => {
          itemIndex++
          if (itemIndex < task.items.length) {
            if (task.type === 'sequential-single-with-gap' && task.transitionGap > 0) {
              setShowGap(true)
              setTimeout(() => {
                setShowGap(false)
                advanceItem()
              }, task.transitionGap)
            } else if (task.transitionGap > 0) {
              setTimeout(() => advanceItem(), task.transitionGap)
            } else {
              advanceItem()
            }
          }
        }, task.itemDuration)
      }
    }

    advanceItem()
  }, [task, stopRecording])

  // ── startRecording depends on runSequentialItems ──────────────
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        stream.getTracks().forEach(track => track.stop())
        onComplete(task.id, audioBlob)
      }

      mediaRecorder.start()
      setPhase('recording')
      setElapsedTime(0)

      if (!isManualTask) {
        // Only start the timer if totalDuration is set (not null)
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
    }
  }, [task, totalDuration, onComplete, isManualTask, stopRecording, runSequentialItems])

  const handleStart           = () => setPhase('countdown')
  const handleCountdownComplete = () => startRecording()
  const handleManualStop      = () => stopRecording()

  const handleAudioFileUpload = useCallback((event) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const blob = new Blob([reader.result], { type: file.type })
        setUploadedFileName(file.name)
        setPhase('complete')
        onComplete(task.id, blob)
      }
      reader.readAsArrayBuffer(file)
    }
  }, [task.id, onComplete])

  const triggerFileUpload = () => fileInputRef.current?.click()

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (itemTimerRef.current) clearTimeout(itemTimerRef.current)
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  return (
    <div className="task-screen">
      {phase === 'countdown' && (
        <Countdown onComplete={handleCountdownComplete} />
      )}

      <div className="task-header">
        <span className="task-badge">Task {taskNumber} of {totalTasks}</span>
        <h2 className="task-title">{task.title}</h2>
        <p className="task-instructions">{task.instructions}</p>
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
        Recording in progress...
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
              <span className="current-word">{task.items[currentItemIndex]}</span>
            )}
            {phase === 'recording' && showGap && (
              <div className="gap-indicator">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" className="stop-icon">
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
          <div className="single-display">
            {task.prompt ? (
              <p className="prompt-text">{task.prompt}</p>
            ) : task.displayText ? (
              <p>{task.displayText}</p>
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

      <p className={`status-text ${phase === 'recording' ? 'recording' : ''}`}>
        {phase === 'idle'      && (language === 'telugu' ? 'మీరు సిద్ధంగా ఉన్నప్పుడు ప్రారంభించండి క్లిక్ చేయండి' : 'Click Start when you are ready')}
        {phase === 'countdown' && (language === 'telugu' ? 'సిద్ధంగా ఉండండి...' : 'Get ready...')}
        {phase === 'recording' && (language === 'telugu' ? 'రికార్డింగ్ జరుగుతోంది...' : 'Recording in progress...')}
        {phase === 'complete'  && (language === 'telugu' ? 'టాస్క్ పూర్తయింది! తదుపరి దానికి వెళ్తోంది...' : 'Task complete! Moving to next...')}
      </p>
    </div>
  )
}

export default TaskScreen
