import { useEffect, useRef, useState } from 'react'
import type { HorseConfig, RaceResultEntry } from '../types'
import HorseSprite from '../components/HorseSprite'
import { playStartBell, playFinishFanfare } from '../sound'

const SPRITE_SIZE = 48

interface WaveParams {
  amp: number
  freq: number
  phase: number
}

interface HorseRaceParams {
  ability: number
  waves: WaveParams[]
}

function genParams(): HorseRaceParams {
  const ability = 0.88 + Math.random() * 0.24
  const waves = Array.from({ length: 3 }, () => ({
    amp: 0.15 + Math.random() * 0.25,
    freq: 0.5 + Math.random() * 2.5,
    phase: Math.random() * Math.PI * 2,
  }))
  return { ability, waves }
}

function speedMultiplier(params: HorseRaceParams, tSec: number): number {
  let wave = 0
  for (const w of params.waves) wave += w.amp * Math.sin(w.freq * tSec + w.phase)
  const m = params.ability * (1 + wave)
  return Math.max(0.15, Math.min(2.2, m))
}

function displayName(h: HorseConfig): string {
  return h.name.trim() || `Horse ${h.number}`
}

interface RaceScreenProps {
  horses: HorseConfig[]
  durationSeconds: number
  soundOn: boolean
  onFinish: (results: RaceResultEntry[]) => void
}

export default function RaceScreen({ horses, durationSeconds, soundOn, onFinish }: RaceScreenProps) {
  const [phase, setPhase] = useState<'countdown' | 'running'>('countdown')
  const [countdownLabel, setCountdownLabel] = useState('3')
  const [positions, setPositions] = useState<Record<string, number>>(
    () => Object.fromEntries(horses.map((h) => [h.id, 0])),
  )
  const [elapsed, setElapsed] = useState(0)
  const [paused, setPaused] = useState(false)

  const paramsRef = useRef<Record<string, HorseRaceParams>>({})
  const positionsRef = useRef<Record<string, number>>({})
  const finishTimesRef = useRef<Record<string, number>>({})
  const rafRef = useRef<number | undefined>(undefined)
  const startRef = useRef<number | null>(null)
  const lastTRef = useRef(0)
  const finishedRef = useRef(false)
  const pausedRef = useRef(false)
  const pauseBeganAtRef = useRef<number | null>(null)
  const pausedAccumRef = useRef(0)
  const finalizeRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    paramsRef.current = Object.fromEntries(horses.map((h) => [h.id, genParams()]))
    positionsRef.current = Object.fromEntries(horses.map((h) => [h.id, 0]))
    finishTimesRef.current = {}
    finishedRef.current = false
  }, [horses])

  useEffect(() => {
    const steps = ['3', '2', '1', 'GO!']
    let i = 0
    setCountdownLabel(steps[0])
    const interval = setInterval(() => {
      i += 1
      if (i >= steps.length) {
        clearInterval(interval)
        if (soundOn) playStartBell()
        setPhase('running')
        return
      }
      setCountdownLabel(steps[i])
    }, 700)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (phase !== 'running') return

    function finalize() {
      if (finishedRef.current) return
      finishedRef.current = true
      if (rafRef.current !== undefined) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = undefined
      }
      const results: RaceResultEntry[] = horses.map((h) => ({
        horse: h,
        place: 0,
        finishTimeSec: finishTimesRef.current[h.id] ?? null,
        finalPositionPct: positionsRef.current[h.id] ?? 0,
      }))
      results.sort((a, b) => {
        if (a.finishTimeSec !== null && b.finishTimeSec !== null) return a.finishTimeSec - b.finishTimeSec
        if (a.finishTimeSec !== null) return -1
        if (b.finishTimeSec !== null) return 1
        return b.finalPositionPct - a.finalPositionPct
      })
      results.forEach((r, i) => (r.place = i + 1))
      if (soundOn) playFinishFanfare()
      onFinish(results)
    }
    finalizeRef.current = finalize

    function frame(now: number) {
      if (startRef.current === null) startRef.current = now

      if (pausedRef.current) {
        rafRef.current = requestAnimationFrame(frame)
        return
      }

      const elapsedSec = (now - startRef.current) / 1000 - pausedAccumRef.current / 1000
      const dt = elapsedSec - lastTRef.current
      lastTRef.current = elapsedSec

      const baseSpeed = 100 / durationSeconds
      let allFinished = true

      horses.forEach((h) => {
        if (finishTimesRef.current[h.id] !== undefined) return
        const params = paramsRef.current[h.id]
        const mult = speedMultiplier(params, elapsedSec)
        let pos = (positionsRef.current[h.id] ?? 0) + mult * baseSpeed * dt
        if (pos >= 100) {
          pos = 100
          finishTimesRef.current[h.id] = elapsedSec
        } else {
          allFinished = false
        }
        positionsRef.current[h.id] = pos
      })

      setPositions({ ...positionsRef.current })
      setElapsed(Math.min(elapsedSec, durationSeconds))

      if (elapsedSec < durationSeconds && !allFinished) {
        rafRef.current = requestAnimationFrame(frame)
      } else {
        finalize()
      }
    }

    rafRef.current = requestAnimationFrame(frame)
    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const progressPct = Math.min(100, (elapsed / durationSeconds) * 100)

  function togglePause() {
    if (phase !== 'running' || finishedRef.current) return
    if (pausedRef.current) {
      if (pauseBeganAtRef.current !== null) {
        pausedAccumRef.current += performance.now() - pauseBeganAtRef.current
      }
      pauseBeganAtRef.current = null
      pausedRef.current = false
      setPaused(false)
    } else {
      pausedRef.current = true
      pauseBeganAtRef.current = performance.now()
      setPaused(true)
    }
  }

  function handleEndRace() {
    if (phase !== 'running' || finishedRef.current) return
    finalizeRef.current?.()
  }

  return (
    <div className="screen race-screen">
      {phase === 'countdown' && (
        <div className="countdown-overlay">
          <span className="countdown-label">{countdownLabel}</span>
        </div>
      )}

      <div className="race-topbar">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <span className="race-timer">
          {elapsed.toFixed(1)}s / {durationSeconds}s
        </span>
        {phase === 'running' && (
          <div className="race-controls">
            <button className="race-control-btn pause" onClick={togglePause}>
              {paused ? '▶ Resume' : '⏸ Pause'}
            </button>
            <button className="race-control-btn end" onClick={handleEndRace}>
              ⏹ End Race
            </button>
          </div>
        )}
      </div>

      <div className={`track${paused ? ' track-paused' : ''}`}>
        {paused && (
          <div className="pause-overlay">
            <span className="pause-label">PAUSED</span>
          </div>
        )}
        {horses.map((h) => (
          <div className="lane" key={h.id}>
            <div className="lane-label">
              #{h.number} {displayName(h)}
            </div>
            <div className="lane-track">
              <div className="finish-flag" aria-hidden="true">
                🏁
              </div>
              <div
                className="runner"
                style={{ left: `${positions[h.id] ?? 0}%` }}
              >
                <HorseSprite colorKey={h.colorKey} running size={SPRITE_SIZE} />
                <span className="runner-badge">{h.number}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
