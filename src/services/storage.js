const STORAGE_KEY = 'pd_assessment_session_v1';

/**
 * Validates the loaded state from sessionStorage.
 * Returns null if the stored state is invalid, expired, or malformed.
 */
function validateState(state) {
  if (!state || typeof state !== 'object') return null;

  // If there is no participant ID, it's not an active session
  if (!state.participantId || typeof state.participantId !== 'string') {
    return null;
  }

  const validStages = ['welcome', 'language', 'task', 'uploading', 'task-result', 'results', 'error'];
  if (!validStages.includes(state.stage)) {
    return null;
  }

  // If stage was 'uploading' during refresh, restore to 'task' so user can retry safely
  let stage = state.stage;
  if (stage === 'uploading') {
    stage = 'task';
  }

  const currentTaskIndex = typeof state.currentTaskIndex === 'number' && state.currentTaskIndex >= 0
    ? state.currentTaskIndex
    : 0;

  const language = state.language === 'telugu' || state.language === 'english'
    ? state.language
    : null;

  const completedTaskResults = Array.isArray(state.completedTaskResults)
    ? state.completedTaskResults
    : [];

  // When restoring to a task screen, restart that same task from its beginning (prompt 0)
  const currentPromptIndex = (stage === 'task')
    ? 0
    : (typeof state.currentPromptIndex === 'number' && state.currentPromptIndex >= 0 ? state.currentPromptIndex : 0);

  return {
    version: 1,
    participantId: state.participantId,
    language,
    stage,
    currentTaskIndex,
    currentPromptIndex,
    currentTaskResult: state.currentTaskResult || null,
    completedTaskResults,
    finalResult: state.finalResult || null,
    shuffledTaskItems: state.shuffledTaskItems || {},
  };
}

/**
 * Saves current assessment state to sessionStorage.
 */
export function saveAssessmentState(state) {
  try {
    if (!state || !state.participantId) {
      return;
    }
    const safeState = {
      version: 1,
      participantId: state.participantId,
      language: state.language || null,
      stage: state.stage === 'uploading' ? 'task' : state.stage,
      currentTaskIndex: state.currentTaskIndex ?? 0,
      currentPromptIndex: state.currentPromptIndex ?? 0,
      currentTaskResult: state.currentTaskResult || null,
      completedTaskResults: Array.isArray(state.completedTaskResults) ? state.completedTaskResults : [],
      finalResult: state.finalResult || null,
      shuffledTaskItems: state.shuffledTaskItems || {},
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(safeState));
  } catch (err) {
    console.warn('[Storage] Failed to save assessment state:', err);
  }
}

/**
 * Loads and validates assessment state from sessionStorage.
 */
export function loadAssessmentState() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return validateState(parsed);
  } catch (err) {
    console.warn('[Storage] Failed to load assessment state:', err);
    return null;
  }
}

/**
 * Clears assessment state from sessionStorage (for new assessment or session reset).
 */
export function clearAssessmentState() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('[Storage] Failed to clear assessment state:', err);
  }
}
