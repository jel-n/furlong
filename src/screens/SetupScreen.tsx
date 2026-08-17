import { useState } from 'react'
import type { HorseConfig } from '../types'
import { PALETTE, defaultColorKeyForIndex } from '../colors'
import HorseSprite from '../components/HorseSprite'

const MIN_HORSES = 2
const MAX_HORSES = 32
const MIN_DURATION = 5
const MAX_DURATION = 120

interface SetupScreenProps {
  horses: HorseConfig[]
  setHorses: (horses: HorseConfig[]) => void
  durationSeconds: number
  setDurationSeconds: (d: number) => void
  onStart: () => void
  soundOn: boolean
  setSoundOn: (v: boolean) => void
}

function makeHorse(index: number): HorseConfig {
  return {
    id: `h-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`,
    number: index + 1,
    name: '',
    colorKey: defaultColorKeyForIndex(index),
  }
}

export default function SetupScreen({
  horses,
  setHorses,
  durationSeconds,
  setDurationSeconds,
  onStart,
  soundOn,
  setSoundOn,
}: SetupScreenProps) {
  const [countInput, setCountInput] = useState(String(horses.length))

  function resizeHorses(count: number) {
    const clamped = Math.max(MIN_HORSES, Math.min(MAX_HORSES, count))
    setCountInput(String(clamped))
    if (clamped === horses.length) return
    if (clamped > horses.length) {
      const additions = Array.from({ length: clamped - horses.length }, (_, i) => makeHorse(horses.length + i))
      setHorses([...horses, ...additions])
    } else {
      setHorses(horses.slice(0, clamped))
    }
  }

  function updateHorse(id: string, patch: Partial<HorseConfig>) {
    setHorses(horses.map((h) => (h.id === id ? { ...h, ...patch } : h)))
  }

  const numbersValid = horses.every((h) => Number.isFinite(h.number))
  const canStart = horses.length >= MIN_HORSES && horses.length <= MAX_HORSES && numbersValid

  return (
    <div className="screen setup-screen">
      <header className="setup-header">
        <h1>🐎 Horse Race</h1>
        <p className="subtitle">Set up your horses, pick a race length, and see who wins.</p>
      </header>

      <section className="setup-panel">
        <div className="field-row">
          <label htmlFor="horse-count">Number of horses</label>
          <div className="count-control">
            <input
              id="horse-count"
              type="range"
              min={MIN_HORSES}
              max={MAX_HORSES}
              value={horses.length}
              onChange={(e) => resizeHorses(Number(e.target.value))}
            />
            <input
              type="number"
              className="count-number"
              min={MIN_HORSES}
              max={MAX_HORSES}
              value={countInput}
              onChange={(e) => setCountInput(e.target.value)}
              onBlur={(e) => resizeHorses(Number(e.target.value) || MIN_HORSES)}
            />
          </div>
        </div>

        <div className="field-row">
          <label htmlFor="duration">Race duration (seconds)</label>
          <input
            id="duration"
            type="number"
            min={MIN_DURATION}
            max={MAX_DURATION}
            value={durationSeconds}
            onChange={(e) => {
              const v = Number(e.target.value)
              setDurationSeconds(Math.max(MIN_DURATION, Math.min(MAX_DURATION, v || MIN_DURATION)))
            }}
          />
          <span className="hint">{MIN_DURATION}–{MAX_DURATION}s</span>
        </div>

        <div className="field-row">
          <label htmlFor="sound-toggle">Sound</label>
          <button
            id="sound-toggle"
            type="button"
            className={`toggle-btn ${soundOn ? 'on' : 'off'}`}
            onClick={() => setSoundOn(!soundOn)}
          >
            {soundOn ? '🔊 On' : '🔇 Off'}
          </button>
        </div>
      </section>

      <section className="horse-list">
        {horses.map((horse, i) => (
          <div className="horse-row" key={horse.id}>
            <HorseSprite colorKey={horse.colorKey} size={44} />
            <input
              type="number"
              className="horse-number-input"
              value={horse.number}
              onChange={(e) => updateHorse(horse.id, { number: Number(e.target.value) })}
              aria-label={`Horse ${i + 1} number`}
            />
            <input
              type="text"
              className="horse-name-input"
              placeholder={`Horse ${horse.number}`}
              value={horse.name}
              maxLength={24}
              onChange={(e) => updateHorse(horse.id, { name: e.target.value })}
              aria-label={`Horse ${i + 1} name`}
            />
            <select
              className="horse-color-select"
              value={horse.colorKey}
              onChange={(e) => updateHorse(horse.id, { colorKey: e.target.value })}
              aria-label={`Horse ${i + 1} color`}
            >
              {PALETTE.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </section>

      <footer className="setup-footer">
        <button className="start-btn" disabled={!canStart} onClick={onStart}>
          Start Race 🏁
        </button>
      </footer>
    </div>
  )
}
