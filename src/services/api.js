const API_BASE = import.meta.env.VITE_API_URL || "http://10.4.16.158:8000";

// ─── WAV Conversion Helpers ────────────────────────────────────────
/**
 * Convert any audio Blob (webm, ogg, etc.) to a proper WAV Blob
 * using the browser's AudioContext for decoding.
 */
async function convertBlobToWav(blob) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  try {
    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // Downsample to 16 kHz mono for the ML pipeline
    const targetSR = 16000;
    const offlineCtx = new OfflineAudioContext(1, audioBuffer.duration * targetSR, targetSR);
    const source = offlineCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offlineCtx.destination);
    source.start(0);
    const rendered = await offlineCtx.startRendering();

    // Encode the PCM samples into a WAV file
    const pcm = rendered.getChannelData(0);
    const wavBuffer = encodeWAV(pcm, targetSR);
    return new Blob([wavBuffer], { type: "audio/wav" });
  } finally {
    await audioContext.close();
  }
}

/** Encode Float32 PCM samples into a 16-bit WAV ArrayBuffer */
function encodeWAV(samples, sampleRate) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const bytesPerSample = bitsPerSample / 8;
  const dataLength = samples.length * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataLength);
  const view = new DataView(buffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataLength, true);
  writeString(view, 8, "WAVE");

  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);           // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * bytesPerSample, true);
  view.setUint16(32, numChannels * bytesPerSample, true);
  view.setUint16(34, bitsPerSample, true);

  writeString(view, 36, "data");
  view.setUint32(40, dataLength, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return buffer;
}

function writeString(view, offset, str) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

// ─── API Functions ─────────────────────────────────────────────────


export async function startSession() {
  console.log("[API] POST /start-session");
  const res = await fetch(`${API_BASE}/start-session`, {
    method: "POST",
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
  });
  if (!res.ok) throw new Error("Failed to start session");
  return res.json();
}

export async function processTask(participantId, taskId, taskName, audioBlob, language, isRetry = false) {
  console.log(
    `[API] processTask — task=${taskName}, lang=${language}, blobType=${audioBlob.type}, size=${audioBlob.size}, isRetry=${isRetry}`
  );

  // Convert browser audio (webm/ogg) → WAV so the backend always gets PCM
  let wavBlob;
  try {
    wavBlob = await convertBlobToWav(audioBlob);
    console.log(`[API] Converted to WAV — size=${wavBlob.size}`);
  } catch (err) {
    console.warn("[API] WAV conversion failed, sending original blob:", err);
    wavBlob = audioBlob; // fallback
  }

  const formData = new FormData();
  formData.append("participant_id", participantId);
  formData.append("task_id", taskId.toString());
  formData.append("task_name", taskName);
  formData.append("retry", isRetry ? "true" : "false");

  // Send the selected language to the backend, with a fallback just in case
  if (language) {
    formData.append("language", language.toLowerCase());
  } else {
    formData.append("language", "english");
  }

  formData.append("file", wavBlob, `task_${taskId}_${taskName}.wav`);

  console.log(`[API] POST /process-task — participant=${participantId}`);
  const res = await fetch(`${API_BASE}/process-task`, {
    method: "POST",
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Upload failed" }));
    console.error("[API] process-task error:", err);
    throw new Error(err.detail || "Failed to process task");
  }
  const data = await res.json();
  console.log("[API] process-task success:", data);
  return data;
}

// export async function getFinalResult(participantId) {
//   console.log(`[API] GET /final-result/${participantId}`);
//   const res = await fetch(`${API_BASE}/final-result/${participantId}`);
//   if (!res.ok) throw new Error("Failed to fetch results");
//   return res.json();
// }


export async function getFinalResult(participantId) {
  console.log(`[API] GET /final-result/${participantId}`);
  const res = await fetch(`${API_BASE}/final-result/${participantId}`, {
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch results");
  return res.json();
}
