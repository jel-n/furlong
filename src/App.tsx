import { useState } from 'react'
import type { HorseConfig, RaceResultEntry } from './types'
import { defaultColorKeyForIndex } from './colors'
import SetupScreen from './screens/SetupScreen'
import RaceScreen from './screens/RaceScreen'
import ResultsScreen from './screens/ResultsScreen'

type Screen = 'setup' | 'race' | 'results'

const DEFAULT_HORSE_COUNT = 6
const DEFAULT_DURATION = 20

function makeDefaultHorses(count: number): HorseConfig[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `h-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}`,
    number: i + 1,
    name: '',
    colorKey: defaultColorKeyForIndex(i),
  }))
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('setup')
  const [horses, setHorses] = useState<HorseConfig[]>(() => makeDefaultHorses(DEFAULT_HORSE_COUNT))
  const [durationSeconds, setDurationSeconds] = useState(DEFAULT_DURATION)
  const [soundOn, setSoundOn] = useState(false)
  const [results, setResults] = useState<RaceResultEntry[]>([])
  const [raceKey, setRaceKey] = useState(0)

  function handleStart() {
    setRaceKey((k) => k + 1)
    setScreen('race')
  }

  function handleFinish(finalResults: RaceResultEntry[]) {
    setResults(finalResults)
    setScreen('results')
  }

  function handleRaceAgain() {
    setScreen('setup')
  }

  function handleNewRace() {
    setHorses(makeDefaultHorses(DEFAULT_HORSE_COUNT))
    setDurationSeconds(DEFAULT_DURATION)
    setResults([])
    setScreen('setup')
  }

  return (
    <div className="app-shell">
      {screen === 'setup' && (
        <SetupScreen
          horses={horses}
          setHorses={setHorses}
          durationSeconds={durationSeconds}
          setDurationSeconds={setDurationSeconds}
          onStart={handleStart}
          soundOn={soundOn}
          setSoundOn={setSoundOn}
        />
      )}
      {screen === 'race' && (
        <RaceScreen
          key={raceKey}
          horses={horses}
          durationSeconds={durationSeconds}
          soundOn={soundOn}
          onFinish={handleFinish}
        />
      )}
      {screen === 'results' && (
        <ResultsScreen results={results} onRaceAgain={handleRaceAgain} onNewRace={handleNewRace} />
      )}
    </div>
  )
}
