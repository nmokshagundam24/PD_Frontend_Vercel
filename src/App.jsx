import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import './App.css'
import WelcomeScreen from './components/WelcomeScreen'
import LanguageSelect from './components/LanguageSelect'
import TaskScreen from './components/TaskScreen'
import UploadingScreen from './components/UploadingScreen'
import TaskResultScreen from './components/TaskResultScreen'
import ResultsScreen from './components/ResultsScreen'
import ProgressIndicator from './components/ProgressIndicator'
import { startSession, processTask, getFinalResult, discardTask, resetSession } from './services/api'
import { loadAssessmentState, saveAssessmentState, clearAssessmentState } from './services/storage'

// Shuffle array function
const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const TASKS_TELUGU = [
  {
    id: 'vowels',
    title: 'అచ్చుల ఉచ్చారణ',
    instructions: 'ప్రతి స్వరాన్ని అది హైలైట్ అయినప్పుడు స్పష్టంగా ఉచ్చరించండి. ప్రతి శబ్దాన్ని 5 సెకండ్ల పాటు నిలిపి ఉంచండి.',
    type: 'sequential-single-with-gap',
    items: ['ఆ', 'ఈ', 'ఐ', 'ఓ', 'ఉ'],
    itemDuration: 5000,
    transitionGap: 1000,
  },
  {
    id: 'numbers',
    title: 'సంఖ్యల క్రమం',
    instructions: 'ఒకటి నుండి పది వరకు తెలుగులో లెక్కించండి. స్పష్టంగా మరియు సహజంగా మాట్లాడండి.',
    type: 'sequential-single-with-gap',
    items: ['ఒకటి', 'రెండు', 'మూడు', 'నాలుగు', 'ఐదు', 'ఆరు', 'ఏడు', 'ఎనిమిది', 'తొమ్మిది', 'పది'],
    itemDuration: 3000,
    transitionGap: 1000,
  },
  {
    id: 'ddk',
    title: 'అక్షర నమూనాలు',
    instructions: 'స్క్రీన్‌పై కనిపించే ప్రతి అక్షర నమూనాను 6 సార్లు స్పష్టంగా పునరావృతం చేయండి.',
    type: 'sequential-single',
    items: ['పటక', 'పకట', 'కపట', 'కటప', 'టపక', 'టకప'],
    itemDuration: 5000,
    transitionGap: 0,
  },
  {
    id: 'words',
    title: 'పదాల పఠనం',
    instructions: 'ప్రతి తెలుగు పదాన్ని స్క్రీన్‌పై కనిపించినప్పుడు బిగ్గరగా చదవండి.',
    type: 'sequential-single',
    items: [
      'అందమైన', 'ఆసుపత్రి', 'సీతాకోకచిలుక', 'విశ్వవిద్యాలయం', 'అవకాశం',
      'గణితం', 'ఏనుగు', 'ఉత్సాహం', 'ప్రత్యేకంగా', 'రిఫ్రిజిరేటర్',
      'సంభాషణ', 'విప్లవకర', 'సౌకర్యవంతమైన', 'ఉష్ణోగ్రత', 'విద్యుత్',
      'పరిస్థితులు', 'అభినందనలు', 'అసాధారణమైన', 'బాధ్యత', 'నమ్మశక్యంకాని',
      'ఊహ', 'నిశ్చయం', 'అవగాహన', 'ఉచ్చారణ',
      'వసతి', 'పర్యావరణ', 'వ్యాఖ్యానం', 'సిఫార్సు', 'సంస్థాగత'
    ],
    itemDuration: 3000,
    transitionGap: 0,
    shuffle: true,
  },
  {
    id: 'sentences',
    title: 'పేరా పఠనం',
    instructions: 'కింది తెలుగు పేరాను సహజమైన వ్యక్తీకరణ మరియు వేగంతో బిగ్గరగా చదవండి. ఒక నిమిషం ప్రసంగం ఇవ్వండి.',
    type: 'manual',
    duration: 60000,
    displayText: '',
    prompt: 'ఉదయం తొందరగా, రమేష్ నిశ్శబ్దంగా ఉన్న గుడి రోడ్డుపై నెమ్మదిగా నడిచాడు.\nగంటల మ్రోగుడు, పక్షుల కిలకిలలు, దూరంగా వినిపించే వాహనాల శబ్దం కలిసిపోయాయి.\nచిన్న టీ దుకాణం దగ్గర అతను ఆగి, వేడి కప్పులో నుంచి పైకి ఎగసే ఆవిరిని చూసి చిరునవ్వు చిందించాడు.\nచుట్టూ ఉన్న వారు వేగంగా నడుస్తూ, గట్టిగా మాట్లాడుతూ, పొరుగువారిని పలకరిస్తూ, మొబైల్ ఫోన్లు చూస్తూ వెళ్లారు.\nఆ శబ్దాల మధ్య కూడా, రమేష్ తన ప్రతి అడుగుపై దృష్టి పెట్టి, నిశ్చలంగా ముందుకు సాగాడు.',
  },
  {
    id: 'spontaneous',
    title: 'స్వచ్ఛంద ప్రసంగం',
    instructions: 'కింది అంశాల గురించి మాట్లాడండి. ఒక నిమిషం ప్రసంగం ఇవ్వండి.',
    type: 'manual',
    duration: 60000,
    displayText: '',
    prompt: '"మీ గురించి చెప్పండి."\n\n"మీ కుటుంబ సభ్యుల గురించి క్లుప్తంగా వివరించండి."'
  },
]

