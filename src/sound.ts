let ctx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext()
  return ctx
}

function tone(freq: number, startOffset: number, duration: number, type: OscillatorType, gain: number) {
  const audioCtx = getCtx()
  const osc = audioCtx.createOscillator()
  const gainNode = audioCtx.createGain()
  osc.type = type
  osc.frequency.value = freq
  const startAt = audioCtx.currentTime + startOffset
  gainNode.gain.setValueAtTime(0, startAt)
  gainNode.gain.linearRampToValueAtTime(gain, startAt + 0.02)
  gainNode.gain.exponentialRampToValueAtTime(0.001, startAt + duration)
  osc.connect(gainNode)
  gainNode.connect(audioCtx.destination)
  osc.start(startAt)
  osc.stop(startAt + duration + 0.05)
}

export function playStartBell() {
  tone(1568, 0, 0.15, 'square', 0.15)
  tone(1568, 0.18, 0.15, 'square', 0.15)
  tone(1976, 0.36, 0.3, 'square', 0.15)
}

export function playFinishFanfare() {
  const notes = [523.25, 659.25, 783.99, 1046.5]
  notes.forEach((freq, i) => tone(freq, i * 0.12, 0.35, 'triangle', 0.16))
}