const TASKS_ENGLISH = [
  {
    id: 'vowels',
    title: 'Vowel Pronunciation',
    instructions: 'Pronounce each vowel clearly when it highlights. Hold each sound for 5 seconds.',
    type: 'sequential-single-with-gap',
    items: ['A', 'E', 'I', 'O', 'U'],
    itemDuration: 5000,
    transitionGap: 1000,
  },
  {
    id: 'numbers',
    title: 'Number Sequence',
    instructions: 'Count from 1 to 10 clearly and naturally.',
    type: 'sequential-single-with-gap',
    items: ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'],
    itemDuration: 3000,
    transitionGap: 1000,
  },
  // {
  //   id: 'ddk',
  //   title: 'Syllable Patterns',
  //   instructions: 'Repeat each syllable pattern clearly 6 times when it appears on screen.',
  //   type: 'sequential-single',
  //   items: ['PATAKA', 'PAKATA', 'KAPATA', 'KATAPA', 'TAPAKA', 'TAKAPA'],
  //   itemDuration: 5000,
  //   transitionGap: 0,
  // },
  // {
  //   id: 'ddk',
  //   title: 'Syllable Patterns',
  //   instructions: 'Each syllable pattern will appear 6 times. Repeat it clearly every time it shows.',
  //   type: 'sequential-repeat',
  //   items: ['PATAKA', 'PAKATA', 'KAPATA', 'KATAPA', 'TAPAKA', 'TAKAPA'],
  //   repeatCount: 6,
  //   itemDuration: 800,
  //   repeatGap: 400,
  //   transitionGap: 2000,
  // },
  {
    id: 'ddk',
    title: 'Syllable Patterns',
    instructions: 'Each syllable pattern will appear 6 times. Repeat it clearly every time it shows.',
    type: 'sequential-repeat',
    items: ['PATAKA', 'PAKATA', 'KAPATA', 'KATAPA', 'TAPAKA', 'TAKAPA'],
    repeatCount: 6,
    itemDuration: 1000,
    repeatGap: 300,
    transitionGap: 2000,
    duration: 57000,
  },
  {
    id: 'words',
    title: 'Word Reading',
    instructions: 'Read each word aloud as it appears on screen.',
    type: 'sequential-single',
    items: [
      'Beautiful', 'Hospital', 'Butterfly', 'University', 'Opportunity',
      'Mathematics', 'Elephant', 'Enthusiasm', 'Particularly', 'Refrigerator',
      'Communication', 'Revolutionary', 'Comfortable', 'Temperature', 'Electricity',
      'Circumstances', 'Congratulations', 'Extraordinary', 'Responsibility', 'Unbelievable',
      'Imagination', 'Determination', 'Understanding', 'Pronunciation',
      'Accommodation', 'Environmental', 'Interpretation', 'Recommendation', 'Organizational'
    ],
    itemDuration: 3000,
    transitionGap: 0,
    shuffle: true,
  },
  {
    id: 'sentences',
    title: 'Paragraph Reading',
    instructions: 'Read the following paragraph aloud at a natural pace and volume.',
    type: 'manual',
    duration: 60000,
    displayText: '',
    prompt: 'Early in the morning, Ramesh walked slowly along the quiet temple road. The soft ringing of bells mixed with the sound of birds and distant traffic. He stopped near a small tea stall, watched the steam rise from a hot cup, and smiled. People hurried past him, speaking loudly, greeting neighbors, or checking their mobile phones. Despite the noise around him, Ramesh remained calm and focused on each careful step. Clear speech, steady breathing, and smooth movement helped him continue his walk with confidence.',
  },
  {
    id: 'spontaneous',
    title: 'Spontaneous Speech',
    instructions: 'Speak about the following topics. Give 1 minute of speech.',
    type: 'manual',
    duration: 60000,
    displayText: '',
    prompt: 'Tell me about yourself.\n\nDescribe your family members briefly.'
  },
]

function App() {
  const [initialLoaded] = useState(() => loadAssessmentState())
  const [stage, setStage] = useState(() => initialLoaded?.stage || 'welcome')
  const [language, setLanguage] = useState(() => initialLoaded?.language || null)
  const [currentTaskIndex, setCurrentTaskIndex] = useState(() => initialLoaded?.currentTaskIndex ?? 0)
  const [currentPromptIndex, setCurrentPromptIndex] = useState(() => initialLoaded?.currentPromptIndex ?? 0)
  const [participantId, setParticipantId] = useState(() => initialLoaded?.participantId || null)
  const [currentTaskResult, setCurrentTaskResult] = useState(() => initialLoaded?.currentTaskResult || null)
  const [finalResult, setFinalResult] = useState(() => initialLoaded?.finalResult || null)
  const [uploadProgress, setUploadProgress] = useState('')
  const [error, setError] = useState(null)
  const [shuffledTaskItems, setShuffledTaskItems] = useState(() => initialLoaded?.shuffledTaskItems || {})
  const taskResultsRef = useRef(initialLoaded?.completedTaskResults || [])

  const TASKS = useMemo(() => {
    if (!language) return []
    const baseTasks = language === 'telugu' ? TASKS_TELUGU : TASKS_ENGLISH
    return baseTasks.map(task => {
      if (task.shuffle && task.items) {
        const existing = shuffledTaskItems[task.id]
        if (existing && Array.isArray(existing) && existing.length === task.items.length) {
          return { ...task, items: existing }
        }
        return { ...task, items: shuffleArray(task.items) }
      }
      return task
    })
  }, [language, shuffledTaskItems])

  // Sync state changes to sessionStorage
  useEffect(() => {
    if (participantId && stage !== 'welcome') {
      saveAssessmentState({
        participantId,
        language,
        stage,
        currentTaskIndex,
        currentPromptIndex,
        currentTaskResult,
        completedTaskResults: taskResultsRef.current,
        finalResult,
        shuffledTaskItems,
      })
    }
  }, [participantId, language, stage, currentTaskIndex, currentPromptIndex, currentTaskResult, finalResult, shuffledTaskItems])

  // Verify backend session on mount if restored from storage
  useEffect(() => {
    if (initialLoaded?.participantId) {
      let isCancelled = false

      // If the user refreshed accidentally while on a task, discard any existing recording/score on server
      if (initialLoaded.stage === 'task') {
        const taskIdToDiscard = (initialLoaded.currentTaskIndex ?? 0) + 1
        console.log(`[App] Accidental refresh detected during task ${taskIdToDiscard}. Discarding task on server.`)
        discardTask(initialLoaded.participantId, taskIdToDiscard)
      }

      getFinalResult(initialLoaded.participantId)
        .then(res => {
          if (!isCancelled && res?.status === 'complete' && !finalResult) {
            setFinalResult(res)
          }
        })
        .catch(err => {
          if (!isCancelled && err.message && err.message.toLowerCase().includes('not found')) {
            console.warn('[App] Stored session not found on backend. Resetting.')
            clearAssessmentState()
            setParticipantId(null)
            setLanguage(null)
            setStage('welcome')
            setCurrentTaskIndex(0)
            setCurrentPromptIndex(0)
            taskResultsRef.current = []
            setError('Previous assessment session was not found on the server. Please start a new assessment.')
          }
        })
      return () => {
        isCancelled = true
      }
    }
  }, [])

  const handleStart = useCallback(() => {
    setStage('language')
  }, [])

  const handleLanguageSelect = useCallback(async (selectedLanguage) => {
    try {
      setError(null)
      setLanguage(selectedLanguage)
      const { participant_id } = await startSession()
      setParticipantId(participant_id)
      taskResultsRef.current = []
      setCurrentTaskIndex(0)
      setCurrentPromptIndex(0)
      setCurrentTaskResult(null)
      setFinalResult(null)

      // Initialize shuffled items for this session
      const baseTasks = selectedLanguage === 'telugu' ? TASKS_TELUGU : TASKS_ENGLISH
      const newShuffled = {}
      baseTasks.forEach(task => {
        if (task.shuffle && task.items) {
          newShuffled[task.id] = shuffleArray(task.items)
        }
      })
      setShuffledTaskItems(newShuffled)

      setStage('task')
      saveAssessmentState({
        participantId: participant_id,
        language: selectedLanguage,
        stage: 'task',
        currentTaskIndex: 0,
        currentPromptIndex: 0,
        currentTaskResult: null,
        completedTaskResults: [],
        finalResult: null,
        shuffledTaskItems: newShuffled,
      })
    } catch (err) {
      setError(`Failed to start session: ${err.message}`)
      setStage('error')
    }
  }, [])

  const [isRetryingCurrentTask, setIsRetryingCurrentTask] = useState(false)

  const handleTaskComplete = useCallback(async (taskId, audioBlob, isRetryParam = false) => {
    setStage('uploading')
    const taskIndex = currentTaskIndex
    const task = TASKS[taskIndex]
    setUploadProgress(`Processing "${task.title}"... Analyzing speech patterns.`)
    const isRetry = isRetryParam || isRetryingCurrentTask

    try {
      const result = await processTask(
        participantId,
        taskIndex + 1,
        task.id,
        audioBlob,
        language,
        isRetry
      )

      // Replace existing task result if retrying, or append if new
      const existingIdx = taskResultsRef.current.findIndex(r => r.task_id === result.task_id || r.task_name === result.task_name)
      if (existingIdx >= 0) {
        taskResultsRef.current[existingIdx] = result
      } else {
        taskResultsRef.current.push(result)
      }

      setIsRetryingCurrentTask(false)
      setCurrentTaskResult(result)
      // Always show per-task result first before moving on
      setStage('task-result')
    } catch (err) {
      setError(`Task processing failed: ${err.message}`)
      setStage('error')
    }
  }, [currentTaskIndex, participantId, TASKS, language, isRetryingCurrentTask])

  const handleRetakeAssessment = useCallback(() => {
    if (participantId) {
      resetSession(participantId)
    }
    clearAssessmentState()
    setStage('welcome')
    setLanguage(null)
    setParticipantId(null)
    setFinalResult(null)
    setCurrentTaskResult(null)
    setCurrentTaskIndex(0)
    setCurrentPromptIndex(0)
    setIsRetryingCurrentTask(false)
    setShuffledTaskItems({})
    setError(null)
    taskResultsRef.current = []
  }, [participantId])

  const handleRetryTask = useCallback(() => {
    const taskId = currentTaskIndex + 1
    if (participantId) {
      discardTask(participantId, taskId)
    }
    taskResultsRef.current = taskResultsRef.current.filter(r => r.task_id !== taskId)
    setCurrentTaskResult(null)
    setIsRetryingCurrentTask(true)
    setError(null)
    setCurrentPromptIndex(0)
    setStage('task')
  }, [currentTaskIndex, participantId])

  const handlePromptChange = useCallback((promptIndex) => {
    setCurrentPromptIndex(promptIndex)
  }, [])

  const handleContinueFromTaskResult = useCallback(async () => {
    const taskIndex = currentTaskIndex
    if (taskIndex < TASKS.length - 1) {
      // Move to the next task
      setCurrentTaskIndex(taskIndex + 1)
      setCurrentPromptIndex(0)
      setCurrentTaskResult(null)
      setIsRetryingCurrentTask(false)
      setStage('task')
    } else {
      // All tasks done — fetch final result
      setUploadProgress('All tasks complete! Computing final prediction...')
      setStage('uploading')
      let final = null
      try {
        final = await getFinalResult(participantId)
      } catch (fetchErr) {
        console.error('[App] getFinalResult failed:', fetchErr)
      }
      setFinalResult(final)
      setStage('results')
    }
  }, [currentTaskIndex, TASKS.length, participantId])

  const progressPercentage = stage === 'welcome' || stage === 'language'
    ? 0
    : stage === 'results'
      ? 100
      : Math.round(((currentTaskIndex + 1) / TASKS.length) * 100)

  return (
    <div className="app">
      {stage !== 'welcome' && stage !== 'language' && stage !== 'error' && (
        <ProgressIndicator
          currentStage={Math.min(currentTaskIndex + 1, TASKS.length)}
          totalStages={TASKS.length}
          percentage={progressPercentage}
          language={language}
        />
      )}

      <main className="main-content">
        {stage === 'welcome' && (
          <WelcomeScreen onStart={handleStart} error={error} />
        )}

        {stage === 'language' && (
          <LanguageSelect onSelect={handleLanguageSelect} />
        )}

        {stage === 'task' && TASKS.length > 0 && (
          <TaskScreen
            key={TASKS[currentTaskIndex].id}
            task={TASKS[currentTaskIndex]}
            onComplete={handleTaskComplete}
            taskNumber={currentTaskIndex + 1}
            totalTasks={TASKS.length}
            language={language}
            initialPromptIndex={currentPromptIndex}
            onPromptChange={handlePromptChange}
            onRetryTask={handleRetryTask}
            onRetakeAssessment={handleRetakeAssessment}
            isRetry={isRetryingCurrentTask}
          />
        )}

        {stage === 'uploading' && (
          <UploadingScreen message={uploadProgress} />
        )}

        {stage === 'task-result' && (
          <TaskResultScreen
            taskResult={currentTaskResult}
            taskNumber={currentTaskIndex + 1}
            totalTasks={TASKS.length}
            onContinue={handleContinueFromTaskResult}
            onRetryTask={handleRetryTask}
            onRetakeAssessment={handleRetakeAssessment}
            language={language}
          />
        )}

        {stage === 'results' && (
          <ResultsScreen
            result={finalResult}
            language={language}
            onRestart={handleRetakeAssessment}
          />
        )}

        {stage === 'error' && (
          <div className="error-screen">
            <div className="results-icon warning">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="8" y2="12" />
                <line x1="12" x2="12.01" y1="16" y2="16" />
              </svg>
            </div>
            <h2 className="results-title">Something went wrong</h2>
            <p className="disclaimer">{error}</p>
            <div className="results-actions">
              <button className="action-button" onClick={handleRetryTask}>
                Retry Current Task
              </button>
              <button className="action-button" onClick={handleRetakeAssessment} style={{ opacity: 0.7 }}>
                Retake Assessment
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
